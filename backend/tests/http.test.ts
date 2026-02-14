import { describe, it, expect } from "vitest";
import request from "supertest";
import { createServer } from "../index";

describe("HTTP endpoints", () => {
  const app = createServer();
  it("GET /api/routes returns list", async () => {
    const res = await request(app).get("/api/routes");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
  it("GET /api/routes/comparison returns items", async () => {
    const res = await request(app).get("/api/routes/comparison");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
})
