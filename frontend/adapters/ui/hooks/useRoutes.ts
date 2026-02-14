/**
 * useRoutes Hook
 * Manages route data fetching and filtering
 */

import { useState, useEffect } from 'react';
import type { Route, RouteFilters } from '../../../core/domain/routes';
import { RouteService } from '../../../core/application/routeService';
import { HttpRoutesApi } from '../../infrastructure/httpRoutesApi';

const routeService = new RouteService(new HttpRoutesApi());

interface UseRoutesState {
  routes: Route[];
  loading: boolean;
  error: string | null;
  filters: RouteFilters;
}

export const useRoutes = () => {
  const [state, setState] = useState<UseRoutesState>({
    routes: [],
    loading: true,
    error: null,
    filters: {},
  });

  // Initial load
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const routes = await routeService.getRoutes();
        setState(prev => ({ ...prev, routes, loading: false }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Failed to load routes',
          loading: false,
        }));
      }
    };

    loadRoutes();
  }, []);

  const applyFilters = async (filters: RouteFilters) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null, filters }));
      const routes = await routeService.getRoutes(filters);
      setState(prev => ({ ...prev, routes, loading: false }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to apply filters',
        loading: false,
      }));
    }
  };

  const setBaseline = async (routeId: string) => {
    try {
      await routeService.setBaseline(routeId);
      // Reload routes to reflect baseline change
      const routes = await routeService.getRoutes(state.filters);
      setState(prev => ({ ...prev, routes }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to set baseline',
      }));
    }
  };

  const getFilterOptions = () => {
    const vesselTypes = new Set<string>();
    const fuelTypes = new Set<string>();
    const years = new Set<number>();

    state.routes.forEach(route => {
      vesselTypes.add(route.vesselType);
      fuelTypes.add(route.fuelType);
      years.add(route.year);
    });

    return {
      vesselTypes: Array.from(vesselTypes).sort(),
      fuelTypes: Array.from(fuelTypes).sort(),
      years: Array.from(years).sort(),
    };
  };

  return {
    ...state,
    applyFilters,
    setBaseline,
    getFilterOptions,
  };
};
