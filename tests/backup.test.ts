import { describe, expect, it } from "vitest";

import { CURRENT_SCHEMA_VERSION, parseAndMigrateBackup } from "@/lib/backup";
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

function advancedToolsPayload() {
  return {
    unitEconomics: DEFAULT_UNIT_ECONOMICS,
    financingOptions: DEFAULT_FINANCING_OPTIONS,
    debtManager: DEFAULT_DEBT_MANAGER,
    profitabilityAnalyzer: DEFAULT_PROFITABILITY,
    financialStrategyPlanner: DEFAULT_FINANCIAL_STRATEGY,
    contingencyPlanner: DEFAULT_CONTINGENCY,
    financialEducationKit: DEFAULT_FINANCIAL_EDUCATION,
    investmentEvaluator: DEFAULT_INVESTMENT_EVALUATOR,
    businessModelAnalyzer: DEFAULT_BUSINESS_MODEL_ANALYZER,
    internationalFinanceManager: DEFAULT_INTERNATIONAL_FINANCE,
    fintechEvaluator: DEFAULT_FINTECH_EVALUATOR,
    valuationCalculator: DEFAULT_VALUATION,
    resilienceEvaluator: DEFAULT_RESILIENCE,
  };
}

describe("backup import validation and migration", () => {
  it("accepts a valid current-schema backup payload", () => {
    const payload = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      settings: {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        baseCurrency: { code: "MXN", symbol: "$" },
        currencyDisplayMode: "base",
        fxRateToUsd: 20,
        businessModel: "services",
        onboardingCompletedAt: "2026-02-19T10:00:00.000Z",
      },
      progress: {
        completedChapterSlugs: ["capitulo1_internacional"],
        bookmarks: [{ slug: "capitulo1_internacional", updatedAt: "2026-01-01" }],
        dismissedTipIds: ["cashflow-starting-balance"],
        dismissedGuideBlocks: ["cashflow-purpose"],
        toolSampleState: { cashflow: "dismissed" },
        toolStepProgress: {
          cashflow: {
            currentStepId: "cashflow-step-context",
            completedStepIds: ["cashflow-step-context"],
          },
        },
        activeLearningLayer: "intermediate",
      },
      cashflow: [],
      costs: [],
      budget: [],
      breakeven: null,
      ...advancedToolsPayload(),
    };

    const parsed = parseAndMigrateBackup(payload);
    expect(parsed.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(parsed.settings.baseCurrency.code).toBe("MXN");
    expect(parsed.settings.currencyDisplayMode).toBe("base");
    expect(parsed.unitEconomics.price).toBe(DEFAULT_UNIT_ECONOMICS.price);
    expect(parsed.progress.activeLearningLayer).toBe("intermediate");
    expect(parsed.progress.dismissedGuideBlocks).toContain("cashflow-purpose");
    expect(parsed.progress.toolStepProgress.cashflow?.currentStepId).toBe("cashflow-step-context");
  });

  it("migrates schema v2 payload into v4 defaults for new tools", () => {
    const payload = {
      schemaVersion: 2,
      settings: {
        schemaVersion: 2,
        baseCurrency: { code: "MXN", symbol: "$" },
        currencyDisplayMode: "base",
        fxRateToUsd: 20,
        businessModel: "saas",
      },
      progress: {
        completedChapterSlugs: [],
        bookmarks: [],
        dismissedTipIds: [],
        toolSampleState: {},
      },
      cashflow: [],
      costs: [],
      budget: [],
      breakeven: null,
    };

    const parsed = parseAndMigrateBackup(payload);
    expect(parsed.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(parsed.settings.businessModel).toBe("saas");
    expect(parsed.financingOptions.optionType).toBe(DEFAULT_FINANCING_OPTIONS.optionType);
    expect(parsed.progress.dismissedGuideBlocks).toEqual([]);
    expect(parsed.progress.toolStepProgress).toEqual({});
  });

  it("migrates schema v1 payload into v4 settings/progress defaults", () => {
    const payload = {
      schemaVersion: 1,
      settings: {
        schemaVersion: 1,
        baseCurrency: { code: "MXN", symbol: "$" },
        showUsd: true,
        fxRateToUsd: 20,
        businessModel: "saas",
      },
      progress: { completedChapterSlugs: [], bookmarks: [] },
      cashflow: [],
      costs: [],
      budget: [],
      breakeven: null,
    };

    const parsed = parseAndMigrateBackup(payload);
    expect(parsed.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(parsed.settings.currencyDisplayMode).toBe("usd");
    expect(parsed.settings.businessModel).toBe("saas");
    expect(parsed.progress.dismissedTipIds).toEqual([]);
    expect(parsed.progress.toolSampleState).toEqual({});
    expect(parsed.progress.activeLearningLayer).toBe("base");
  });

  it("migrates schema v0 payload and fills v4 defaults", () => {
    const payload = {
      schemaVersion: 0,
      settings: {
        schemaVersion: 0,
        baseCurrency: { code: "MXN", symbol: "$" },
        showUsd: false,
        fxRateToUsd: 20,
      },
      progress: { completedChapterSlugs: [], bookmarks: [] },
      cashflow: [],
      costs: [],
      budget: [],
      breakeven: null,
    };

    const parsed = parseAndMigrateBackup(payload);
    expect(parsed.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(parsed.settings.businessModel).toBe("other");
    expect(parsed.settings.currencyDisplayMode).toBe("base");
    expect(parsed.progress.dismissedTipIds).toEqual([]);
  });

  it("rejects unsupported schema versions", () => {
    const payload = {
      schemaVersion: 999,
      settings: {
        schemaVersion: 999,
        baseCurrency: { code: "MXN", symbol: "$" },
        showUsd: true,
        fxRateToUsd: 20,
      },
      progress: { completedChapterSlugs: [], bookmarks: [] },
      cashflow: [],
      costs: [],
      budget: [],
      breakeven: null,
    };

    expect(() => parseAndMigrateBackup(payload)).toThrowError();
  });
});
