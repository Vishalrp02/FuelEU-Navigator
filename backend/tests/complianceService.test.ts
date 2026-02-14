import { describe, it, expect } from "vitest";
import { ComplianceService } from "../core/application/complianceService";
import { MemoryComplianceRepo } from "../adapters/outbound/memory/complianceRepo";

describe("ComplianceService banking and pooling", () => {
  it("banks surplus when positive", async () => {
    const repo = new MemoryComplianceRepo();
    const svc = new ComplianceService(repo);
    // store snapshot positive
    await repo.saveComplianceSnapshot({ ship_id: "SHIP1", year: 2024, cb_gco2eq: 1000 });
    const op = await svc.bankSurplus("SHIP1", 2024, 300);
    expect(op.applied_gco2eq).toBeLessThanOrEqual(300);
    expect(op.cb_after_gco2eq).toBeLessThan(op.cb_before_gco2eq);
  });

  it("rejects over-apply banked", async () => {
    const repo = new MemoryComplianceRepo();
    const svc = new ComplianceService(repo);
    await repo.saveComplianceSnapshot({ ship_id: "SHIP2", year: 2024, cb_gco2eq: 500 });
    // add banked 200
    await repo.addBankRecord("SHIP2", 2024, 200);
    await expect(async () => svc.applyBanked("SHIP2", 2024, 1000)).rejects.toThrow();
  });

  it("creates valid pool with greedy allocation", async () => {
    const repo = new MemoryComplianceRepo();
    const svc = new ComplianceService(repo);
    const res = await svc.createPool(2024, [
      { ship_id: "A", cb_before: 100 },
      { ship_id: "B", cb_before: -50 },
      { ship_id: "C", cb_before: -20 },
    ]);
    expect(res.members.find((m) => m.ship_id === "B")!.cb_after).toBeGreaterThanOrEqual(-50);
    expect(res.members.find((m) => m.ship_id === "C")!.cb_after).toBeGreaterThanOrEqual(-20);
  });
});
