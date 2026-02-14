import { Router } from "express";
import { PgRoutesRepo } from "../../outbound/postgres/routesRepo";
import { MemoryRoutesRepo } from "../../outbound/memory/routesRepo";
import { RoutesService } from "../../../core/application/routesService";
import { getPool } from "../../../infrastructure/db/pg";

export function createRoutesRouter() {
  const router = Router();
  const pool = getPool();
  const service = new RoutesService(pool ? new PgRoutesRepo() : new MemoryRoutesRepo());

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      res.status(500).json({ error: msg });
    }
  });

  router.post("/:id/baseline", async (req, res) => {
    try {
      const id = String(req.params.id);
      await service.setBaseline(id);
      res.status(204).end();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      res.status(500).json({ error: msg });
    }
  });

  router.get("/comparison", async (_req, res) => {
    try {
      const data = await service.comparison();
      res.json(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      res.status(500).json({ error: msg });
    }
  });

  return router;
}
