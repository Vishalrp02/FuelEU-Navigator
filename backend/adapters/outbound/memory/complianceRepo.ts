import type { IComplianceRepo } from "../../../core/ports/complianceRepo";
import type { ComplianceBalanceDTO, BankRecordDTO, BankingOperationDTO, PoolMemberDTO } from "../../../../shared/api";

const BANKS: BankRecordDTO[] = [];
const SNAPSHOTS: ComplianceBalanceDTO[] = [];
const POOLS: { id: string; year: number }[] = [];
const POOL_MEMBERS: { pool_id: string; member: PoolMemberDTO }[] = [];

export class MemoryComplianceRepo implements IComplianceRepo {
  async getComplianceSnapshot(shipId: string, year: number): Promise<ComplianceBalanceDTO | null> {
    return SNAPSHOTS.filter((s) => s.ship_id === shipId && s.year === year).slice(-1)[0] ?? null;
  }
  async saveComplianceSnapshot(snapshot: ComplianceBalanceDTO): Promise<void> {
    SNAPSHOTS.push(snapshot);
  }
  async getBankRecords(shipId: string, year: number): Promise<BankRecordDTO[]> {
    return BANKS.filter((b) => b.ship_id === shipId && b.year === year);
  }
  async addBankRecord(shipId: string, year: number, amount: number): Promise<BankRecordDTO> {
    const rec: BankRecordDTO = { id: BANKS.length + 1, ship_id: shipId, year, amount_gco2eq: amount, created_at: new Date().toISOString() };
    BANKS.push(rec);
    return rec;
  }
  async applyBanked(shipId: string, year: number, amount: number): Promise<BankingOperationDTO> {
    await this.addBankRecord(shipId, year, amount);
    return { ship_id: shipId, year, applied_gco2eq: amount, cb_before_gco2eq: 0, cb_after_gco2eq: 0 };
  }
  async createPool(year: number): Promise<{ pool_id: string }> {
    const id = String(POOLS.length + 1);
    POOLS.push({ id, year });
    return { pool_id: id };
  }
  async addPoolMember(poolId: string, member: PoolMemberDTO): Promise<void> {
    POOL_MEMBERS.push({ pool_id: poolId, member });
  }
  async fetchAdjustedMembers(year: number): Promise<PoolMemberDTO[]> {
    // derive from latest snapshots
    const ships = Array.from(new Set(SNAPSHOTS.filter((s) => s.year === year).map((s) => s.ship_id)));
    return ships.map((ship) => {
      const latest = SNAPSHOTS.filter((s) => s.ship_id === ship && s.year === year).slice(-1)[0];
      const applied = BANKS.filter((b) => b.ship_id === ship && b.year === year).reduce((sum, b) => sum + b.amount_gco2eq, 0);
      const before = latest?.cb_gco2eq ?? 0;
      return { ship_id: ship, cb_before: before, cb_after: before + applied };
    });
  }
}
