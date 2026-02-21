import type { AnnualBudget, CashFlowEntry, CostExpenseEntry } from "@/lib/domain";
import { computeMonthCashFlow } from "@/lib/calculations/cashflow";

export interface MarginInput {
  revenue: number;
  directCosts: number;
  operatingExpenses: number;
  taxesAndInterest: number;
}

export interface MarginResult {
  grossMargin: number | null;
  netMargin: number | null;
}

export interface KpiCap14Input {
  currentAssets: number;
  currentLiabilities: number;
  inventory: number;
  totalAssets: number;
  netIncome: number;
  cogs: number;
  avgInventory: number;
  accountsReceivable: number;
  creditSales: number;
  periodDays: number;
  availableCash: number;
  monthlyBurn: number;
}

export interface KpiCap14Summary {
  currentRatio: number | null;
  acidTest: number | null;
  roa: number | null;
  inventoryTurnover: number | null;
  daysSalesOutstanding: number | null;
  burnRate: number;
  runwayMonths: number | null;
}

export interface KpiSummaryInput extends MarginInput {
  cashFlowMonths: CashFlowEntry[];
  costEntries: CostExpenseEntry[];
  budget: AnnualBudget | null;
}

export interface KpiSummary {
  margins: MarginResult;
  cashFlowProjectedBalance: number;
  latestBudgetYear: number | null;
  costsCount: number;
  cap14: KpiCap14Summary;
}

function safeDivide(numerator: number, denominator: number): number | null {
  if (denominator === 0) {
    return null;
  }
  return numerator / denominator;
}

function latestCashflow(input: CashFlowEntry[]): CashFlowEntry | null {
  if (input.length === 0) return null;
  const sorted = [...input].sort((a, b) => a.month.localeCompare(b.month));
  return sorted.at(-1) ?? null;
}

function estimateCap14Inputs(input: KpiSummaryInput): KpiCap14Input {
  const latest = latestCashflow(input.cashFlowMonths);
  const latestProjectedBalance = latest ? computeMonthCashFlow(latest).projectedEndingBalance : 0;
  const monthlyBurn = latest
    ? computeMonthCashFlow(latest).actualTotalOutflows || computeMonthCashFlow(latest).projectedTotalOutflows
    : 0;
  const accountsReceivable = input.revenue * 0.2;
  const totalAssets = Math.max(latestProjectedBalance + accountsReceivable, 1);
  const inventory = input.directCosts * 0.25;
  const avgInventory = Math.max(inventory, 1);
  const currentLiabilities = Math.max(monthlyBurn, 1);
  const currentAssets = Math.max(latestProjectedBalance + accountsReceivable + inventory, 1);

  return {
    currentAssets,
    currentLiabilities,
    inventory,
    totalAssets,
    netIncome:
      input.revenue - input.directCosts - input.operatingExpenses - input.taxesAndInterest,
    cogs: input.directCosts,
    avgInventory,
    accountsReceivable,
    creditSales: input.revenue,
    periodDays: 30,
    availableCash: latestProjectedBalance,
    monthlyBurn,
  };
}

export function computeKpiMargins(input: MarginInput): MarginResult {
  if (input.revenue === 0) {
    return { grossMargin: null, netMargin: null };
  }

  const grossMargin = ((input.revenue - input.directCosts) / input.revenue) * 100;
  const netMargin =
    ((input.revenue - input.directCosts - input.operatingExpenses - input.taxesAndInterest) /
      input.revenue) *
    100;

  return { grossMargin, netMargin };
}

export function computeCap14Kpis(input: KpiCap14Input): KpiCap14Summary {
  const currentRatio = safeDivide(input.currentAssets, input.currentLiabilities);
  const acidTest = safeDivide(input.currentAssets - input.inventory, input.currentLiabilities);
  const roa = safeDivide(input.netIncome, input.totalAssets);
  const inventoryTurnover = safeDivide(input.cogs, input.avgInventory);
  const daysSalesOutstanding = safeDivide(input.accountsReceivable, input.creditSales);
  const runwayMonths = safeDivide(input.availableCash, input.monthlyBurn);

  return {
    currentRatio,
    acidTest,
    roa: roa === null ? null : roa * 100,
    inventoryTurnover,
    daysSalesOutstanding: daysSalesOutstanding === null ? null : daysSalesOutstanding * input.periodDays,
    burnRate: input.monthlyBurn,
    runwayMonths,
  };
}

export function deriveKpiSummary(input: KpiSummaryInput): KpiSummary {
  const margins = computeKpiMargins(input);
  const latestCashFlow = latestCashflow(input.cashFlowMonths);
  const cashFlowProjectedBalance = latestCashFlow
    ? computeMonthCashFlow(latestCashFlow).projectedEndingBalance
    : 0;

  const cap14Input = estimateCap14Inputs(input);
  const cap14 = computeCap14Kpis(cap14Input);

  return {
    margins,
    cashFlowProjectedBalance,
    latestBudgetYear: input.budget?.year ?? null,
    costsCount: input.costEntries.length,
    cap14,
  };
}
