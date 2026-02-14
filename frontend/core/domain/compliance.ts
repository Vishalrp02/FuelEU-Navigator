/**
 * Compliance Domain Model
 * Core business entities for banking and pooling operations
 */

export interface ComplianceBalance {
  year: number;
  cb: number; // Compliance Balance in tonnes CO2 equivalent
}

export interface BankingOperation {
  year: number;
  cbBefore: number;
  applied: number;
  cbAfter: number;
}

export interface PoolMember {
  shipId: string;
  adjustedCB: number; // Before pooling
  cbAfterPool?: number; // After pooling
}

export interface Pool {
  poolId: string;
  members: PoolMember[];
  totalAdjustedCB: number;
  isValid: boolean;
  validationErrors: string[];
}

/**
 * Banking Rules
 */
export const canBank = (cb: number): boolean => {
  return cb > 0;
};

export const canApply = (cb: number): boolean => {
  return cb > 0;
};

/**
 * Pooling Rules
 */
export const isValidPooling = (members: PoolMember[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const totalSum = members.reduce((sum, m) => sum + m.adjustedCB, 0);

  if (totalSum < 0) {
    errors.push('Pool sum must be >= 0');
  }

  // Check deficit ships (CB < 0 before pooling)
  const deficitShips = members.filter(m => m.adjustedCB < 0);
  for (const ship of deficitShips) {
    const afterPool = ship.cbAfterPool || 0;
    if (afterPool < ship.adjustedCB) {
      errors.push(`Deficit ship ${ship.shipId} cannot exit worse than before pooling`);
    }
  }

  // Check surplus ships (CB > 0 before pooling)
  const surplusShips = members.filter(m => m.adjustedCB > 0);
  for (const ship of surplusShips) {
    const afterPool = ship.cbAfterPool || 0;
    if (afterPool < 0) {
      errors.push(`Surplus ship ${ship.shipId} cannot exit negative after pooling`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
