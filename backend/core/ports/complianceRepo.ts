import type { ComplianceBalanceDTO, BankRecordDTO, BankingOperationDTO, PoolMemberDTO } from "../../../shared/api";

export interface IComplianceRepo {
  getComplianceSnapshot(shipId: string, year: number): Promise<ComplianceBalanceDTO | null>;
  saveComplianceSnapshot(snapshot: ComplianceBalanceDTO): Promise<void>;

  getBankRecords(shipId: string, year: number): Promise<BankRecordDTO[]>;
  addBankRecord(shipId: string, year: number, amount: number): Promise<BankRecordDTO>;

  applyBanked(shipId: string, year: number, amount: number): Promise<BankingOperationDTO>;

  createPool(year: number): Promise<{ pool_id: string }>;
  addPoolMember(poolId: string, member: PoolMemberDTO): Promise<void>;
  fetchAdjustedMembers(year: number): Promise<PoolMemberDTO[]>;
}
