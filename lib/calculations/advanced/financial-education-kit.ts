import type { FinancialEducationModel } from "@/lib/domain";
import { safeDivide } from "@/lib/calculations/advanced/shared";

export interface FinancialEducationSummary {
  knowledgeIndex: number;
  completionRate: number | null;
  trainingRoi: number | null;
}

export function calculateFinancialEducation(model: FinancialEducationModel): FinancialEducationSummary {
  const knowledgeIndex = (model.testScore1 + model.testScore2 + model.testScore3) / 3;
  const completionRate = safeDivide(model.completedModules, model.totalModules);
  const trainingRoi = safeDivide(model.profitImprovement - model.trainingCost, model.trainingCost);

  return {
    knowledgeIndex,
    completionRate: completionRate === null ? null : completionRate * 100,
    trainingRoi: trainingRoi === null ? null : trainingRoi * 100,
  };
}