import type { ContingencyModel } from "@/lib/domain";
import { safeDivide } from "@/lib/calculations/advanced/shared";

export interface ContingencySummary {
  riskScore: number;
  emergencyFundTarget: number;
  coverageMonths: number | null;
}

export function calculateContingency(model: ContingencyModel): ContingencySummary {
  return {
    riskScore: model.probabilityPct * model.impactPct,
    emergencyFundTarget: model.monthlyFixedOutflow * model.reserveMonths,
    coverageMonths: safeDivide(model.reserveBalance, model.monthlyFixedOutflow),
  };
}