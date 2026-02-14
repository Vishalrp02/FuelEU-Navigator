import { Router } from "express";
import { PgComplianceRepo } from "../../outbound/postgres/complianceRepo";
import { ComplianceService } from "../../../core/application/complianceService";

export function createBankingRouter() {
  const router = Router();
  const service = new ComplianceService(new PgComplianceRepo());

  router.get("/records", async (req, res) => {
    try {
      const shipId = String(req.query.shipId);
      const year = Number(req.query.year);
      const repo = new PgComplianceRepo();
      const records = await repo.getBankRecords(shipId, year);
      res.json(records);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      res.status(400).json({ error: msg });
    }
  });

  router.post("/bank", async (req, res) => {
    try {
      const { shipId, year, amount } = req.body as { shipId: string; year: number; amount: number };
      const op = await service.bankSurplus(shipId, year, amount);
      res.json(op);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      res.status(400).json({ error: msg });
    }
  });

  router.post("/apply", async (req, res) => {
    try {
      const { shipId, year, amount } = req.body as { shipId: string; year: number; amount: number };
      const op = await service.applyBanked(shipId, year, amount);
      res.json(op);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      res.status(400).json({ error: msg });
    }
  });

  return router;
}
