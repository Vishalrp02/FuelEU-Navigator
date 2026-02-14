import type { IComplianceRepo } from "../../../core/ports/complianceRepo";
import { query } from "../../../infrastructure/db/pg";
import type { ComplianceBalanceDTO, BankRecordDTO, BankingOperationDTO, PoolMemberDTO } from "../../../../shared/api";

export class PgComplianceRepo implements IComplianceRepo {
  async getComplianceSnapshot(shipId: string, year: number): Promise<ComplianceBalanceDTO | null> {
    const { rows } = await query<ComplianceBalanceDTO>(
      "SELECT ship_id, year, cb_gco2eq FROM ship_compliance WHERE ship_id=$1 AND year=$2 ORDER BY created_at DESC LIMIT 1",
      [shipId, year]
    );
    return rows[0] || null;
  }

  async saveComplianceSnapshot(snapshot: ComplianceBalanceDTO): Promise<void> {
    await query(
      "INSERT INTO ship_compliance (ship_id, year, cb_gco2eq) VALUES ($1, $2, $3)",
      [snapshot.ship_id, snapshot.year, snapshot.cb_gco2eq]
    );
  }

  async getBankRecords(shipId: string, year: number): Promise<BankRecordDTO[]> {
    const { rows } = await query<BankRecordDTO>(
      "SELECT id, ship_id, year, amount_gco2eq, created_at FROM bank_entries WHERE ship_id=$1 AND year=$2 ORDER BY created_at ASC",
      [shipId, year]
    );
    return rows;
  }

  async addBankRecord(shipId: string, year: number, amount: number): Promise<BankRecordDTO> {
    const { rows } = await query<BankRecordDTO>(
      "INSERT INTO bank_entries (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3) RETURNING id, ship_id, year, amount_gco2eq, created_at",
      [shipId, year, amount]
    );
    return rows[0];
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<BankingOperationDTO> {
    await this.addBankRecord(shipId, year, amount);
    return {
      ship_id: shipId,
      year,
      applied_gco2eq: amount,
      cb_before_gco2eq: 0,
      cb_after_gco2eq: 0,
    };
  }

  async createPool(year: number): Promise<{ pool_id: string }> {
    const { rows } = await query<{ id: number }>(
      "INSERT INTO pools (year) VALUES ($1) RETURNING id",
      [year]
    );
    return { pool_id: String(rows[0].id) };
  }

  async addPoolMember(poolId: string, member: PoolMemberDTO): Promise<void> {
    await query(
      "INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after) VALUES ($1, $2, $3, $4)",
      [Number(poolId), member.ship_id, member.cb_before, member.cb_after]
    );
  }

  async fetchAdjustedMembers(year: number): Promise<PoolMemberDTO[]> {
    // Derive members from routes of the given year and add bank adjustments
    const { rows: routes } = await query<{ ship_id: string; fuel_consumption_t: number; ghg_intensity: number }>(
      "SELECT route_id as ship_id, fuel_consumption_t, ghg_intensity FROM routes WHERE year=$1",
      [year]
    );
    const members: PoolMemberDTO[] = [];
    for (const r of routes) {
      const energy = r.fuel_consumption_t * 41000;
      const cb = (89.3368 - Number(r.ghg_intensity)) * energy;
      const { rows: banks } = await query<{ amount_gco2eq: number }>(
        "SELECT amount_gco2eq FROM bank_entries WHERE ship_id=$1 AND year=$2",
        [r.ship_id, year]
      );
      const applied = banks.reduce((s, b) => s + Number(b.amount_gco2eq), 0);
      members.push({ ship_id: r.ship_id, cb_before: cb, cb_after: cb + applied });
    }
    return members;
  }
}
