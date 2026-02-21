import { describe, expect, it } from "vitest";

import {
  computeCap14Kpis,
  computeKpiMargins,
  deriveKpiSummary,
} from "@/lib/calculations/kpi";

describe("kpi calculations", () => {
  it("computes gross and net margins with normal revenue", () => {
    const result = computeKpiMargins({
      revenue: 1000,
      directCosts: 400,
      operatingExpenses: 200,
      taxesAndInterest: 100,
    });

    expect(result.grossMargin).toBe(60);
    expect(result.netMargin).toBe(30);
  });

  it("returns null margins when revenue is zero", () => {
    const result = computeKpiMargins({
      revenue: 0,
      directCosts: 100,
      operatingExpenses: 100,
      taxesAndInterest: 0,
    });

    expect(result.grossMargin).toBeNull();
    expect(result.netMargin).toBeNull();
  });

  it("derives KPI summary even when optional sources are missing", () => {
    const summary = deriveKpiSummary({
      revenue: 0,
      directCosts: 0,
      operatingExpenses: 0,
      taxesAndInterest: 0,
      cashFlowMonths: [],
      costEntries: [],
      budget: null,
    });

    expect(summary.margins.grossMargin).toBeNull();
    expect(summary.margins.netMargin).toBeNull();
    expect(summary.cashFlowProjectedBalance).toBe(0);
    expect(summary.cap14.currentRatio).toBeGreaterThan(0);
    expect(summary.cap14.burnRate).toBe(0);
  });

  it("computes chapter 14 metrics with safe null handling", () => {
    const summary = computeCap14Kpis({
      currentAssets: 1000,
      currentLiabilities: 500,
      inventory: 100,
      totalAssets: 2000,
      netIncome: 200,
      cogs: 600,
      avgInventory: 300,
      accountsReceivable: 150,
      creditSales: 900,
      periodDays: 30,
      availableCash: 1200,
      monthlyBurn: 200,
    });

    expect(summary.currentRatio).toBeCloseTo(2, 6);
    expect(summary.acidTest).toBeCloseTo(1.8, 6);
    expect(summary.roa).toBeCloseTo(10, 6);
    expect(summary.inventoryTurnover).toBeCloseTo(2, 6);
    expect(summary.daysSalesOutstanding).toBeCloseTo(5, 6);
    expect(summary.runwayMonths).toBeCloseTo(6, 6);
  });
});
