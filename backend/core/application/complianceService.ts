import { computeComplianceBalance, computeEnergyMJ } from "../../../shared/api";
import type { ComplianceBalanceDTO, BankingOperationDTO, PoolMemberDTO } from "../../../shared/api";
import type { IComplianceRepo } from "../ports/complianceRepo";

export class ComplianceService {
  constructor(private repo: IComplianceRepo) {}

  async computeAndStoreCB(shipId: string, year: number, actualIntensity: number, fuelConsumptionTonnes: number): Promise<ComplianceBalanceDTO> {
    const energyMJ = computeEnergyMJ(fuelConsumptionTonnes);
    const cb = computeComplianceBalance(actualIntensity, energyMJ);
    const snapshot: ComplianceBalanceDTO = { ship_id: shipId, year, cb_gco2eq: cb };
    await this.repo.saveComplianceSnapshot(snapshot);
    return snapshot;
  }

  async getAdjustedCB(shipId: string, year: number): Promise<number> {
    const records = await this.repo.getBankRecords(shipId, year);
    const applied = records.reduce((sum, r) => sum + r.amount_gco2eq, 0);
    const snapshot = await this.repo.getComplianceSnapshot(shipId, year);
    const base = snapshot?.cb_gco2eq ?? 0;
    return base + applied;
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankingOperationDTO> {
    const adjusted = await this.getAdjustedCB(shipId, year);
    if (adjusted <= 0) {
      throw new Error("Cannot bank with non-positive compliance balance");
    }
    await this.repo.addBankRecord(shipId, year, -Math.min(amount, adjusted));
    const after = await this.getAdjustedCB(shipId, year);
    return {
      ship_id: shipId,
      year,
      applied_gco2eq: -Math.min(amount, adjusted),
      cb_before_gco2eq: adjusted,
      cb_after_gco2eq: after,
    };
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<BankingOperationDTO> {
    const records = await this.repo.getBankRecords(shipId, year);
    const available = records.filter((r) => r.amount_gco2eq > 0).reduce((s, r) => s + r.amount_gco2eq, 0);
    if (amount > available) {
      throw new Error("Amount exceeds available banked surplus");
    }
    const before = await this.getAdjustedCB(shipId, year);
    const op = await this.repo.applyBanked(shipId, year, amount);
    const after = await this.getAdjustedCB(shipId, year);
    return { ...op, cb_before_gco2eq: before, cb_after_gco2eq: after };
  }

  async createPool(year: number, members: Array<{ ship_id: string; cb_before: number }>): Promise<{ pool_id: string; members: PoolMemberDTO[] }> {
    const total = members.reduce((s, m) => s + m.cb_before, 0);
    if (total < 0) {
      throw new Error("Pool sum must be >= 0");
    }

    const sorted = [...members].sort((a, b) => b.cb_before - a.cb_before);
    const deficits = sorted.filter((m) => m.cb_before < 0);
    const surplus = sorted.filter((m) => m.cb_before > 0);

    let surplusAvailable = surplus.reduce((s, m) => s + m.cb_before, 0);
    const allocations: PoolMemberDTO[] = members.map((m) => ({ ship_id: m.ship_id, cb_before: m.cb_before, cb_after: m.cb_before }));

    for (const d of deficits) {
      const needed = -d.cb_before;
      const consume = Math.min(needed, surplusAvailable);
      surplusAvailable -= consume;
      const idx = allocations.findIndex((a) => a.ship_id === d.ship_id);
      allocations[idx].cb_after = allocations[idx].cb_before + consume;
    }

    // enforce rules
    for (const a of allocations) {
      if (a.cb_before < 0 && a.cb_after < a.cb_before) {
        throw new Error(`Deficit ship ${a.ship_id} cannot exit worse`);
      }
      if (a.cb_before > 0 && a.cb_after < 0) {
        throw new Error(`Surplus ship ${a.ship_id} cannot become negative`);
      }
    }

    const created = await this.repo.createPool(year);
    for (const a of allocations) {
      await this.repo.addPoolMember(created.pool_id, a);
    }
    return { pool_id: created.pool_id, members: allocations };
  }
}
