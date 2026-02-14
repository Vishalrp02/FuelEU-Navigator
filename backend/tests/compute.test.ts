import { describe, it, expect } from "vitest";
import { computeEnergyMJ, computeComplianceBalance, COMPLIANCE_TARGET_GCO2E_MJ } from "../../shared/api";

describe("Compute formulas", () => {
  it("computeEnergyMJ", () => {
    expect(computeEnergyMJ(1)).toBe(41000);
    expect(computeEnergyMJ(5000)).toBe(205000000);
  });

  it("computeComplianceBalance positive/negative", () => {
    const energy = computeEnergyMJ(1);
    const cbSurplus = computeComplianceBalance(COMPLIANCE_TARGET_GCO2E_MJ - 1, energy);
    const cbDeficit = computeComplianceBalance(COMPLIANCE_TARGET_GCO2E_MJ + 1, energy);
    expect(cbSurplus).toBeGreaterThan(0);
    expect(cbDeficit).toBeLessThan(0);
  });
});
