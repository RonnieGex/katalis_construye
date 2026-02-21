import { describe, expect, it } from "vitest";

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
import {
  DEFAULT_BUSINESS_MODEL_ANALYZER,
  DEFAULT_CONTINGENCY,
  DEFAULT_DEBT_MANAGER,
  DEFAULT_FINANCIAL_EDUCATION,
  DEFAULT_FINANCIAL_STRATEGY,
  DEFAULT_FINANCING_OPTIONS,
  DEFAULT_FINTECH_EVALUATOR,
  DEFAULT_INTERNATIONAL_FINANCE,
  DEFAULT_INVESTMENT_EVALUATOR,
  DEFAULT_PROFITABILITY,
  DEFAULT_RESILIENCE,
  DEFAULT_UNIT_ECONOMICS,
  DEFAULT_VALUATION,
} from "@/lib/defaults";

describe("advanced formula calculators", () => {
  it("calculates unit economics metrics", () => {
    const result = calculateUnitEconomics(DEFAULT_UNIT_ECONOMICS);
    expect(result.contributionMargin).toBe(130);
    expect(result.coca).toBe(100);
    expect(result.ltv).toBe(4800);
    expect(result.discountedGrossProfit.length).toBe(12);
  });

  it("calculates financing options score and effective cost", () => {
    const result = calculateFinancingOptions(DEFAULT_FINANCING_OPTIONS);
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.effectiveDebtCostPct).toBeGreaterThan(0);
    expect(result.optionScore).toBeGreaterThanOrEqual(0);
  });

  it("returns debt metrics and strategy order", () => {
    const result = calculateDebtManager(DEFAULT_DEBT_MANAGER);
    expect(result.debtRatio).toBeCloseTo(40, 6);
    expect(result.avalancheOrder[0]).toBe("primary");
    expect(result.snowballOrder[0]).toBe("primary");
  });

  it("calculates profitability margins and ROI", () => {
    const result = calculateProfitability(DEFAULT_PROFITABILITY);
    expect(result.grossMargin).toBeCloseTo(40, 6);
    expect(result.operatingMargin).toBeCloseTo(15, 6);
    expect(result.roi).toBeCloseTo(5, 6);
  });

  it("projects financial strategy rows", () => {
    const result = calculateFinancialStrategy(DEFAULT_FINANCIAL_STRATEGY);
    expect(result.rows).toHaveLength(5);
    expect(result.debtMixConstraint).toBe(true);
  });

  it("calculates contingency reserve and coverage", () => {
    const result = calculateContingency(DEFAULT_CONTINGENCY);
    expect(result.riskScore).toBe(1500);
    expect(result.emergencyFundTarget).toBe(600000);
    expect(result.coverageMonths).toBeCloseTo(3.5, 6);
  });

  it("calculates financial education completion and roi", () => {
    const result = calculateFinancialEducation(DEFAULT_FINANCIAL_EDUCATION);
    expect(result.knowledgeIndex).toBeCloseTo(71.6666667, 6);
    expect(result.completionRate).toBeCloseTo(60, 6);
    expect(result.trainingRoi).toBeCloseTo(75, 6);
  });

  it("calculates investment evaluator npv and irr", () => {
    const result = calculateInvestmentEvaluator(DEFAULT_INVESTMENT_EVALUATOR);
    expect(result.payback).toBeCloseTo(2.5, 6);
    expect(result.npv).toBeGreaterThan(0);
    expect(result.irr).not.toBeNull();
  });

  it("calculates business model analyzer gap", () => {
    const result = calculateBusinessModelAnalyzer(DEFAULT_BUSINESS_MODEL_ANALYZER);
    expect(result.kpiName).toBe("Margen bruto");
    expect(result.kpiValue).toBeCloseTo(41.6666667, 6);
    expect(result.gap).toBeCloseTo(-37.6666667, 6);
  });

  it("calculates international finance deltas", () => {
    const result = calculateInternationalFinance(DEFAULT_INTERNATIONAL_FINANCE);
    expect(result.convertedAmount).toBe(180000);
    expect(result.fxImpact).toBe(-20000);
    expect(result.hedgedDelta).toBe(20000);
  });

  it("calculates fintech score and roi", () => {
    const result = calculateFintechEvaluator(DEFAULT_FINTECH_EVALUATOR);
    expect(result.fitScore).toBeCloseTo(73.75, 6);
    expect(result.toolRoi).toBeCloseTo(80, 6);
    expect(result.migrationRiskScore).toBeCloseTo(30.5, 6);
  });

  it("calculates valuation outputs", () => {
    const result = calculateValuation(DEFAULT_VALUATION);
    expect(result.valueSalesMultiple).toBeCloseTo(2400000, 6);
    expect(result.valueEbitdaMultiple).toBeCloseTo(1500000, 6);
    expect(result.bookValue).toBeCloseTo(1000000, 6);
  });

  it("calculates resilience and runway", () => {
    const result = calculateResilience(DEFAULT_RESILIENCE);
    expect(result.reserveTarget).toBeCloseTo(600000, 6);
    expect(result.runwayMonths).toBeCloseTo(6, 6);
    expect(result.resilienceScore).toBeCloseTo(63.25, 6);
  });
});
