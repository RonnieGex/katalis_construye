import type { InvestmentEvaluatorModel } from "@/lib/domain";
import { safeDivide } from "@/lib/calculations/advanced/shared";

export interface InvestmentEvaluatorSummary {
  roi: number | null;
  payback: number | null;
  npv: number;
  irr: number | null;
}

function computeNpv(initialCost: number, annualBenefit: number, ratePct: number, years: number): number {
  const rate = ratePct / 100;
  let value = -initialCost;

  for (let t = 1; t <= years; t += 1) {
    value += annualBenefit / (1 + rate) ** t;
  }

  return value;
}

function computeIrr(initialCost: number, annualBenefit: number, years: number): number | null {
  let low = -0.99;
  let high = 2;
  let mid = 0;

  const f = (rate: number) => {
    let npv = -initialCost;
    for (let t = 1; t <= years; t += 1) {
      npv += annualBenefit / (1 + rate) ** t;
    }
    return npv;
  };

  const fLow = f(low);
  const fHigh = f(high);
  if (fLow * fHigh > 0) {
    return null;
  }

  for (let i = 0; i < 120; i += 1) {
    mid = (low + high) / 2;
    const fMid = f(mid);
    if (Math.abs(fMid) < 1e-7) {
      return mid * 100;
    }
    if (fLow * fMid < 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return mid * 100;
}

export function calculateInvestmentEvaluator(model: InvestmentEvaluatorModel): InvestmentEvaluatorSummary {
  const roi = safeDivide(model.annualBenefit, model.initialCost);
  const payback = safeDivide(model.initialCost, model.annualBenefit);
  const npv = computeNpv(
    model.initialCost,
    model.annualBenefit,
    model.discountRatePct,
    Math.max(1, model.years),
  );
  const irr = computeIrr(model.initialCost, model.annualBenefit, Math.max(1, model.years));

  return {
    roi: roi === null ? null : roi * 100,
    payback,
    npv,
    irr,
  };
}