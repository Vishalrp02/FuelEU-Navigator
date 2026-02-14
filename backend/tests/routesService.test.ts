import { describe, it, expect } from "vitest";
import { RoutesService } from "../core/application/routesService";
import { MemoryRoutesRepo } from "../adapters/outbound/memory/routesRepo";

describe("RoutesService comparison", () => {
  it("produces comparison items with percentDifference and compliant flag", async () => {
    const service = new RoutesService(new MemoryRoutesRepo());
    const comps = await service.comparison();
    expect(comps.length).toBeGreaterThan(0);
    for (const c of comps) {
      expect(typeof c.percentDifference).toBe("number");
      expect(typeof c.compliant).toBe("boolean");
    }
  });
});
