/**
 * Mock Compliance API Adapter
 * Implements ICompliancePort with mock data
 */

import type { ICompliancePort } from '../../core/ports/compliancePort';
import type { ComplianceBalance, BankingOperation, PoolMember } from '../../core/domain/compliance';

// Mock compliance balance data
let MOCK_CB_BALANCE: Record<number, number> = {
  2024: 150, // Positive balance for 2024
  2025: -80, // Negative balance for 2025
};

// Mock adjusted CB data for pooling
const MOCK_ADJUSTED_CB: Record<number, PoolMember[]> = {
  2024: [
    { shipId: 'SHIP001', adjustedCB: 100 },
    { shipId: 'SHIP002', adjustedCB: 50 },
    { shipId: 'SHIP003', adjustedCB: -20 },
  ],
  2025: [
    { shipId: 'SHIP004', adjustedCB: -80 },
    { shipId: 'SHIP005', adjustedCB: 120 },
    { shipId: 'SHIP006', adjustedCB: 30 },
  ],
};

// Track banking history for KPIs
let BANKING_HISTORY: Record<number, BankingOperation> = {
  2024: {
    year: 2024,
    cbBefore: 150,
    applied: 0,
    cbAfter: 150,
  },
  2025: {
    year: 2025,
    cbBefore: -80,
    applied: 0,
    cbAfter: -80,
  },
};

export class MockComplianceApi implements ICompliancePort {
  async fetchComplianceBalance(year: number): Promise<ComplianceBalance> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const cb = MOCK_CB_BALANCE[year] || 0;
    return { year, cb };
  }

  async bankCompliance(year: number, amount: number): Promise<BankingOperation> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const cbBefore = MOCK_CB_BALANCE[year] || 0;

    if (cbBefore <= 0) {
      throw new Error('Cannot bank with non-positive compliance balance');
    }

    // Bank the surplus (update internal state)
    const bankedAmount = Math.min(amount, cbBefore);
    MOCK_CB_BALANCE[year] = cbBefore - bankedAmount;

    const operation: BankingOperation = {
      year,
      cbBefore,
      applied: 0,
      cbAfter: MOCK_CB_BALANCE[year],
    };

    BANKING_HISTORY[year] = operation;
    return operation;
  }

  async applyBanked(year: number, amount: number): Promise<BankingOperation> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const cbBefore = MOCK_CB_BALANCE[year] || 0;

    if (cbBefore <= 0) {
      throw new Error('Cannot apply banked credit with non-positive compliance balance');
    }

    // Apply the banked credit
    const appliedAmount = amount;
    MOCK_CB_BALANCE[year] = cbBefore + appliedAmount;

    const operation: BankingOperation = {
      year,
      cbBefore,
      applied: appliedAmount,
      cbAfter: MOCK_CB_BALANCE[year],
    };

    BANKING_HISTORY[year] = operation;
    return operation;
  }

  async fetchAdjustedCB(year: number): Promise<PoolMember[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return MOCK_ADJUSTED_CB[year] || [];
  }

  async createPool(members: PoolMember[]): Promise<{ poolId: string; members: PoolMember[] }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Simple pool creation - distribute surplus to cover deficit
    const totalAdjustedCB = members.reduce((sum, m) => sum + m.adjustedCB, 0);
    
    if (totalAdjustedCB < 0) {
      throw new Error('Pool sum must be >= 0');
    }

    // Allocate pool surplus/deficit fairly
    const membersWithPool = members.map(member => ({
      ...member,
      cbAfterPool: member.adjustedCB + (totalAdjustedCB * (member.adjustedCB / members.reduce((sum, m) => sum + Math.abs(m.adjustedCB), 0))),
    }));

    return {
      poolId: `POOL-${Date.now()}`,
      members: membersWithPool,
    };
  }
}
