import { computeVariance } from "@/lib/calculations/budget";
import { calculateBusinessModelAnalyzer } from "@/lib/calculations/advanced/business-model-analyzer";
import { calculateContingency } from "@/lib/calculations/advanced/contingency-planner";
import { calculateDebtManager } from "@/lib/calculations/advanced/debt-manager";
import { calculateFinancialEducation } from "@/lib/calculations/advanced/financial-education-kit";
import { calculateFinancialStrategy } from "@/lib/calculations/advanced/financial-strategy-planner";
import { calculateFinancingOptions } from "@/lib/calculations/advanced/financing-options";
import { calculateFintechEvaluator } from "@/lib/calculations/advanced/fintech-evaluator";
import { calculateInternationalFinance } from "@/lib/calculations/advanced/international-finance-manager";
import { calculateInvestmentEvaluator } from "@/lib/calculations/advanced/investment-evaluator";
import { calculateProfitability } from "@/lib/calculations/advanced/profitability-analyzer";
import { calculateResilience } from "@/lib/calculations/advanced/resilience-evaluator";
import { calculateUnitEconomics } from "@/lib/calculations/advanced/unit-economics";
import { calculateValuation } from "@/lib/calculations/advanced/valuation-calculator";
import type {
  AnnualBudget,
  BusinessModelAnalyzerModel,
  ContingencyModel,
  CashFlowEntry,
  CashFlowLine,
  CostExpenseEntry,
  DebtManagerModel,
  FinancialEducationModel,
  FinancialStrategyModel,
  FinancingOptionsModel,
  FintechEvaluatorModel,
  InternationalFinanceModel,
  InvestmentEvaluatorModel,
  ProfitabilityModel,
  ResilienceModel,
  UnitEconomicsModel,
  ValuationModel,
} from "@/lib/domain";
import { MONTH_LABELS_ES } from "@/lib/months";

import type {
  BudgetCsvRow,
  CashFlowCsvRow,
  CostsCsvRow,
  CsvRows,
} from "@/lib/csv/types";

const CASH_FLOW_HEADERS = [
  "month",
  "starting_balance",
  "line_type",
  "line_name",
  "projected",
  "actual",
];

const COSTS_HEADERS = [
  "id",
  "date",
  "description",
  "amount",
  "type",
  "category",
  "notes",
];

const BUDGET_HEADERS = [
  "year",
  "section",
  "line_name",
  "month_index",
  "month_label",
  "planned",
  "actual",
  "variance_amount",
  "variance_pct",
];

function normalize12(values: number[]): number[] {
  const output = values.slice(0, 12);
  while (output.length < 12) {
    output.push(0);
  }
  return output;
}

function isMeaningfulCashFlowLine(line: CashFlowLine): boolean {
  return line.name.trim() !== "" || line.projected !== 0 || (line.actual ?? 0) !== 0;
}

export function buildCashFlowCsv(entries: CashFlowEntry[]): CsvRows {
  const rows: CashFlowCsvRow[] = [];
  const sortedEntries = [...entries].sort((a, b) => a.month.localeCompare(b.month));

  for (const entry of sortedEntries) {
    for (const line of entry.inflows) {
      if (!isMeaningfulCashFlowLine(line)) {
        continue;
      }
      rows.push({
        month: entry.month,
        starting_balance: entry.startingBalance,
        line_type: "inflow",
        line_name: line.name,
        projected: line.projected,
        actual: line.actual ?? null,
      });
    }

    for (const line of entry.outflows) {
      if (!isMeaningfulCashFlowLine(line)) {
        continue;
      }
      rows.push({
        month: entry.month,
        starting_balance: entry.startingBalance,
        line_type: "outflow",
        line_name: line.name,
        projected: line.projected,
        actual: line.actual ?? null,
      });
    }
  }

  return {
    headers: CASH_FLOW_HEADERS,
    rows: rows.map((row) => [
      row.month,
      row.starting_balance,
      row.line_type,
      row.line_name,
      row.projected,
      row.actual,
    ]),
  };
}

export function buildCostsCsv(entries: CostExpenseEntry[]): CsvRows {
  const rows: CostsCsvRow[] = entries.map((entry) => ({
    id: entry.id ?? null,
    date: entry.date,
    description: entry.description,
    amount: entry.amount,
    type: entry.type,
    category: entry.category,
    notes: entry.notes ?? "",
  }));

  return {
    headers: COSTS_HEADERS,
    rows: rows.map((row) => [
      row.id,
      row.date,
      row.description,
      row.amount,
      row.type,
      row.category,
      row.notes,
    ]),
  };
}

function lineHasValues(planned: number[], actual: number[]): boolean {
  return [...planned, ...actual].some((value) => value !== 0);
}

export function buildBudgetCsv(budget: AnnualBudget): CsvRows {
  const rows: BudgetCsvRow[] = [];
  const sections = [
    { name: "income" as const, lines: budget.incomeLines },
    { name: "expense" as const, lines: budget.expenseLines },
  ];

  for (const section of sections) {
    for (const line of section.lines) {
      const plannedByMonth = normalize12(line.plannedByMonth);
      const actualByMonth = normalize12(line.actualByMonth);
      if (!lineHasValues(plannedByMonth, actualByMonth)) {
        continue;
      }

      for (let index = 0; index < 12; index += 1) {
        const planned = plannedByMonth[index];
        const actual = actualByMonth[index];
        const variance = computeVariance(planned, actual);

        rows.push({
          year: budget.year,
          section: section.name,
          line_name: line.name,
          month_index: index + 1,
          month_label: MONTH_LABELS_ES[index],
          planned,
          actual,
          variance_amount: variance.amount,
          variance_pct: variance.percent,
        });
      }
    }
  }

  return {
    headers: BUDGET_HEADERS,
    rows: rows.map((row) => [
      row.year,
      row.section,
      row.line_name,
      row.month_index,
      row.month_label,
      row.planned,
      row.actual,
      row.variance_amount,
      row.variance_pct,
    ]),
  };
}

export function buildUnitEconomicsCsv(model: UnitEconomicsModel): CsvRows {
  const summary = calculateUnitEconomics(model);
  return {
    headers: [
      "period",
      "price",
      "variable_cost",
      "contribution_margin",
      "coca",
      "ltv",
      "ltv_coca",
      "payback_months",
    ],
    rows: summary.discountedGrossProfit.map((_, index) => [
      index + 1,
      model.price,
      model.variableCost,
      summary.contributionMargin,
      summary.coca,
      summary.ltv,
      summary.ltvCoca,
      summary.paybackMonths,
    ]),
  };
}

export function buildFinancingOptionsCsv(model: FinancingOptionsModel): CsvRows {
  const summary = calculateFinancingOptions(model);
  return {
    headers: [
      "option_type",
      "principal",
      "rate",
      "term",
      "fees",
      "effective_cost_pct",
      "total_cost",
      "dilution_pct",
      "score",
    ],
    rows: [
      [
        model.optionType,
        model.principal,
        model.annualRatePct,
        model.termMonths,
        model.fees + model.otherCosts,
        summary.effectiveDebtCostPct,
        summary.totalFinancingCost,
        summary.dilutionImpact,
        summary.optionScore,
      ],
    ],
  };
}

export function buildDebtManagerCsv(model: DebtManagerModel): CsvRows {
  const summary = calculateDebtManager(model);
  return {
    headers: [
      "debt_id",
      "balance",
      "rate",
      "term",
      "fees",
      "effective_cost",
      "debt_ratio",
      "interest_coverage",
      "strategy_priority",
    ],
    rows: [
      [
        "primary",
        model.primaryBalance,
        model.primaryRatePct,
        "",
        model.fees,
        summary.effectiveDebtCost,
        summary.debtRatio,
        summary.interestCoverage,
        summary.avalancheOrder.indexOf("primary") + 1,
      ],
      [
        "secondary",
        model.secondaryBalance,
        model.secondaryRatePct,
        "",
        model.fees,
        summary.effectiveDebtCost,
        summary.debtRatio,
        summary.interestCoverage,
        summary.avalancheOrder.indexOf("secondary") + 1,
      ],
    ],
  };
}

export function buildProfitabilityCsv(model: ProfitabilityModel): CsvRows {
  const summary = calculateProfitability(model);
  return {
    headers: [
      "segment",
      "revenue",
      "cogs",
      "opex",
      "net_income",
      "gross_margin",
      "operating_margin",
      "net_margin",
      "roi",
    ],
    rows: [
      [
        "main",
        model.sales,
        model.cogs,
        model.opex,
        model.netIncome,
        summary.grossMargin,
        summary.operatingMargin,
        summary.netMargin,
        summary.roi,
      ],
      [
        "segment",
        model.segmentRevenue,
        model.segmentCosts,
        "",
        model.segmentRevenue - model.segmentCosts,
        "",
        "",
        "",
        "",
      ],
    ],
  };
}

export function buildFinancialStrategyCsv(model: FinancialStrategyModel): CsvRows {
  const summary = calculateFinancialStrategy(model);
  return {
    headers: [
      "year",
      "revenue",
      "net_income",
      "reinvestment",
      "dividends",
      "debt_pct",
      "equity_pct",
      "target_status",
    ],
    rows: summary.rows.map((row) => [
      row.year,
      row.revenue,
      row.netIncome,
      row.reinvestment,
      row.dividends,
      row.debtPct,
      row.equityPct,
      row.targetStatus,
    ]),
  };
}

export function buildContingencyCsv(model: ContingencyModel): CsvRows {
  const summary = calculateContingency(model);
  return {
    headers: [
      "risk",
      "probability",
      "impact",
      "risk_score",
      "trigger",
      "owner",
      "response_time",
      "reserve_target",
      "coverage_months",
    ],
    rows: [
      [
        model.riskName,
        model.probabilityPct,
        model.impactPct,
        summary.riskScore,
        model.trigger,
        model.owner,
        model.responseTimeDays,
        summary.emergencyFundTarget,
        summary.coverageMonths,
      ],
    ],
  };
}

export function buildFinancialEducationCsv(model: FinancialEducationModel): CsvRows {
  const summary = calculateFinancialEducation(model);
  return {
    headers: [
      "role",
      "knowledge_index",
      "completion_rate",
      "training_cost",
      "profit_improvement",
      "training_roi",
    ],
    rows: [
      [
        model.role,
        summary.knowledgeIndex,
        summary.completionRate,
        model.trainingCost,
        model.profitImprovement,
        summary.trainingRoi,
      ],
    ],
  };
}

export function buildInvestmentEvaluatorCsv(model: InvestmentEvaluatorModel): CsvRows {
  const summary = calculateInvestmentEvaluator(model);
  return {
    headers: [
      "investment_id",
      "initial_cost",
      "annual_benefit",
      "roi",
      "payback",
      "npv",
      "irr",
      "scenario",
    ],
    rows: [
      [
        model.investmentId,
        model.initialCost,
        model.annualBenefit,
        summary.roi,
        summary.payback,
        summary.npv,
        summary.irr,
        model.scenario,
      ],
    ],
  };
}

export function buildBusinessModelAnalyzerCsv(model: BusinessModelAnalyzerModel): CsvRows {
  const summary = calculateBusinessModelAnalyzer(model);
  return {
    headers: ["model", "kpi_name", "kpi_value", "benchmark", "target", "gap"],
    rows: [
      [model.model, summary.kpiName, summary.kpiValue, summary.benchmark, summary.target, summary.gap],
    ],
  };
}

export function buildInternationalFinanceCsv(model: InternationalFinanceModel): CsvRows {
  const summary = calculateInternationalFinance(model);
  return {
    headers: [
      "currency",
      "exposure",
      "planned_rate",
      "actual_rate",
      "fx_impact",
      "hedged_delta",
      "recommended_price",
    ],
    rows: [
      [
        model.currencyCode,
        model.foreignAmount,
        model.plannedRate,
        model.actualRate,
        summary.fxImpact,
        summary.hedgedDelta,
        summary.recommendedPrice,
      ],
    ],
  };
}

export function buildFintechEvaluatorCsv(model: FintechEvaluatorModel): CsvRows {
  const summary = calculateFintechEvaluator(model);
  return {
    headers: [
      "tool",
      "fit_score",
      "annual_cost",
      "annual_benefit",
      "roi",
      "migration_risk",
      "recommendation",
    ],
    rows: [
      [
        model.tool,
        summary.fitScore,
        model.annualCost,
        model.annualBenefit,
        summary.toolRoi,
        summary.migrationRiskScore,
        summary.fitScore >= 70 ? "adopt" : "review",
      ],
    ],
  };
}

export function buildValuationCsv(model: ValuationModel): CsvRows {
  const summary = calculateValuation(model);
  return {
    headers: ["method", "value", "inputs_summary", "sensitivity_case"],
    rows: [
      ["sales_multiple", summary.valueSalesMultiple, `multiple=${model.salesMultiple}`, "base"],
      ["ebitda_multiple", summary.valueEbitdaMultiple, `multiple=${model.ebitdaMultiple}`, "base"],
      [
        "net_income_multiple",
        summary.valueNetIncomeMultiple,
        `multiple=${model.netIncomeMultiple}`,
        "base",
      ],
      ["book_value", summary.bookValue, "assets-liabilities", "base"],
      ["dcf", summary.dcfValue, `rate=${model.discountRatePct}%`, "base"],
    ],
  };
}

export function buildResilienceCsv(model: ResilienceModel): CsvRows {
  const summary = calculateResilience(model);
  return {
    headers: [
      "pillar",
      "score",
      "weight",
      "weighted_score",
      "reserve_target",
      "runway_months",
      "crisis_impact",
    ],
    rows: [
      [
        "liquidity",
        model.liquidityScore,
        0.3,
        model.liquidityScore * 0.3,
        summary.reserveTarget,
        summary.runwayMonths,
        summary.crisisImpact,
      ],
      ["debt", model.debtScore, 0.25, model.debtScore * 0.25, "", "", ""],
      [
        "diversification",
        model.diversificationScore,
        0.2,
        model.diversificationScore * 0.2,
        "",
        "",
        "",
      ],
      [
        "contingency_readiness",
        model.contingencyReadinessScore,
        0.25,
        model.contingencyReadinessScore * 0.25,
        "",
        "",
        "",
      ],
    ],
  };
}
