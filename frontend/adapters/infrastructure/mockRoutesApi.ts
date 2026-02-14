/**
 * Mock Routes API Adapter
 * Implements IRoutesPort with mock data
 */

import type { IRoutesPort } from '../../core/ports/routesPort';
import type { Route, RouteFilters } from '../../core/domain/routes';

// Mock route data based on provided sample
const MOCK_ROUTES: Route[] = [
  {
    routeId: 'R001',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
    isBaseline: true,
  },
  {
    routeId: 'R002',
    vesselType: 'BulkCarrier',
    fuelType: 'LNG',
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    distance: 11500,
    totalEmissions: 4200,
    isBaseline: false,
  },
  {
    routeId: 'R003',
    vesselType: 'Tanker',
    fuelType: 'MGO',
    year: 2024,
    ghgIntensity: 93.5,
    fuelConsumption: 5100,
    distance: 12500,
    totalEmissions: 4700,
    isBaseline: false,
  },
  {
    routeId: 'R004',
    vesselType: 'RoRo',
    fuelType: 'HFO',
    year: 2025,
    ghgIntensity: 89.2,
    fuelConsumption: 4900,
    distance: 11800,
    totalEmissions: 4300,
    isBaseline: false,
  },
  {
    routeId: 'R005',
    vesselType: 'Container',
    fuelType: 'LNG',
    year: 2025,
    ghgIntensity: 90.5,
    fuelConsumption: 4950,
    distance: 11900,
    totalEmissions: 4400,
    isBaseline: false,
  },
];

// Mock comparison data
const MOCK_COMPARISON: Array<{ baseline: Route; comparison: Route }> = [
  {
    baseline: MOCK_ROUTES[0], // R001 - HFO 91.0
    comparison: {
      ...MOCK_ROUTES[0],
      ghgIntensity: 89.0, // Improved to 89.0
    },
  },
  {
    baseline: MOCK_ROUTES[2], // R003 - MGO 93.5
    comparison: {
      ...MOCK_ROUTES[2],
      ghgIntensity: 90.2, // Improved to 90.2
    },
  },
];

export class MockRoutesApi implements IRoutesPort {
  async fetchRoutes(filters?: RouteFilters): Promise<Route[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let routes = [...MOCK_ROUTES];

    if (filters?.vesselType && filters.vesselType.length > 0) {
      routes = routes.filter(r => filters.vesselType!.includes(r.vesselType));
    }

    if (filters?.fuelType && filters.fuelType.length > 0) {
      routes = routes.filter(r => filters.fuelType!.includes(r.fuelType));
    }

    if (filters?.year && filters.year.length > 0) {
      routes = routes.filter(r => filters.year!.includes(r.year));
    }

    return routes;
  }

  async setBaseline(routeId: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const route = MOCK_ROUTES.find(r => r.routeId === routeId);
    if (!route) {
      throw new Error(`Route ${routeId} not found`);
    }

    // Mark all others as not baseline, mark this one as baseline
    MOCK_ROUTES.forEach(r => {
      r.isBaseline = r.routeId === routeId;
    });
  }

  async fetchComparison(): Promise<{ baseline: Route; comparison: Route }[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_COMPARISON;
  }
}
