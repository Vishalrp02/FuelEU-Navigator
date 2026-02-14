/**
 * Compliance Port (Outbound)
 * Defines the interface for banking and pooling operations
 */

import type { ComplianceBalance, BankingOperation, PoolMember } from '../domain/compliance';

export interface ICompliancePort {
  // Banking operations
  fetchComplianceBalance(year: number): Promise<ComplianceBalance>;
  bankCompliance(year: number, amount: number): Promise<BankingOperation>;
  applyBanked(year: number, amount: number): Promise<BankingOperation>;

  // Pooling operations
  fetchAdjustedCB(year: number): Promise<PoolMember[]>;
  createPool(members: PoolMember[]): Promise<{ poolId: string; members: PoolMember[] }>;
}
