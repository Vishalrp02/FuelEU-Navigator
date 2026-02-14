/**
 * usePooling Hook
 * Manages pooling operations and validation
 */

import { useState, useEffect } from 'react';
import type { PoolMember } from '../../../core/domain/compliance';
import { ComplianceService } from '../../../core/application/complianceService';
import { HttpComplianceApi } from '../../infrastructure/httpComplianceApi';

const complianceService = new ComplianceService(new HttpComplianceApi());

interface UsePoolingState {
  members: PoolMember[];
  selectedMembers: PoolMember[];
  loading: boolean;
  error: string | null;
  validationErrors: string[];
  selectedYear: number;
  poolId: string | null;
}

export const usePooling = (initialYear: number = 2024) => {
  const [state, setState] = useState<UsePoolingState>({
    members: [],
    selectedMembers: [],
    loading: true,
    error: null,
    validationErrors: [],
    selectedYear: initialYear,
    poolId: null,
  });

  // Load members when year changes
  useEffect(() => {
    const loadMembers = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const members = await complianceService.getAdjustedCB(state.selectedYear);
        setState(prev => ({
          ...prev,
          members,
          selectedMembers: [], // Reset selection when loading new year
          loading: false,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Failed to load pool members',
          loading: false,
        }));
      }
    };

    loadMembers();
  }, [state.selectedYear]);

  const toggleMember = (shipId: string) => {
    setState(prev => {
      const member = prev.members.find(m => m.shipId === shipId);
      if (!member) return prev;

      const isSelected = prev.selectedMembers.some(m => m.shipId === shipId);
      const newSelected = isSelected
        ? prev.selectedMembers.filter(m => m.shipId !== shipId)
        : [...prev.selectedMembers, member];

      return { ...prev, selectedMembers: newSelected };
    });
  };

  const validateSelected = async () => {
    try {
      const validation = await complianceService.validatePooling(state.selectedMembers);
      setState(prev => ({
        ...prev,
        validationErrors: validation.errors,
      }));
      return validation;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Validation failed';
      setState(prev => ({ ...prev, error: errorMsg }));
      throw err;
    }
  };

  const createPool = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null, validationErrors: [] }));

      // Validate first
      const validation = await validateSelected();
      if (!validation.isValid) {
        setState(prev => ({
          ...prev,
          validationErrors: validation.errors,
          loading: false,
        }));
        throw new Error('Pool validation failed');
      }

      // Create pool
      const result = await complianceService.createPool(state.selectedMembers);
      setState(prev => ({
        ...prev,
        poolId: result.poolId,
        selectedMembers: result.members,
        loading: false,
      }));
      return;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create pool';
      setState(prev => ({
        ...prev,
        error: errorMsg,
        loading: false,
      }));
      throw err;
    }
  };

  const setYear = (year: number) => {
    setState(prev => ({
      ...prev,
      selectedYear: year,
      selectedMembers: [], // Reset selection on year change
      poolId: null,
    }));
  };

  const getTotalAdjustedCB = () => {
    return state.selectedMembers.reduce((sum, m) => sum + m.adjustedCB, 0);
  };

  return {
    ...state,
    toggleMember,
    validateSelected,
    createPool,
    setYear,
    getTotalAdjustedCB,
    isPoolValid: getTotalAdjustedCB() >= 0 && state.validationErrors.length === 0,
  };
};
