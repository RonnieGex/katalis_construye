import { describe, expect, it } from "vitest";

import {
  computeSingleProductBreakEven,
  computeWeightedContributionMargin,
} from "@/lib/calculations/breakeven";

describe("break-even calculations", () => {
  it("computes single-product break-even units", () => {
    const result = computeSingleProductBreakEven({
      fixedCosts: 1000,
      price: 50,
      variableCost: 30,
    });

    expect(result.contributionMargin).toBe(20);
    expect(result.units).toBe(50);
    expect(result.message).toBeNull();
  });

  it("returns null units when contribution margin is non-positive", () => {
    const result = computeSingleProductBreakEven({
      fixedCosts: 1000,
      price: 20,
      variableCost: 20,
    });

    expect(result.units).toBeNull();
    expect(result.message).toContain("No break-even");
  });

  it("computes weighted contribution margin for multi-product mix", () => {
    const result = computeWeightedContributionMargin([
      { name: "A", price: 100, variableCost: 40, salesMixPct: 60 },
      { name: "B", price: 80, variableCost: 50, salesMixPct: 40 },
    ]);

    expect(result).toBe(48);
  });
});
