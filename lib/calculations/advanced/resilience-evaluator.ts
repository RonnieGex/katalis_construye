import type { ResilienceModel } from "@/lib/domain";
import { safeDivide, weightedScore } from "@/lib/calculations/advanced/shared";

export interface ResilienceSummary {
  reserveTarget: number;
  runwayMonths: number | null;
  resilienceScore: number;
  crisisImpact: number;
}

export function calculateResilience(model: ResilienceModel): ResilienceSummary {
  const reserveTarget = model.monthlyOperatingExpense * model.targetMonths;
  const runwayMonths = safeDivide(model.availableCash, model.monthlyBurn);

  const resilienceScore = weightedScore([
    { value: model.liquidityScore, weight: 30 },
    { value: model.debtScore, weight: 25 },
    { value: model.diversificationScore, weight: 20 },
    { value: model.contingencyReadinessScore, weight: 25 },
  ]);

  const crisisImpact = model.availableCash - model.monthlyBurn * (1 + model.salesDropPct / 100);

  return {
    reserveTarget,
    runwayMonths,
    resilienceScore,
    crisisImpact,
  };
}