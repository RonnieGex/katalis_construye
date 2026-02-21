import type { ProfitabilityModel } from "@/lib/domain";
import { safeDivide } from "@/lib/calculations/advanced/shared";

export interface ProfitabilitySummary {
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
  roi: number | null;
  segmentProfitability: number;
}

export function calculateProfitability(model: ProfitabilityModel): ProfitabilitySummary {
  const grossMargin = safeDivide(model.sales - model.cogs, model.sales);
  const operatingMargin = safeDivide(model.sales - model.cogs - model.opex, model.sales);
  const netMargin = safeDivide(model.netIncome, model.sales);
  const roi = safeDivide(model.netIncome, model.investment);

  return {
    grossMargin: grossMargin === null ? null : grossMargin * 100,
    operatingMargin: operatingMargin === null ? null : operatingMargin * 100,
    netMargin: netMargin === null ? null : netMargin * 100,
    roi: roi === null ? null : roi * 100,
    segmentProfitability: model.segmentRevenue - model.segmentCosts,
  };
}