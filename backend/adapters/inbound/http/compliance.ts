import { Router } from "express";
import { PgComplianceRepo } from "../../outbound/postgres/complianceRepo";
import { MemoryComplianceRepo } from "../../outbound/memory/complianceRepo";
import { ComplianceService } from "../../../core/application/complianceService";
import { getPool } from "../../../infrastructure/db/pg";

export function createComplianceRouter() {
  const router = Router();
  const pool = getPool();
  const repo = pool ? new PgComplianceRepo() : new MemoryComplianceRepo();
  const service = new ComplianceService(repo);

  router.get("/cb", async (req, res) => {
    try {
      const shipId = String(req.query.shipId);
      const year = Number(req.query.year);
      const intensity = Number(req.query.intensity);
      const fuel = Number(req.query.fuel);
      const snapshot = await service.computeAndStoreCB(shipId, year, intensity, fuel);
      res.json(snapshot);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      res.status(400).json({ error: msg });
    }
  });

  router.get("/adjusted-cb", async (req, res) => {
    try {
      const shipId = String(req.query.shipId);
      const year = Number(req.query.year);
      const adjusted = await service.getAdjustedCB(shipId, year);
      res.json({ ship_id: shipId, year, cb_gco2eq: adjusted });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      res.status(400).json({ error: msg });
    }
  });

  router.get("/adjusted-members", async (req, res) => {
    try {
      const year = Number(req.query.year);
      const members = await repo.fetchAdjustedMembers(year);
      res.json(members);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      res.status(400).json({ error: msg });
    }
  });

  return router;
}
