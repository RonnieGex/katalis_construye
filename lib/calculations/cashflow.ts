import type { CashFlowEntry } from "@/lib/domain";

export interface CashFlowMonthResult {
  projectedTotalInflows: number;
  projectedTotalOutflows: number;
  projectedEndingBalance: number;
  actualTotalInflows: number;
  actualTotalOutflows: number;
  actualEndingBalance: number;
}

export function computeMonthCashFlow(entry: CashFlowEntry): CashFlowMonthResult {
  const projectedTotalInflows = sum(entry.inflows.map((line) => line.projected));
  const projectedTotalOutflows = sum(entry.outflows.map((line) => line.projected));
  const actualTotalInflows = sum(entry.inflows.map((line) => line.actual ?? 0));
  const actualTotalOutflows = sum(entry.outflows.map((line) => line.actual ?? 0));

  return {
    projectedTotalInflows,
    projectedTotalOutflows,
    projectedEndingBalance:
      entry.startingBalance + projectedTotalInflows - projectedTotalOutflows,
    actualTotalInflows,
    actualTotalOutflows,
    actualEndingBalance: entry.startingBalance + actualTotalInflows - actualTotalOutflows,
  };
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
