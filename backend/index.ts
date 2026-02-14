import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { createRoutesRouter } from "./adapters/inbound/http/routes";
import { createComplianceRouter } from "./adapters/inbound/http/compliance";
import { createBankingRouter } from "./adapters/inbound/http/banking";
import { createPoolsRouter } from "./adapters/inbound/http/pools";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Fuel EU APIs
  app.use("/api/routes", createRoutesRouter());
  app.use("/api/compliance", createComplianceRouter());
  app.use("/api/banking", createBankingRouter());
  app.use("/api/pools", createPoolsRouter());

  return app;
}
