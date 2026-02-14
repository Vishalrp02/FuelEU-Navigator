import type { IRoutesRepo } from "../../../core/ports/routesRepo";
import { query } from "../../../infrastructure/db/pg";
import type { RouteDTO } from "../../../../shared/api";

export class PgRoutesRepo implements IRoutesRepo {
  async getAll(filters?: { vesselType?: string[]; fuelType?: string[]; year?: number[] }): Promise<RouteDTO[]> {
    const where: string[] = [];
    const params: unknown[] = [];
    if (filters?.vesselType?.length) {
      params.push(filters.vesselType);
      where.push(`vessel_type = ANY($${params.length})`);
    }
    if (filters?.fuelType?.length) {
      params.push(filters.fuelType);
      where.push(`fuel_type = ANY($${params.length})`);
    }
    if (filters?.year?.length) {
      params.push(filters.year);
      where.push(`year = ANY($${params.length})`);
    }
    const sql = `SELECT * FROM routes ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY id ASC`;
    const { rows } = await query<RouteDTO>(sql, params);
    return rows;
  }

  async setBaselineByRouteId(routeId: string): Promise<void> {
    await query("UPDATE routes SET is_baseline = FALSE");
    await query("UPDATE routes SET is_baseline = TRUE WHERE route_id = $1", [routeId]);
  }

  async getBaseline(): Promise<RouteDTO | null> {
    const { rows } = await query<RouteDTO>("SELECT * FROM routes WHERE is_baseline = TRUE LIMIT 1");
    return rows[0] || null;
  }
}
