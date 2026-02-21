import type { ValuationModel } from "@/lib/domain";

export interface ValuationSummary {
  valueSalesMultiple: number;
  valueEbitdaMultiple: number;
  valueNetIncomeMultiple: number;
  bookValue: number;
  dcfValue: number;
}

export function calculateValuation(model: ValuationModel): ValuationSummary {
  const valueSalesMultiple = model.annualSales * model.salesMultiple;
  const valueEbitdaMultiple = model.annualEbitda * model.ebitdaMultiple;
  const valueNetIncomeMultiple = model.annualNetIncome * model.netIncomeMultiple;
  const bookValue = model.totalAssets - model.totalLiabilities;

  const rate = model.discountRatePct / 100;
  let dcfValue = 0;
  for (let year = 1; year <= Math.max(1, model.years); year += 1) {
    dcfValue += model.freeCashFlow / (1 + rate) ** year;
  }
  dcfValue += model.terminalValue / (1 + rate) ** Math.max(1, model.years);

  return {
    valueSalesMultiple,
    valueEbitdaMultiple,
    valueNetIncomeMultiple,
    bookValue,
    dcfValue,
  };
}