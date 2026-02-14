/**
 * Routes Page
 * Main page for the Routes tab
 */

import { useState, useEffect } from 'react';
import { useRoutes } from '../hooks/useRoutes';
import { Container } from '../components/Container';
import { RoutesFilters } from './routes/RoutesFilters';
import { RoutesTable } from './routes/RoutesTable';

export const Routes = () => {
  const { routes, loading, error, filters, applyFilters, setBaseline, getFilterOptions } = useRoutes();
  const [localError, setLocalError] = useState<string | null>(error);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleFiltersChange = async (newFilters: { vesselType?: string[]; fuelType?: string[]; year?: number[] }) => {
    await applyFilters(newFilters);
  };

  const handleSetBaseline = async (routeId: string) => {
    try {
      setLocalError(null);
      await setBaseline(routeId);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to set baseline');
    }
  };

  const filterOptions = getFilterOptions();

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">Routes</h2>
          <p className="mt-1 text-muted-foreground">
            Manage shipping routes and their compliance metrics
          </p>
        </div>

        {/* Error Alert */}
        {localError && (
          <div className="rounded-lg border border-error/30 bg-error/10 p-4 text-error">
            <p className="font-medium">Error</p>
            <p className="text-sm">{localError}</p>
          </div>
        )}

        {/* Filters */}
        <RoutesFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          vesselTypeOptions={filterOptions.vesselTypes}
          fuelTypeOptions={filterOptions.fuelTypes}
          yearOptions={filterOptions.years}
        />

        {/* Table */}
        <RoutesTable
          routes={routes}
          loading={loading}
          onSetBaseline={handleSetBaseline}
        />
      </div>
    </Container>
  );
};
