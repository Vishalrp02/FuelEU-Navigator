import { Router } from "express";
import { PgComplianceRepo } from "../../outbound/postgres/complianceRepo";
import { ComplianceService } from "../../../core/application/complianceService";
import type { CreatePoolRequestDTO } from "../../../../shared/api";

export function createPoolsRouter() {
  const router = Router();
  const service = new ComplianceService(new PgComplianceRepo());

  router.post("/", async (req, res) => {
    try {
      const body = req.body as CreatePoolRequestDTO;
      const result = await service.createPool(body.year, body.members);
      res.json(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      res.status(400).json({ error: msg });
    }
  });

  return router;
}
