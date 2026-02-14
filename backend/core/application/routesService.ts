import type { RouteDTO, ComparisonItemDTO } from "../../../shared/api";
import { COMPLIANCE_TARGET_GCO2E_MJ } from "../../../shared/api";
import type { IRoutesRepo } from "../ports/routesRepo";

export class RoutesService {
  constructor(private repo: IRoutesRepo) {}

  async list(filters?: {
    vesselType?: string[];
    fuelType?: string[];
    year?: number[];
  }): Promise<RouteDTO[]> {
    return this.repo.getAll(filters);
  }

  async setBaseline(routeId: string): Promise<void> {
    return this.repo.setBaselineByRouteId(routeId);
  }

  async comparison(): Promise<ComparisonItemDTO[]> {
    const routes = await this.repo.getAll();
    const baseline = routes.find((r) => r.is_baseline) || null;
    if (!baseline) return [];
    return routes
      .filter((r) => r.route_id !== baseline.route_id)
      .map((r) => {
        const percentDifference = ((r.ghg_intensity / baseline.ghg_intensity) - 1) * 100;
        const compliant = r.ghg_intensity <= (COMPLIANCE_TARGET_GCO2E_MJ as number);
        return { baseline, comparison: r, percentDifference, compliant };
      });
  }
}
