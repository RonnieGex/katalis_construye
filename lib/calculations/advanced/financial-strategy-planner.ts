import type { FinancialStrategyModel } from "@/lib/domain";

export interface FinancialStrategyRow {
  year: number;
  revenue: number;
  netIncome: number;
  reinvestment: number;
  dividends: number;
  debtPct: number;
  equityPct: number;
  targetStatus: "ok" | "alert";
}

export interface FinancialStrategySummary {
  debtMixConstraint: boolean;
  rows: FinancialStrategyRow[];
}

export function calculateFinancialStrategy(model: FinancialStrategyModel): FinancialStrategySummary {
  const rows: FinancialStrategyRow[] = [];
  const growth = model.growthRatePct / 100;
  const netMargin = model.targetNetMarginPct / 100;
  const reinvest = model.reinvestPct / 100;
  const dividend = model.dividendPct / 100;

  for (let year = 1; year <= Math.max(1, model.horizonYears); year += 1) {
    const revenue = model.revenue0 * (1 + growth) ** year;
    const netIncome = revenue * netMargin;
    const reinvestment = netIncome * reinvest;
    const dividends = netIncome * dividend;

    rows.push({
      year,
      revenue,
      netIncome,
      reinvestment,
      dividends,
      debtPct: model.debtPct,
      equityPct: model.equityPct,
      targetStatus: model.debtPct <= model.maxDebtPct ? "ok" : "alert",
    });
  }

  return {
    debtMixConstraint: model.debtPct <= model.maxDebtPct,
    rows,
  };
}