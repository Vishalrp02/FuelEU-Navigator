/**
 * Routes Domain Model
 * Core business entities for route management
 */

export type VesselType = 'Container' | 'BulkCarrier' | 'Tanker' | 'RoRo';
export type FuelType = 'HFO' | 'LNG' | 'MGO';

export interface Route {
  routeId: string;
  vesselType: VesselType;
  fuelType: FuelType;
  year: number;
  ghgIntensity: number; // gCO₂e/MJ
  fuelConsumption: number; // tonnes
  distance: number; // km
  totalEmissions: number; // tonnes
  isBaseline?: boolean;
}

export interface RouteFilters {
  vesselType?: VesselType[];
  fuelType?: FuelType[];
  year?: number[];
}

export const COMPLIANCE_TARGET = 89.3368; // gCO₂e/MJ (2% below 91.16)

export const isCompliant = (ghgIntensity: number): boolean => {
  return ghgIntensity <= COMPLIANCE_TARGET;
};

export const calculatePercentDifference = (comparison: number, baseline: number): number => {
  if (baseline === 0) return 0;
  return ((comparison / baseline) - 1) * 100;
};
