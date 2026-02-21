import type { FintechEvaluatorModel } from "@/lib/domain";
import { weightedScore } from "@/lib/calculations/advanced/shared";

export interface FintechEvaluatorSummary {
  fitScore: number;
  toolRoi: number;
  migrationRiskScore: number;
}

export function calculateFintechEvaluator(model: FintechEvaluatorModel): FintechEvaluatorSummary {
  const fitScore = weightedScore([
    { value: model.needsCoverageScore, weight: 35 },
    { value: model.securityScore, weight: 25 },
    { value: model.integrationScore, weight: 20 },
    { value: model.easeScore, weight: 20 },
  ]);

  const toolRoi =
    model.annualCost === 0
      ? 0
      : ((model.annualBenefit - model.annualCost) / model.annualCost) * 100;

  const migrationRiskScore = weightedScore([
    { value: model.dataRiskScore, weight: 40 },
    { value: model.operationalRiskScore, weight: 35 },
    { value: model.vendorRiskScore, weight: 25 },
  ]);

  return {
    fitScore,
    toolRoi,
    migrationRiskScore,
  };
}