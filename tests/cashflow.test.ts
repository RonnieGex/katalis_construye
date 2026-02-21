import { describe, expect, it } from "vitest";

import { computeMonthCashFlow } from "@/lib/calculations/cashflow";

describe("computeMonthCashFlow", () => {
  it("calculates projected and actual totals with ending balances", () => {
    const result = computeMonthCashFlow({
      month: "2026-01",
      startingBalance: 1000,
      inflows: [
        { name: "Ventas", projected: 500, actual: 450 },
        { name: "Servicios", projected: 200, actual: 250 },
      ],
      outflows: [
        { name: "Renta", projected: 300, actual: 300 },
        { name: "Marketing", projected: 100, actual: 120 },
      ],
    });

    expect(result.projectedTotalInflows).toBe(700);
    expect(result.projectedTotalOutflows).toBe(400);
    expect(result.projectedEndingBalance).toBe(1300);
    expect(result.actualTotalInflows).toBe(700);
    expect(result.actualTotalOutflows).toBe(420);
    expect(result.actualEndingBalance).toBe(1280);
  });

  it("handles missing actual values as zero in actual totals", () => {
    const result = computeMonthCashFlow({
      month: "2026-02",
      startingBalance: 200,
      inflows: [{ name: "Ventas", projected: 100 }],
      outflows: [{ name: "Renta", projected: 50 }],
    });

    expect(result.actualTotalInflows).toBe(0);
    expect(result.actualTotalOutflows).toBe(0);
    expect(result.actualEndingBalance).toBe(200);
  });
});
