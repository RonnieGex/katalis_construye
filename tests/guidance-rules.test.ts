import { describe, expect, it } from "vitest";

import { getStageRecommendation } from "@/lib/guidance/recommendations";
import { resolveGuidanceStage } from "@/lib/guidance/stages";
import type { AppSettings, BreakEvenModel, ProgressState } from "@/lib/domain";
import { CURRENT_SCHEMA_VERSION } from "@/lib/schema-version";

const settings: AppSettings = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  baseCurrency: { code: "MXN", symbol: "$" },
  currencyDisplayMode: "base",
  fxRateToUsd: 20,
  businessModel: "other",
};

const progress: ProgressState = {
  completedChapterSlugs: [],
  bookmarks: [],
  dismissedTipIds: [],
  dismissedGuideBlocks: [],
  toolSampleState: {},
  toolStepProgress: {},
  activeLearningLayer: "base",
};

const breakEvenUser: BreakEvenModel = {
  fixedCosts: 1000,
  singleProduct: { price: 100, variableCost: 40 },
  scenarios: [],
  seedSource: "user",
};

describe("guidance stage rules", () => {
  it("resolves setup stage when onboarding is incomplete", () => {
    const result = resolveGuidanceStage({
      settings,
      progress,
      cashflow: [],
      costs: [],
      budgets: [],
      breakEven: null,
    });

    expect(result.currentStage).toBe("setup");
  });

  it("moves to costos stage after setup and chapter 1 completion", () => {
    const result = resolveGuidanceStage({
      settings: { ...settings, onboardingCompletedAt: "2026-02-19T10:00:00.000Z" },
      progress: { ...progress, completedChapterSlugs: ["capitulo1_internacional"] },
      cashflow: [],
      costs: [],
      budgets: [],
      breakEven: null,
    });

    expect(result.currentStage).toBe("costos");
  });

  it("resolves presupuesto when previous milestones are satisfied", () => {
    const result = resolveGuidanceStage({
      settings: { ...settings, onboardingCompletedAt: "2026-02-19T10:00:00.000Z" },
      progress: { ...progress, completedChapterSlugs: ["capitulo1_internacional"] },
      costs: [
        { date: "2026-01-01", description: "A", amount: 100, type: "fixed_cost", category: "ops", seedSource: "user" },
        { date: "2026-01-02", description: "B", amount: 120, type: "variable_cost", category: "ops", seedSource: "user" },
        { date: "2026-01-03", description: "C", amount: 90, type: "expense", category: "ops", seedSource: "user" },
      ],
      cashflow: [
        {
          month: "2026-01",
          startingBalance: 1000,
          inflows: [{ name: "Ventas", projected: 3000, actual: 2800 }],
          outflows: [{ name: "Costos", projected: 1200, actual: 1400 }],
          seedSource: "user",
        },
      ],
      breakEven: breakEvenUser,
      budgets: [
        {
          year: 2026,
          incomeLines: [{ name: "Ventas", plannedByMonth: [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], actualByMonth: [90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
          expenseLines: [{ name: "Gastos", plannedByMonth: [80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], actualByMonth: [70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
          seedSource: "user",
        },
      ],
    });

    expect(result.currentStage).toBe("presupuesto");
    expect(getStageRecommendation(result.currentStage).actionHref).toBe("/tools/budget");
  });
});
