import type { BusinessModelAnalyzerModel } from "@/lib/domain";
import { safeDivide } from "@/lib/calculations/advanced/shared";

export interface BusinessModelAnalyzerSummary {
  kpiName: string;
  kpiValue: number | null;
  benchmark: number;
  target: number;
  gap: number | null;
}

export function calculateBusinessModelAnalyzer(
  model: BusinessModelAnalyzerModel,
): BusinessModelAnalyzerSummary {
  if (model.model === "ecommerce") {
    const grossMargin = safeDivide(model.sales - model.cogs, model.sales);
    const value = grossMargin === null ? null : grossMargin * 100;
    return {
      kpiName: "Margen bruto",
      kpiValue: value,
      benchmark: model.benchmark,
      target: model.target,
      gap: value === null ? null : model.target - value,
    };
  }

  if (model.model === "services") {
    const utilization = model.capacityUsedPct;
    return {
      kpiName: "Utilización",
      kpiValue: utilization,
      benchmark: model.benchmark,
      target: model.target,
      gap: model.target - utilization,
    };
  }

  if (model.model === "saas") {
    const ltvCac = safeDivide(model.ltv, safeDivide(model.marketingSales, model.newCustomers) ?? 0);
    return {
      kpiName: "LTV/CAC",
      kpiValue: ltvCac,
      benchmark: model.benchmark,
      target: model.target,
      gap: ltvCac === null ? null : model.target - ltvCac,
    };
  }

  const contribution = safeDivide(model.sales - model.cogs, model.sales);
  const value = contribution === null ? null : contribution * 100;
  return {
    kpiName: "Margen de contribución",
    kpiValue: value,
    benchmark: model.benchmark,
    target: model.target,
    gap: value === null ? null : model.target - value,
  };
}
