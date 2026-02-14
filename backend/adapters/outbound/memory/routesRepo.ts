import type { IRoutesRepo } from "../../../core/ports/routesRepo";
import type { RouteDTO } from "../../../../shared/api";

const ROUTES: RouteDTO[] = [
  { id: 1, route_id: "R001", year: 2024, vessel_type: "Container", fuel_type: "HFO", ghg_intensity: 91.0, fuel_consumption_t: 5000, distance_km: 12000, total_emissions_t: 4500, is_baseline: true },
  { id: 2, route_id: "R002", year: 2024, vessel_type: "BulkCarrier", fuel_type: "LNG", ghg_intensity: 88.0, fuel_consumption_t: 4800, distance_km: 11500, total_emissions_t: 4200, is_baseline: false },
  { id: 3, route_id: "R003", year: 2024, vessel_type: "Tanker", fuel_type: "MGO", ghg_intensity: 93.5, fuel_consumption_t: 5100, distance_km: 12500, total_emissions_t: 4700, is_baseline: false },
  { id: 4, route_id: "R004", year: 2025, vessel_type: "RoRo", fuel_type: "HFO", ghg_intensity: 89.2, fuel_consumption_t: 4900, distance_km: 11800, total_emissions_t: 4300, is_baseline: false },
  { id: 5, route_id: "R005", year: 2025, vessel_type: "Container", fuel_type: "LNG", ghg_intensity: 90.5, fuel_consumption_t: 4950, distance_km: 11900, total_emissions_t: 4400, is_baseline: false },
];

export class MemoryRoutesRepo implements IRoutesRepo {
  async getAll(filters?: { vesselType?: string[]; fuelType?: string[]; year?: number[] }): Promise<RouteDTO[]> {
    let res = [...ROUTES];
    if (filters?.vesselType?.length) {
      res = res.filter((r) => filters.vesselType!.includes(r.vessel_type));
    }
    if (filters?.fuelType?.length) {
      res = res.filter((r) => filters.fuelType!.includes(r.fuel_type));
    }
    if (filters?.year?.length) {
      res = res.filter((r) => filters.year!.includes(r.year));
    }
    return res;
  }
  async setBaselineByRouteId(routeId: string): Promise<void> {
    ROUTES.forEach((r) => (r.is_baseline = r.route_id === routeId));
  }
  async getBaseline(): Promise<RouteDTO | null> {
    return ROUTES.find((r) => r.is_baseline) ?? null;
  }
}
