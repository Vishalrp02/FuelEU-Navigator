import type { IRoutesPort } from "../../core/ports/routesPort";
import type { Route, RouteFilters } from "../../core/domain/routes";
import type { RouteDTO, ComparisonItemDTO } from "@shared/api";

function mapDtoToRoute(dto: RouteDTO): Route {
  return {
    routeId: dto.route_id,
    vesselType: dto.vessel_type as Route["vesselType"],
    fuelType: dto.fuel_type as Route["fuelType"],
    year: dto.year,
    ghgIntensity: dto.ghg_intensity,
    fuelConsumption: dto.fuel_consumption_t,
    distance: dto.distance_km,
    totalEmissions: dto.total_emissions_t,
    isBaseline: dto.is_baseline,
  };
}

export class HttpRoutesApi implements IRoutesPort {
  async fetchRoutes(_filters?: RouteFilters): Promise<Route[]> {
    const res = await fetch("/api/routes");
    const data = (await res.json()) as RouteDTO[];
    return data.map(mapDtoToRoute);
  }

  async setBaseline(routeId: string): Promise<void> {
    await fetch(`/api/routes/${routeId}/baseline`, { method: "POST" });
  }

  async fetchComparison(): Promise<{ baseline: Route; comparison: Route }[]> {
    const res = await fetch("/api/routes/comparison");
    const data = (await res.json()) as ComparisonItemDTO[];
    return data.map((x) => ({
      baseline: mapDtoToRoute(x.baseline),
      comparison: mapDtoToRoute(x.comparison),
    }));
  }
}
