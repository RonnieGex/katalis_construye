import type { InternationalFinanceModel } from "@/lib/domain";

export interface InternationalFinanceSummary {
  convertedAmount: number;
  fxImpact: number;
  hedgedDelta: number;
  recommendedPrice: number;
}

export function calculateInternationalFinance(
  model: InternationalFinanceModel,
): InternationalFinanceSummary {
  return {
    convertedAmount: model.foreignAmount * model.actualRate,
    fxImpact: model.foreignAmount * (model.actualRate - model.plannedRate),
    hedgedDelta: model.hedgedResult - model.unhedgedResult,
    recommendedPrice: model.basePrice * (1 + model.fxRiskBufferPct / 100),
  };
}