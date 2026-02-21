import type { BackupSnapshot, ProgressState } from "@/lib/domain";
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
import {
  appSettingsSchema,
  backupSnapshotSchema,
  legacyBackupV0Schema,
  legacyBackupV1Schema,
  legacyBackupV2Schema,
  legacyBackupV3Schema,
  progressStateSchema,
  toolIdSchema,
  toolSampleStateSchema,
} from "@/lib/schemas";
import { CURRENT_SCHEMA_VERSION } from "@/lib/schema-version";

export { CURRENT_SCHEMA_VERSION };

const EMPTY_PROGRESS: ProgressState = {
  completedChapterSlugs: [],
  bookmarks: [],
  dismissedTipIds: [],
  dismissedGuideBlocks: [],
  toolSampleState: {},
  toolStepProgress: {},
  activeLearningLayer: "base",
};

function createCurrentSnapshotBase(
  settings: BackupSnapshot["settings"],
  progress: BackupSnapshot["progress"],
  cashflow: BackupSnapshot["cashflow"],
  costs: BackupSnapshot["costs"],
  budget: BackupSnapshot["budget"],
  breakeven: BackupSnapshot["breakeven"],
): BackupSnapshot {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    settings: {
      ...settings,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    },
    progress,
    cashflow,
    costs,
    budget,
    breakeven,
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

export function parseAndMigrateBackup(input: unknown): BackupSnapshot {
  const withVersion = getSchemaVersion(input);

  if (withVersion === CURRENT_SCHEMA_VERSION) {
    const parsed = backupSnapshotSchema.parse(input);
    return {
      ...parsed,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      settings: {
        ...appSettingsSchema.parse(parsed.settings),
        schemaVersion: CURRENT_SCHEMA_VERSION,
      },
      progress: normalizeProgress(parsed.progress),
    };
  }

  if (withVersion === 3) {
    const legacy = legacyBackupV3Schema.parse(input);
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      settings: {
        ...legacy.settings,
        schemaVersion: CURRENT_SCHEMA_VERSION,
      },
      progress: normalizeProgress(legacy.progress),
      cashflow: legacy.cashflow,
      costs: legacy.costs,
      budget: legacy.budget,
      breakeven: legacy.breakeven,
      unitEconomics: legacy.unitEconomics,
      financingOptions: legacy.financingOptions,
      debtManager: legacy.debtManager,
      profitabilityAnalyzer: legacy.profitabilityAnalyzer,
      financialStrategyPlanner: legacy.financialStrategyPlanner,
      contingencyPlanner: legacy.contingencyPlanner,
      financialEducationKit: legacy.financialEducationKit,
      investmentEvaluator: legacy.investmentEvaluator,
      businessModelAnalyzer: legacy.businessModelAnalyzer,
      internationalFinanceManager: legacy.internationalFinanceManager,
      fintechEvaluator: legacy.fintechEvaluator,
      valuationCalculator: legacy.valuationCalculator,
      resilienceEvaluator: legacy.resilienceEvaluator,
    };
  }

  if (withVersion === 2) {
    const legacy = legacyBackupV2Schema.parse(input);
    return createCurrentSnapshotBase(
      {
        ...legacy.settings,
        schemaVersion: CURRENT_SCHEMA_VERSION,
      },
      normalizeProgress(legacy.progress),
      legacy.cashflow,
      legacy.costs,
      legacy.budget,
      legacy.breakeven,
    );
  }

  if (withVersion === 1) {
    const legacy = legacyBackupV1Schema.parse(input);
    return createCurrentSnapshotBase(
      {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        baseCurrency: legacy.settings.baseCurrency,
        currencyDisplayMode: legacy.settings.showUsd ? "usd" : "base",
        fxRateToUsd: legacy.settings.fxRateToUsd,
        businessModel: legacy.settings.businessModel,
      },
      normalizeProgress(legacy.progress),
      legacy.cashflow,
      legacy.costs,
      legacy.budget,
      legacy.breakeven,
    );
  }

  if (withVersion === 0) {
    const legacy = legacyBackupV0Schema.parse(input);
    return createCurrentSnapshotBase(
      {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        baseCurrency: legacy.settings.baseCurrency,
        currencyDisplayMode: legacy.settings.showUsd ? "usd" : "base",
        fxRateToUsd: legacy.settings.fxRateToUsd,
        businessModel: "other",
      },
      normalizeProgress(legacy.progress),
      legacy.cashflow,
      legacy.costs,
      legacy.budget,
      legacy.breakeven,
    );
  }

  throw new Error(`Unsupported schema version: ${String(withVersion)}`);
}

function normalizeProgress(input: unknown): ProgressState {
  const parsed = progressStateSchema.safeParse(input);
  if (!parsed.success) {
    return EMPTY_PROGRESS;
  }

  const tipIds = parsed.data.dismissedTipIds.filter((value) => value.trim().length > 0);
  const dismissedGuideBlocks = parsed.data.dismissedGuideBlocks.filter(
    (value) => value.trim().length > 0,
  );

  const toolSampleState: ProgressState["toolSampleState"] = {};
  for (const [key, value] of Object.entries(parsed.data.toolSampleState)) {
    const toolId = toolIdSchema.safeParse(key);
    const state = toolSampleStateSchema.safeParse(value);
    if (!toolId.success || !state.success) {
      continue;
    }
    toolSampleState[toolId.data] = state.data;
  }

  const toolStepProgress: ProgressState["toolStepProgress"] = {};
  for (const [key, value] of Object.entries(parsed.data.toolStepProgress)) {
    const toolId = toolIdSchema.safeParse(key);
    if (!toolId.success) {
      continue;
    }

    if (!value || typeof value !== "object") {
      continue;
    }

    const currentStepId = (value as { currentStepId?: unknown }).currentStepId;
    const completedStepIds = (value as { completedStepIds?: unknown }).completedStepIds;

    if (typeof currentStepId !== "string" || currentStepId.trim().length === 0) {
      continue;
    }

    const normalizedCompleted = Array.isArray(completedStepIds)
      ? completedStepIds.filter(
          (stepId): stepId is string => typeof stepId === "string" && stepId.trim().length > 0,
        )
      : [];

    toolStepProgress[toolId.data] = {
      currentStepId,
      completedStepIds: Array.from(new Set(normalizedCompleted)),
    };
  }

  return {
    completedChapterSlugs: parsed.data.completedChapterSlugs,
    bookmarks: parsed.data.bookmarks,
    dismissedTipIds: tipIds,
    dismissedGuideBlocks,
    toolSampleState,
    toolStepProgress,
    activeLearningLayer: parsed.data.activeLearningLayer,
  };
}

function getSchemaVersion(input: unknown): number {
  if (!input || typeof input !== "object" || !("schemaVersion" in input)) {
    throw new Error("Invalid backup payload");
  }

  const value = (input as { schemaVersion: unknown }).schemaVersion;
  if (typeof value !== "number") {
    throw new Error("Invalid schema version");
  }

  return value;
}
