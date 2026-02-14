/**
 * RoutesTable Component
 * Displays all routes in a table with baseline selection
 */

import { useState } from 'react';
import type { Route } from '../../../../core/domain/routes';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';

interface RoutesTableProps {
  routes: Route[];
  loading: boolean;
  onSetBaseline: (routeId: string) => Promise<void>;
}

export const RoutesTable = ({ routes, loading, onSetBaseline }: RoutesTableProps) => {
  const [settingBaseline, setSettingBaseline] = useState<string | null>(null);

  const handleSetBaseline = async (routeId: string) => {
    try {
      setSettingBaseline(routeId);
      await onSetBaseline(routeId);
    } finally {
      setSettingBaseline(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading routes...</p>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No routes found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Route ID</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Vessel Type</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Fuel Type</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Year</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">GHG Intensity (gCO₂e/MJ)</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Fuel (t)</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Distance (km)</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Emissions (t)</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Status</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {routes.map(route => {
            const compliant = route.ghgIntensity <= 89.3368;
            return (
              <tr key={route.routeId} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{route.routeId}</td>
                <td className="px-4 py-3 text-foreground">{route.vesselType}</td>
                <td className="px-4 py-3 text-foreground">{route.fuelType}</td>
                <td className="px-4 py-3 text-foreground">{route.year}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">
                  {route.ghgIntensity.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {route.fuelConsumption.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {route.distance.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {route.totalEmissions.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge compliant={compliant} />
                </td>
                <td className="px-4 py-3 text-center">
                  <Button
                    onClick={() => handleSetBaseline(route.routeId)}
                    disabled={settingBaseline !== null || route.isBaseline}
                    size="sm"
                    variant={route.isBaseline ? 'secondary' : 'default'}
                  >
                    {settingBaseline === route.routeId ? 'Setting...' : route.isBaseline ? '✓ Baseline' : 'Set Baseline'}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
