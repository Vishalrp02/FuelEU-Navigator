/**
 * Compliance Application Service
 * Contains use-cases for banking and pooling operations
 */

import type { ICompliancePort } from '../ports/compliancePort';
import type { ComplianceBalance, BankingOperation, PoolMember } from '../domain/compliance';
import { canBank, canApply, isValidPooling } from '../domain/compliance';

export class ComplianceService {
  constructor(private compliancePort: ICompliancePort) {}

  // Banking Operations
  async getComplianceBalance(year: number): Promise<ComplianceBalance> {
    return this.compliancePort.fetchComplianceBalance(year);
  }

  async bankCompliance(year: number, amount: number): Promise<BankingOperation> {
    const balance = await this.getComplianceBalance(year);
    
    if (!canBank(balance.cb)) {
      throw new Error('Cannot bank with non-positive compliance balance');
    }

    return this.compliancePort.bankCompliance(year, amount);
  }

  async applyBanked(year: number, amount: number): Promise<BankingOperation> {
    const balance = await this.getComplianceBalance(year);
    
    if (!canApply(balance.cb)) {
      throw new Error('Cannot apply banked credit with non-positive compliance balance');
    }

    return this.compliancePort.applyBanked(year, amount);
  }

  // Pooling Operations
  async getAdjustedCB(year: number): Promise<PoolMember[]> {
    return this.compliancePort.fetchAdjustedCB(year);
  }

  async validatePooling(members: PoolMember[]): Promise<{ isValid: boolean; errors: string[] }> {
    return isValidPooling(members);
  }

  async createPool(members: PoolMember[]): Promise<{ poolId: string; members: PoolMember[] }> {
    const validation = await this.validatePooling(members);
    if (!validation.isValid) {
      throw new Error(`Invalid pooling: ${validation.errors.join(', ')}`);
    }

    return this.compliancePort.createPool(members);
  }
}
