import type { UnitEconomicsModel } from "@/lib/domain";
import { safeDivide } from "@/lib/calculations/advanced/shared";

export interface UnitEconomicsSummary {
  contributionMargin: number;
  coca: number | null;
  unitEconomics: number | null;
  ltv: number;
  ltvCoca: number | null;
  paybackMonths: number | null;
  discountedGrossProfit: number[];
}

export function calculateUnitEconomics(model: UnitEconomicsModel): UnitEconomicsSummary {
  const contributionMargin = model.price - model.variableCost;
  const coca = safeDivide(model.marketingSales, model.newCustomers);
  const unitEconomics = coca === null ? null : contributionMargin - coca;
  const ltv = model.avgTicket * model.purchaseFrequency * model.retentionPeriod;
  const ltvCoca = coca === null ? null : safeDivide(ltv, coca);
  const paybackMonths =
    coca === null ? null : safeDivide(coca, contributionMargin * model.purchaseFrequency);

  const discountRate = model.discountRatePct / 100;
  const discountedGrossProfit = Array.from({ length: Math.max(1, Math.round(model.retentionPeriod)) }, (_, index) => {
    const period = index + 1;
    const grossProfit = contributionMargin * model.purchaseFrequency;
    return grossProfit / (1 + discountRate) ** period;
  });

  return {
    contributionMargin,
    coca,
    unitEconomics,
    ltv,
    ltvCoca,
    paybackMonths,
    discountedGrossProfit,
  };
}