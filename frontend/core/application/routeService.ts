/**
 * Route Application Service
 * Contains use-cases for route operations
 */

import type { IRoutesPort } from '../ports/routesPort';
import type { Route, RouteFilters } from '../domain/routes';
import { calculatePercentDifference } from '../domain/routes';

export class RouteService {
  constructor(private routesPort: IRoutesPort) {}

  async getRoutes(filters?: RouteFilters): Promise<Route[]> {
    return this.routesPort.fetchRoutes(filters);
  }

  async setBaseline(routeId: string): Promise<void> {
    return this.routesPort.setBaseline(routeId);
  }

  async getComparisonData(): Promise<{
    baseline: Route;
    comparison: Route;
    percentDifference: number;
    compliant: boolean;
  }[]> {
    const comparisons = await this.routesPort.fetchComparison();
    return comparisons.map(({ baseline, comparison }) => ({
      baseline,
      comparison,
      percentDifference: calculatePercentDifference(comparison.ghgIntensity, baseline.ghgIntensity),
      compliant: comparison.ghgIntensity <= 89.3368,
    }));
  }

  filterRoutes(routes: Route[], filters?: RouteFilters): Route[] {
    return routes.filter(route => {
      if (filters?.vesselType && !filters.vesselType.includes(route.vesselType)) {
        return false;
      }
      if (filters?.fuelType && !filters.fuelType.includes(route.fuelType)) {
        return false;
      }
      if (filters?.year && !filters.year.includes(route.year)) {
        return false;
      }
      return true;
    });
  }
}
