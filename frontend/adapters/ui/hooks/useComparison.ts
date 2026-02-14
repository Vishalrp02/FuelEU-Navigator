/**
 * useComparison Hook
 * Manages comparison data and compliance calculations
 */

import { useState, useEffect } from 'react';
import type { Route } from '../../../core/domain/routes';
import { RouteService } from '../../../core/application/routeService';
import { HttpRoutesApi } from '../../infrastructure/httpRoutesApi';

const routeService = new RouteService(new HttpRoutesApi());

export interface ComparisonData {
  baseline: Route;
  comparison: Route;
  percentDifference: number;
  compliant: boolean;
}

interface UseComparisonState {
  comparisonData: ComparisonData[];
  loading: boolean;
  error: string | null;
}

export const useComparison = () => {
  const [state, setState] = useState<UseComparisonState>({
    comparisonData: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadComparison = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await routeService.getComparisonData();
        setState(prev => ({ ...prev, comparisonData: data, loading: false }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Failed to load comparison data',
          loading: false,
        }));
      }
    };

    loadComparison();
  }, []);

  const refresh = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await routeService.getComparisonData();
      setState(prev => ({ ...prev, comparisonData: data, loading: false }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to refresh comparison data',
        loading: false,
      }));
    }
  };

  return {
    ...state,
    refresh,
    targetIntensity: 89.3368,
  };
};
