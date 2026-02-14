/**
 * useBanking Hook
 * Manages banking operations and compliance balance state
 */

import { useState, useEffect } from 'react';
import type { ComplianceBalance, BankingOperation } from '../../../core/domain/compliance';
import { ComplianceService } from '../../../core/application/complianceService';
import { HttpComplianceApi } from '../../infrastructure/httpComplianceApi';

const complianceService = new ComplianceService(new HttpComplianceApi());

interface UseBankingState {
  currentBalance: ComplianceBalance | null;
  lastOperation: BankingOperation | null;
  loading: boolean;
  error: string | null;
  selectedYear: number;
}

export const useBanking = (initialYear: number = 2024) => {
  const [state, setState] = useState<UseBankingState>({
    currentBalance: null,
    lastOperation: null,
    loading: true,
    error: null,
    selectedYear: initialYear,
  });

  // Load balance when year changes
  useEffect(() => {
    const loadBalance = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const balance = await complianceService.getComplianceBalance(state.selectedYear);
        setState(prev => ({ ...prev, currentBalance: balance, loading: false }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Failed to load balance',
          loading: false,
        }));
      }
    };

    loadBalance();
  }, [state.selectedYear]);

  const bankCompliance = async (amount: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const operation = await complianceService.bankCompliance(state.selectedYear, amount);
      setState(prev => ({
        ...prev,
        currentBalance: { year: state.selectedYear, cb: operation.cbAfter },
        lastOperation: operation,
        loading: false,
      }));
      return;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to bank compliance';
      setState(prev => ({ ...prev, error: errorMsg, loading: false }));
      throw err;
    }
  };

  const applyBanked = async (amount: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const operation = await complianceService.applyBanked(state.selectedYear, amount);
      setState(prev => ({
        ...prev,
        currentBalance: { year: state.selectedYear, cb: operation.cbAfter },
        lastOperation: operation,
        loading: false,
      }));
      return;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to apply banked credit';
      setState(prev => ({ ...prev, error: errorMsg, loading: false }));
      throw err;
    }
  };

  const setYear = (year: number) => {
    setState(prev => ({ ...prev, selectedYear: year }));
  };

  return {
    ...state,
    bankCompliance,
    applyBanked,
    setYear,
    canBank: (state.currentBalance?.cb ?? 0) > 0,
    canApply: (state.currentBalance?.cb ?? 0) > 0,
  };
};
