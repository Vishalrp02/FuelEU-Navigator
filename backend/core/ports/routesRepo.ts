import type { RouteDTO } from "../../../shared/api";

export interface IRoutesRepo {
  getAll(filters?: {
    vesselType?: string[];
    fuelType?: string[];
    year?: number[];
  }): Promise<RouteDTO[]>;
  setBaselineByRouteId(routeId: string): Promise<void>;
  getBaseline(): Promise<RouteDTO | null>;
}
