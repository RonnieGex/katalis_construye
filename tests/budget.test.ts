import { describe, expect, it } from "vitest";

import {
  computeBudgetLineTotals,
  computeVariance,
} from "@/lib/calculations/budget";

describe("budget calculations", () => {
  it("computes variance amount and percent", () => {
    const variance = computeVariance(1000, 1200);

    expect(variance.amount).toBe(200);
    expect(variance.percent).toBe(20);
  });

  it("returns null percent when planned is zero", () => {
    const variance = computeVariance(0, 200);

    expect(variance.amount).toBe(200);
    expect(variance.percent).toBeNull();
  });

  it("aggregates annual planned and actual totals for budget lines", () => {
    const totals = computeBudgetLineTotals([
      {
        name: "Ventas",
        plannedByMonth: [100, 100, 100],
        actualByMonth: [90, 120, 80],
      },
      {
        name: "Servicios",
        plannedByMonth: [50, 50, 50],
        actualByMonth: [50, 40, 60],
      },
    ]);

    expect(totals.plannedTotal).toBe(450);
    expect(totals.actualTotal).toBe(440);
  });
});
