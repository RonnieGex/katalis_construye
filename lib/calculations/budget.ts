import type { AnnualBudgetLine } from "@/lib/domain";

export interface VarianceResult {
  amount: number;
  percent: number | null;
}

export interface BudgetLineTotals {
  plannedTotal: number;
  actualTotal: number;
}

export function computeVariance(planned: number, actual: number): VarianceResult {
  const amount = actual - planned;
  if (planned === 0) {
    return { amount, percent: null };
  }

  return { amount, percent: (amount / planned) * 100 };
}

export function computeBudgetLineTotals(lines: AnnualBudgetLine[]): BudgetLineTotals {
  const plannedTotal = lines.reduce((acc, line) => acc + sum(line.plannedByMonth), 0);
  const actualTotal = lines.reduce((acc, line) => acc + sum(line.actualByMonth), 0);

  return { plannedTotal, actualTotal };
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
