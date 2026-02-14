/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Fuel EU domain shared types
 */
export type VesselType = "Container" | "BulkCarrier" | "Tanker" | "RoRo";
export type FuelType = "HFO" | "LNG" | "MGO";

export interface RouteDTO {
  id: number;
  route_id: string;
  year: number;
  vessel_type: VesselType;
  fuel_type: FuelType;
  ghg_intensity: number; // gCO2e/MJ
  fuel_consumption_t: number; // tonnes
  distance_km: number;
  total_emissions_t: number;
  is_baseline: boolean;
}

export interface RouteFiltersDTO {
  vesselType?: VesselType[];
  fuelType?: FuelType[];
  year?: number[];
}

export interface ComparisonItemDTO {
  baseline: RouteDTO;
  comparison: RouteDTO;
  percentDifference: number;
  compliant: boolean;
}

export interface ComplianceBalanceDTO {
  ship_id: string;
  year: number;
  cb_gco2eq: number;
}

export interface BankingOperationDTO {
  ship_id: string;
  year: number;
  applied_gco2eq: number;
  cb_before_gco2eq: number;
  cb_after_gco2eq: number;
}

export interface BankRecordDTO {
  id: number;
  ship_id: string;
  year: number;
  amount_gco2eq: number;
  created_at: string;
}

export interface PoolMemberDTO {
  ship_id: string;
  cb_before: number;
  cb_after: number;
}

export interface CreatePoolRequestDTO {
  year: number;
  members: Array<{ ship_id: string; cb_before: number }>;
}

export interface CreatePoolResponseDTO {
  pool_id: string;
  year: number;
  members: PoolMemberDTO[];
}

export const COMPLIANCE_TARGET_GCO2E_MJ = 89.3368;

export function computeEnergyMJ(fuelConsumptionTonnes: number): number {
  return fuelConsumptionTonnes * 41000;
}

export function computeComplianceBalance(actualIntensity: number, energyMJ: number): number {
  const delta = COMPLIANCE_TARGET_GCO2E_MJ - actualIntensity;
  return delta * energyMJ;
}
