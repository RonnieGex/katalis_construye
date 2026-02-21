import type { FinancingOptionsModel } from "@/lib/domain";
import { clamp, weightedScore } from "@/lib/calculations/advanced/shared";

export interface FinancingOptionsSummary {
  monthlyPayment: number;
  totalPayments: number;
  effectiveDebtCostPct: number;
  totalFinancingCost: number;
  dilutionImpact: number;
  optionScore: number;
}

export function calculateFinancingOptions(model: FinancingOptionsModel): FinancingOptionsSummary {
  const monthlyRate = model.annualRatePct / 100 / 12;
  const months = Math.max(1, model.termMonths);
  let monthlyPayment = 0;

  if (monthlyRate === 0) {
    monthlyPayment = model.principal / months;
  } else {
    monthlyPayment =
      (model.principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
  }

  const totalPayments = monthlyPayment * months;
  const effectiveDebtCostPct =
    ((totalPayments - model.principal + model.fees + model.otherCosts) /
      Math.max(1, model.principal)) *
    100;

  const totalFinancingCost = totalPayments - model.principal + model.fees + model.otherCosts;
  const dilutionImpact = model.equityOfferedPct;
  const costScore = clamp(100 - effectiveDebtCostPct, 0, 100);

  const optionScore = weightedScore([
    { value: costScore, weight: 35 },
    { value: clamp(model.controlScore, 0, 100), weight: 25 },
    { value: clamp(100 - model.riskScore, 0, 100), weight: 25 },
    { value: clamp(model.flexibilityScore, 0, 100), weight: 15 },
  ]);

  return {
    monthlyPayment,
    totalPayments,
    effectiveDebtCostPct,
    totalFinancingCost,
    dilutionImpact,
    optionScore,
  };
}