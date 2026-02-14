/**
 * RoutesFilters Component
 * Filter controls for routes table
 */

import type { RouteFilters, VesselType, FuelType } from '../../../../core/domain/routes';
import { Button } from '@/components/ui/button';

interface RoutesFiltersProps {
  filters: RouteFilters;
  onFiltersChange: (filters: RouteFilters) => void;
  vesselTypeOptions: string[];
  fuelTypeOptions: string[];
  yearOptions: number[];
}

export const RoutesFilters = ({
  filters,
  onFiltersChange,
  vesselTypeOptions,
  fuelTypeOptions,
  yearOptions,
}: RoutesFiltersProps) => {
  const handleVesselTypeChange = (type: VesselType) => {
    const selected = (filters.vesselType || []) as VesselType[];
    const updated = selected.includes(type)
      ? selected.filter(t => t !== type)
      : [...selected, type];
    onFiltersChange({
      ...filters,
      vesselType: updated.length > 0 ? updated : undefined,
    });
  };

  const handleFuelTypeChange = (type: FuelType) => {
    const selected = (filters.fuelType || []) as FuelType[];
    const updated = selected.includes(type)
      ? selected.filter(t => t !== type)
      : [...selected, type];
    onFiltersChange({
      ...filters,
      fuelType: updated.length > 0 ? updated : undefined,
    });
  };

  const handleYearChange = (year: number) => {
    const selected = filters.year || [];
    const updated = selected.includes(year)
      ? selected.filter(y => y !== year)
      : [...selected, year];
    onFiltersChange({
      ...filters,
      year: updated.length > 0 ? updated : undefined,
    });
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Vessel Type Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Vessel Type</label>
          <div className="space-y-2">
            {vesselTypeOptions.map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(filters.vesselType || []).includes(type as VesselType)}
                  onChange={() => handleVesselTypeChange(type as VesselType)}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm text-foreground">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Fuel Type Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Fuel Type</label>
          <div className="space-y-2">
            {fuelTypeOptions.map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(filters.fuelType || []).includes(type as FuelType)}
                  onChange={() => handleFuelTypeChange(type as FuelType)}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm text-foreground">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Year</label>
          <div className="space-y-2">
            {yearOptions.map(year => (
              <label key={year} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(filters.year || []).includes(year)}
                  onChange={() => handleYearChange(year)}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm text-foreground">{year}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
