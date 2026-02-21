import type { DebtManagerModel } from "@/lib/domain";
import { safeDivide } from "@/lib/calculations/advanced/shared";

export interface DebtManagerSummary {
  debtRatio: number | null;
  interestCoverage: number | null;
  effectiveDebtCost: number | null;
  avalancheOrder: string[];
  snowballOrder: string[];
  refinanceDelta: number;
}

export function calculateDebtManager(model: DebtManagerModel): DebtManagerSummary {
  const debtRatio = safeDivide(model.totalDebt, model.totalAssets);
  const interestCoverage = safeDivide(model.ebit, model.interestExpense);
  const effectiveDebtCost = safeDivide(
    model.interestExpense + model.fees + model.otherCosts,
    model.loanAmount,
  );

  const debts = [
    { id: "primary", balance: model.primaryBalance, rate: model.primaryRatePct },
    { id: "secondary", balance: model.secondaryBalance, rate: model.secondaryRatePct },
  ];

  const avalancheOrder = [...debts]
    .sort((a, b) => b.rate - a.rate)
    .map((item) => item.id);

  const snowballOrder = [...debts]
    .sort((a, b) => a.balance - b.balance)
    .map((item) => item.id);

  return {
    debtRatio: debtRatio === null ? null : debtRatio * 100,
    interestCoverage,
    effectiveDebtCost: effectiveDebtCost === null ? null : effectiveDebtCost * 100,
    avalancheOrder,
    snowballOrder,
    refinanceDelta: model.oldTotalCost - model.newTotalCost,
  };
}