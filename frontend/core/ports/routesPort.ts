/**
 * Routes Port (Outbound)
 * Defines the interface for route data fetching
 */

import type { Route, RouteFilters } from '../domain/routes';

export interface IRoutesPort {
  fetchRoutes(filters?: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  fetchComparison(): Promise<{
    baseline: Route;
    comparison: Route;
  }[]>;
}
