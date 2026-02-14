import type { ICompliancePort } from "../../core/ports/compliancePort";
import type { ComplianceBalance, BankingOperation, PoolMember } from "../../core/domain/compliance";
import type { BankingOperationDTO, PoolMemberDTO, CreatePoolResponseDTO } from "@shared/api";

const DEFAULT_SHIP_ID = "R001";

export class HttpComplianceApi implements ICompliancePort {
  async fetchComplianceBalance(year: number): Promise<ComplianceBalance> {
    const res = await fetch(`/api/compliance/adjusted-members?year=${year}`);
    const members = (await res.json()) as PoolMemberDTO[];
    const m = members.find((x) => x.ship_id === DEFAULT_SHIP_ID) ?? members[0];
    const cb = m ? m.cb_after : 0;
    return { year, cb };
  }

  async bankCompliance(year: number, amount: number): Promise<BankingOperation> {
    const res = await fetch(`/api/banking/bank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipId: DEFAULT_SHIP_ID, year, amount }),
    });
    const op = (await res.json()) as BankingOperationDTO;
    return {
      year: op.year,
      cbBefore: op.cb_before_gco2eq,
      applied: op.applied_gco2eq,
      cbAfter: op.cb_after_gco2eq,
    };
  }

  async applyBanked(year: number, amount: number): Promise<BankingOperation> {
    const res = await fetch(`/api/banking/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipId: DEFAULT_SHIP_ID, year, amount }),
    });
    const op = (await res.json()) as BankingOperationDTO;
    return {
      year: op.year,
      cbBefore: op.cb_before_gco2eq,
      applied: op.applied_gco2eq,
      cbAfter: op.cb_after_gco2eq,
    };
  }

  async fetchAdjustedCB(year: number): Promise<PoolMember[]> {
    const res = await fetch(`/api/compliance/adjusted-members?year=${year}`);
    const members = (await res.json()) as PoolMemberDTO[];
    return members.map((m) => ({
      shipId: m.ship_id,
      adjustedCB: m.cb_before,
      cbAfterPool: m.cb_after,
    }));
  }

  async createPool(members: PoolMember[]): Promise<{ poolId: string; members: PoolMember[] }> {
    const res = await fetch(`/api/pools`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: new Date().getFullYear(),
        members: members.map((m) => ({ ship_id: m.shipId, cb_before: m.adjustedCB })),
      }),
    });
    const data = (await res.json()) as CreatePoolResponseDTO;
    return {
      poolId: data.pool_id,
      members: data.members.map((m) => ({ shipId: m.ship_id, adjustedCB: m.cb_before, cbAfterPool: m.cb_after })),
    };
  }
}
