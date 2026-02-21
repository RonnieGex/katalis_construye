import type {
  AnnualBudget,
  AppSettings,
  BackupSnapshot,
  BreakEvenModel,
  BusinessModelAnalyzerModel,
  CashFlowEntry,
  ContingencyModel,
  CostExpenseEntry,
  DebtManagerModel,
  FinancialEducationModel,
  FinancialStrategyModel,
  FinancingOptionsModel,
  FintechEvaluatorModel,
  InternationalFinanceModel,
  InvestmentEvaluatorModel,
  LearningLayerId,
  ProgressState,
  ProfitabilityModel,
  ResilienceModel,
  ToolId,
  ToolSampleState,
  UnitEconomicsModel,
  ValuationModel,
} from "@/lib/domain";
import { parseAndMigrateBackup } from "@/lib/backup";
import { getDb, type SingletonRecord } from "@/lib/db";
import {
  createDefaultBudget,
  DEFAULT_BREAKEVEN,
  DEFAULT_BUSINESS_MODEL_ANALYZER,
  DEFAULT_CONTINGENCY,
  DEFAULT_DEBT_MANAGER,
  DEFAULT_FINANCIAL_EDUCATION,
  DEFAULT_FINANCIAL_STRATEGY,
  DEFAULT_FINANCING_OPTIONS,
  DEFAULT_FINTECH_EVALUATOR,
  DEFAULT_INTERNATIONAL_FINANCE,
  DEFAULT_INVESTMENT_EVALUATOR,
  DEFAULT_PROGRESS,
  DEFAULT_PROFITABILITY,
  DEFAULT_RESILIENCE,
  DEFAULT_SETTINGS,
  DEFAULT_UNIT_ECONOMICS,
  DEFAULT_VALUATION,
} from "@/lib/defaults";

const BUSINESS_MODELS = new Set(["ecommerce", "services", "saas", "manufacturing", "other"]);
const TOOL_SAMPLE_STATES = new Set(["active", "dismissed", "consumed"]);

function normalizeSettings(settings: AppSettings | null | undefined): AppSettings {
  const baseCurrencyCode = settings?.baseCurrency?.code?.trim().toUpperCase();
  const baseCurrencySymbol = settings?.baseCurrency?.symbol?.trim();
  const legacyMode = settings?.showUsd === true ? "usd" : "base";
  const currencyDisplayMode = settings?.currencyDisplayMode ?? legacyMode;

  return {
    schemaVersion: DEFAULT_SETTINGS.schemaVersion,
    baseCurrency: {
      code: baseCurrencyCode && baseCurrencyCode.length > 0 ? baseCurrencyCode : DEFAULT_SETTINGS.baseCurrency.code,
      symbol:
        baseCurrencySymbol && baseCurrencySymbol.length > 0
          ? baseCurrencySymbol
          : DEFAULT_SETTINGS.baseCurrency.symbol,
    },
    currencyDisplayMode: currencyDisplayMode === "usd" ? "usd" : "base",
    fxRateToUsd:
      typeof settings?.fxRateToUsd === "number" && settings.fxRateToUsd > 0
        ? settings.fxRateToUsd
        : DEFAULT_SETTINGS.fxRateToUsd,
    businessModel: BUSINESS_MODELS.has(settings?.businessModel ?? "")
      ? (settings?.businessModel as AppSettings["businessModel"])
      : DEFAULT_SETTINGS.businessModel,
    onboardingCompletedAt:
      typeof settings?.onboardingCompletedAt === "string" && settings.onboardingCompletedAt.length > 0
        ? settings.onboardingCompletedAt
        : undefined,
  };
}

function normalizeProgress(progress: ProgressState | null | undefined): ProgressState {
  const completedChapterSlugs = Array.isArray(progress?.completedChapterSlugs)
    ? progress.completedChapterSlugs.filter((slug): slug is string => typeof slug === "string")
    : DEFAULT_PROGRESS.completedChapterSlugs;

  const bookmarks = Array.isArray(progress?.bookmarks)
    ? progress.bookmarks.filter(
        (bookmark): bookmark is ProgressState["bookmarks"][number] =>
          typeof bookmark?.slug === "string" && typeof bookmark?.updatedAt === "string",
      )
    : DEFAULT_PROGRESS.bookmarks;

  const dismissedTipIds = Array.isArray(progress?.dismissedTipIds)
    ? Array.from(
        new Set(
          progress.dismissedTipIds.filter(
            (tipId): tipId is string => typeof tipId === "string" && tipId.trim().length > 0,
          ),
        ),
      )
    : DEFAULT_PROGRESS.dismissedTipIds;

  const dismissedGuideBlocks = Array.isArray(progress?.dismissedGuideBlocks)
    ? Array.from(
        new Set(
          progress.dismissedGuideBlocks.filter(
            (blockId): blockId is string => typeof blockId === "string" && blockId.trim().length > 0,
          ),
        ),
      )
    : DEFAULT_PROGRESS.dismissedGuideBlocks;

  const toolSampleState: ProgressState["toolSampleState"] = {};
  const entries = Object.entries(progress?.toolSampleState ?? {});
  for (const [key, value] of entries) {
    if (!TOOL_SAMPLE_STATES.has(value ?? "")) {
      continue;
    }
    toolSampleState[key as ToolId] = value as ToolSampleState;
  }

  const toolStepProgress: ProgressState["toolStepProgress"] = {};
  const stepEntries = Object.entries(progress?.toolStepProgress ?? {});
  for (const [key, value] of stepEntries) {
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

    toolStepProgress[key as ToolId] = {
      currentStepId,
      completedStepIds: Array.from(new Set(normalizedCompleted)),
    };
  }

  const activeLearningLayer: LearningLayerId =
    progress?.activeLearningLayer === "intermediate" || progress?.activeLearningLayer === "advanced"
      ? progress.activeLearningLayer
      : "base";

  return {
    completedChapterSlugs,
    bookmarks,
    dismissedTipIds,
    dismissedGuideBlocks,
    toolSampleState,
    toolStepProgress,
    activeLearningLayer,
  };
}

function isSame<T>(left: T, right: T): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

async function updateProgress(
  updater: (current: ProgressState) => ProgressState,
): Promise<ProgressState> {
  const current = await getProgress();
  const next = normalizeProgress(updater(current));
  await saveProgress(next);
  return next;
}

async function getSingleton<T>(
  table: {
    get: (key: "singleton") => Promise<SingletonRecord<T> | undefined>;
    put: (value: SingletonRecord<T>) => Promise<unknown>;
  },
  fallback: T,
): Promise<T> {
  const record = await table.get("singleton");
  if (!record) {
    await table.put({ id: "singleton", value: fallback });
    return fallback;
  }
  return record.value;
}

async function saveSingleton<T>(
  table: {
    put: (value: SingletonRecord<T>) => Promise<unknown>;
  },
  value: T,
): Promise<void> {
  await table.put({ id: "singleton", value });
}

export async function getSettings(): Promise<AppSettings> {
  const db = getDb();
  const record = await db.settings.get("singleton");
  const normalized = normalizeSettings(record?.value ?? null);

  if (!record || !isSame(record.value, normalized)) {
    await db.settings.put({ id: "singleton", value: normalized });
  }

  return normalized;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = getDb();
  const normalized = normalizeSettings(settings);
  await db.settings.put({ id: "singleton", value: normalized });
}

export async function getProgress(): Promise<ProgressState> {
  const db = getDb();
  const record = await db.progress.get("singleton");
  const normalized = normalizeProgress(record?.value ?? null);

  if (!record || !isSame(record.value, normalized)) {
    await db.progress.put({ id: "singleton", value: normalized });
  }

  return normalized;
}

export async function saveProgress(progress: ProgressState): Promise<void> {
  const db = getDb();
  const normalized = normalizeProgress(progress);
  await db.progress.put({ id: "singleton", value: normalized });
}

export async function toggleChapterCompleted(slug: string): Promise<ProgressState> {
  return updateProgress((progress) => {
    const nextCompleted = new Set(progress.completedChapterSlugs);
    if (nextCompleted.has(slug)) {
      nextCompleted.delete(slug);
    } else {
      nextCompleted.add(slug);
    }

    return {
      ...progress,
      completedChapterSlugs: Array.from(nextCompleted),
    };
  });
}

export async function toggleBookmark(slug: string): Promise<ProgressState> {
  return updateProgress((progress) => {
    const hasBookmark = progress.bookmarks.some((bookmark) => bookmark.slug === slug);
    return {
      ...progress,
      bookmarks: hasBookmark
        ? progress.bookmarks.filter((bookmark) => bookmark.slug !== slug)
        : [
            ...progress.bookmarks,
            {
              slug,
              updatedAt: new Date().toISOString(),
            },
          ],
    };
  });
}

export async function dismissTip(tipId: string): Promise<ProgressState> {
  return updateProgress((progress) => {
    if (progress.dismissedTipIds.includes(tipId)) {
      return progress;
    }
    return {
      ...progress,
      dismissedTipIds: [...progress.dismissedTipIds, tipId],
    };
  });
}

export async function setToolSampleState(
  toolId: ToolId,
  state: ToolSampleState,
): Promise<ProgressState> {
  return updateProgress((progress) => ({
    ...progress,
    toolSampleState: {
      ...progress.toolSampleState,
      [toolId]: state,
    },
  }));
}

export async function resetGuidanceHintsAndSamples(): Promise<ProgressState> {
  return updateProgress((progress) => ({
    ...progress,
    dismissedTipIds: [],
    dismissedGuideBlocks: [],
    toolSampleState: {},
    toolStepProgress: {},
  }));
}

export async function dismissGuideBlock(blockId: string): Promise<ProgressState> {
  return updateProgress((progress) => {
    if (progress.dismissedGuideBlocks.includes(blockId)) {
      return progress;
    }

    return {
      ...progress,
      dismissedGuideBlocks: [...progress.dismissedGuideBlocks, blockId],
    };
  });
}

export async function setToolCurrentStep(toolId: ToolId, stepId: string): Promise<ProgressState> {
  return updateProgress((progress) => {
    const existing = progress.toolStepProgress[toolId];
    const completedStepIds = existing?.completedStepIds ?? [];

    return {
      ...progress,
      toolStepProgress: {
        ...progress.toolStepProgress,
        [toolId]: {
          currentStepId: stepId,
          completedStepIds,
        },
      },
    };
  });
}

export async function completeToolStep(toolId: ToolId, stepId: string): Promise<ProgressState> {
  return updateProgress((progress) => {
    const existing = progress.toolStepProgress[toolId];
    const completedStepIds = Array.from(
      new Set([...(existing?.completedStepIds ?? []), stepId]),
    );
    return {
      ...progress,
      toolStepProgress: {
        ...progress.toolStepProgress,
        [toolId]: {
          currentStepId: stepId,
          completedStepIds,
        },
      },
    };
  });
}

export async function setActiveLearningLayer(layerId: LearningLayerId): Promise<ProgressState> {
  return updateProgress((progress) => ({
    ...progress,
    activeLearningLayer: layerId,
  }));
}

export async function getCashFlowEntry(month: string): Promise<CashFlowEntry | undefined> {
  const db = getDb();
  return db.cashflow.get(month);
}

export async function listCashFlowEntries(): Promise<CashFlowEntry[]> {
  const db = getDb();
  return db.cashflow.orderBy("month").toArray();
}

export async function upsertCashFlowEntry(entry: CashFlowEntry): Promise<void> {
  const db = getDb();
  await db.cashflow.put(entry);
}

export async function upsertCashFlowEntries(entries: CashFlowEntry[]): Promise<void> {
  const db = getDb();
  if (entries.length === 0) {
    return;
  }
  await db.cashflow.bulkPut(entries);
}

export async function clearCashFlowSampleEntries(): Promise<void> {
  const db = getDb();
  const sampleMonths = (await db.cashflow.toArray())
    .filter((entry) => entry.seedSource === "sample")
    .map((entry) => entry.month);

  if (sampleMonths.length === 0) {
    return;
  }

  await db.cashflow.bulkDelete(sampleMonths);
}

export async function listCostEntries(): Promise<CostExpenseEntry[]> {
  const db = getDb();
  return db.costs.orderBy("date").reverse().toArray();
}

export async function addCostEntry(entry: CostExpenseEntry): Promise<number> {
  const db = getDb();
  return db.costs.add(entry);
}

export async function addCostEntries(entries: CostExpenseEntry[]): Promise<void> {
  const db = getDb();
  if (entries.length === 0) {
    return;
  }
  await db.costs.bulkAdd(entries);
}

export async function deleteCostEntry(id: number): Promise<void> {
  const db = getDb();
  await db.costs.delete(id);
}

export async function clearCostSampleEntries(): Promise<void> {
  const db = getDb();
  const sampleIds = (await db.costs.toArray())
    .filter((entry) => entry.seedSource === "sample" && typeof entry.id === "number")
    .map((entry) => entry.id as number);

  if (sampleIds.length === 0) {
    return;
  }

  await db.costs.bulkDelete(sampleIds);
}

export async function getBudget(year: number): Promise<AnnualBudget> {
  const db = getDb();
  const record = await db.budget.get(year);
  return record ?? createDefaultBudget(year);
}

export async function upsertBudget(budget: AnnualBudget): Promise<void> {
  const db = getDb();
  await db.budget.put(budget);
}

export async function listBudgets(): Promise<AnnualBudget[]> {
  const db = getDb();
  return db.budget.orderBy("year").toArray();
}

export async function clearBudgetSampleEntries(): Promise<void> {
  const db = getDb();
  const sampleYears = (await db.budget.toArray())
    .filter((entry) => entry.seedSource === "sample")
    .map((entry) => entry.year);

  if (sampleYears.length === 0) {
    return;
  }

  await db.budget.bulkDelete(sampleYears);
}

export async function getBreakEvenModel(): Promise<BreakEvenModel> {
  const db = getDb();
  return getSingleton(db.breakeven, DEFAULT_BREAKEVEN);
}

export async function saveBreakEvenModel(model: BreakEvenModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.breakeven, model);
}

export async function clearBreakEvenSampleModel(): Promise<void> {
  const model = await getBreakEvenModel();
  if (model.seedSource !== "sample") {
    return;
  }
  await saveBreakEvenModel(DEFAULT_BREAKEVEN);
}

export async function getUnitEconomicsModel(): Promise<UnitEconomicsModel> {
  const db = getDb();
  return getSingleton(db.unitEconomics, DEFAULT_UNIT_ECONOMICS);
}

export async function saveUnitEconomicsModel(model: UnitEconomicsModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.unitEconomics, model);
}

export async function clearUnitEconomicsSampleModel(): Promise<void> {
  const model = await getUnitEconomicsModel();
  if (model.seedSource !== "sample") return;
  await saveUnitEconomicsModel(DEFAULT_UNIT_ECONOMICS);
}

export async function getFinancingOptionsModel(): Promise<FinancingOptionsModel> {
  const db = getDb();
  return getSingleton(db.financingOptions, DEFAULT_FINANCING_OPTIONS);
}

export async function saveFinancingOptionsModel(model: FinancingOptionsModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.financingOptions, model);
}

export async function clearFinancingOptionsSampleModel(): Promise<void> {
  const model = await getFinancingOptionsModel();
  if (model.seedSource !== "sample") return;
  await saveFinancingOptionsModel(DEFAULT_FINANCING_OPTIONS);
}

export async function getDebtManagerModel(): Promise<DebtManagerModel> {
  const db = getDb();
  return getSingleton(db.debtManager, DEFAULT_DEBT_MANAGER);
}

export async function saveDebtManagerModel(model: DebtManagerModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.debtManager, model);
}

export async function clearDebtManagerSampleModel(): Promise<void> {
  const model = await getDebtManagerModel();
  if (model.seedSource !== "sample") return;
  await saveDebtManagerModel(DEFAULT_DEBT_MANAGER);
}

export async function getProfitabilityModel(): Promise<ProfitabilityModel> {
  const db = getDb();
  return getSingleton(db.profitabilityAnalyzer, DEFAULT_PROFITABILITY);
}

export async function saveProfitabilityModel(model: ProfitabilityModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.profitabilityAnalyzer, model);
}

export async function clearProfitabilitySampleModel(): Promise<void> {
  const model = await getProfitabilityModel();
  if (model.seedSource !== "sample") return;
  await saveProfitabilityModel(DEFAULT_PROFITABILITY);
}

export async function getFinancialStrategyModel(): Promise<FinancialStrategyModel> {
  const db = getDb();
  return getSingleton(db.financialStrategyPlanner, DEFAULT_FINANCIAL_STRATEGY);
}

export async function saveFinancialStrategyModel(model: FinancialStrategyModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.financialStrategyPlanner, model);
}

export async function clearFinancialStrategySampleModel(): Promise<void> {
  const model = await getFinancialStrategyModel();
  if (model.seedSource !== "sample") return;
  await saveFinancialStrategyModel(DEFAULT_FINANCIAL_STRATEGY);
}

export async function getContingencyModel(): Promise<ContingencyModel> {
  const db = getDb();
  return getSingleton(db.contingencyPlanner, DEFAULT_CONTINGENCY);
}

export async function saveContingencyModel(model: ContingencyModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.contingencyPlanner, model);
}

export async function clearContingencySampleModel(): Promise<void> {
  const model = await getContingencyModel();
  if (model.seedSource !== "sample") return;
  await saveContingencyModel(DEFAULT_CONTINGENCY);
}

export async function getFinancialEducationModel(): Promise<FinancialEducationModel> {
  const db = getDb();
  return getSingleton(db.financialEducationKit, DEFAULT_FINANCIAL_EDUCATION);
}

export async function saveFinancialEducationModel(model: FinancialEducationModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.financialEducationKit, model);
}

export async function clearFinancialEducationSampleModel(): Promise<void> {
  const model = await getFinancialEducationModel();
  if (model.seedSource !== "sample") return;
  await saveFinancialEducationModel(DEFAULT_FINANCIAL_EDUCATION);
}

export async function getInvestmentEvaluatorModel(): Promise<InvestmentEvaluatorModel> {
  const db = getDb();
  return getSingleton(db.investmentEvaluator, DEFAULT_INVESTMENT_EVALUATOR);
}

export async function saveInvestmentEvaluatorModel(model: InvestmentEvaluatorModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.investmentEvaluator, model);
}

export async function clearInvestmentEvaluatorSampleModel(): Promise<void> {
  const model = await getInvestmentEvaluatorModel();
  if (model.seedSource !== "sample") return;
  await saveInvestmentEvaluatorModel(DEFAULT_INVESTMENT_EVALUATOR);
}

export async function getBusinessModelAnalyzerModel(): Promise<BusinessModelAnalyzerModel> {
  const db = getDb();
  return getSingleton(db.businessModelAnalyzer, DEFAULT_BUSINESS_MODEL_ANALYZER);
}

export async function saveBusinessModelAnalyzerModel(model: BusinessModelAnalyzerModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.businessModelAnalyzer, model);
}

export async function clearBusinessModelAnalyzerSampleModel(): Promise<void> {
  const model = await getBusinessModelAnalyzerModel();
  if (model.seedSource !== "sample") return;
  await saveBusinessModelAnalyzerModel(DEFAULT_BUSINESS_MODEL_ANALYZER);
}

export async function getInternationalFinanceModel(): Promise<InternationalFinanceModel> {
  const db = getDb();
  return getSingleton(db.internationalFinanceManager, DEFAULT_INTERNATIONAL_FINANCE);
}

export async function saveInternationalFinanceModel(model: InternationalFinanceModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.internationalFinanceManager, model);
}

export async function clearInternationalFinanceSampleModel(): Promise<void> {
  const model = await getInternationalFinanceModel();
  if (model.seedSource !== "sample") return;
  await saveInternationalFinanceModel(DEFAULT_INTERNATIONAL_FINANCE);
}

export async function getFintechEvaluatorModel(): Promise<FintechEvaluatorModel> {
  const db = getDb();
  return getSingleton(db.fintechEvaluator, DEFAULT_FINTECH_EVALUATOR);
}

export async function saveFintechEvaluatorModel(model: FintechEvaluatorModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.fintechEvaluator, model);
}

export async function clearFintechEvaluatorSampleModel(): Promise<void> {
  const model = await getFintechEvaluatorModel();
  if (model.seedSource !== "sample") return;
  await saveFintechEvaluatorModel(DEFAULT_FINTECH_EVALUATOR);
}

export async function getValuationModel(): Promise<ValuationModel> {
  const db = getDb();
  return getSingleton(db.valuationCalculator, DEFAULT_VALUATION);
}

export async function saveValuationModel(model: ValuationModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.valuationCalculator, model);
}

export async function clearValuationSampleModel(): Promise<void> {
  const model = await getValuationModel();
  if (model.seedSource !== "sample") return;
  await saveValuationModel(DEFAULT_VALUATION);
}

export async function getResilienceModel(): Promise<ResilienceModel> {
  const db = getDb();
  return getSingleton(db.resilienceEvaluator, DEFAULT_RESILIENCE);
}

export async function saveResilienceModel(model: ResilienceModel): Promise<void> {
  const db = getDb();
  await saveSingleton(db.resilienceEvaluator, model);
}

export async function clearResilienceSampleModel(): Promise<void> {
  const model = await getResilienceModel();
  if (model.seedSource !== "sample") return;
  await saveResilienceModel(DEFAULT_RESILIENCE);
}

export async function clearSampleDataForTool(toolId: ToolId): Promise<void> {
  if (toolId === "cashflow") {
    await clearCashFlowSampleEntries();
    return;
  }

  if (toolId === "costs") {
    await clearCostSampleEntries();
    return;
  }

  if (toolId === "budget") {
    await clearBudgetSampleEntries();
    return;
  }

  if (toolId === "breakeven") {
    await clearBreakEvenSampleModel();
    return;
  }

  if (toolId === "kpis") {
    await Promise.all([
      clearCashFlowSampleEntries(),
      clearCostSampleEntries(),
      clearBudgetSampleEntries(),
    ]);
    return;
  }

  if (toolId === "unit-economics") return clearUnitEconomicsSampleModel();
  if (toolId === "financing-options") return clearFinancingOptionsSampleModel();
  if (toolId === "debt-manager") return clearDebtManagerSampleModel();
  if (toolId === "profitability-analyzer") return clearProfitabilitySampleModel();
  if (toolId === "financial-strategy-planner") return clearFinancialStrategySampleModel();
  if (toolId === "contingency-planner") return clearContingencySampleModel();
  if (toolId === "financial-education-kit") return clearFinancialEducationSampleModel();
  if (toolId === "investment-evaluator") return clearInvestmentEvaluatorSampleModel();
  if (toolId === "business-model-analyzer") return clearBusinessModelAnalyzerSampleModel();
  if (toolId === "international-finance-manager") return clearInternationalFinanceSampleModel();
  if (toolId === "fintech-evaluator") return clearFintechEvaluatorSampleModel();
  if (toolId === "valuation-calculator") return clearValuationSampleModel();
  await clearResilienceSampleModel();
}

export async function exportBackupSnapshot(): Promise<BackupSnapshot> {
  const [
    settings,
    progress,
    cashflow,
    costs,
    budget,
    breakeven,
    unitEconomics,
    financingOptions,
    debtManager,
    profitabilityAnalyzer,
    financialStrategyPlanner,
    contingencyPlanner,
    financialEducationKit,
    investmentEvaluator,
    businessModelAnalyzer,
    internationalFinanceManager,
    fintechEvaluator,
    valuationCalculator,
    resilienceEvaluator,
  ] = await Promise.all([
    getSettings(),
    getProgress(),
    listCashFlowEntries(),
    listCostEntries(),
    listBudgets(),
    getBreakEvenModel(),
    getUnitEconomicsModel(),
    getFinancingOptionsModel(),
    getDebtManagerModel(),
    getProfitabilityModel(),
    getFinancialStrategyModel(),
    getContingencyModel(),
    getFinancialEducationModel(),
    getInvestmentEvaluatorModel(),
    getBusinessModelAnalyzerModel(),
    getInternationalFinanceModel(),
    getFintechEvaluatorModel(),
    getValuationModel(),
    getResilienceModel(),
  ]);

  return {
    schemaVersion: settings.schemaVersion,
    settings,
    progress,
    cashflow,
    costs,
    budget,
    breakeven,
    unitEconomics,
    financingOptions,
    debtManager,
    profitabilityAnalyzer,
    financialStrategyPlanner,
    contingencyPlanner,
    financialEducationKit,
    investmentEvaluator,
    businessModelAnalyzer,
    internationalFinanceManager,
    fintechEvaluator,
    valuationCalculator,
    resilienceEvaluator,
  };
}

export async function importBackupSnapshot(payload: unknown): Promise<void> {
  const snapshot = parseAndMigrateBackup(payload);
  const db = getDb();

  await db.transaction(
    "rw",
    [
      db.settings,
      db.progress,
      db.cashflow,
      db.costs,
      db.budget,
      db.breakeven,
      db.unitEconomics,
      db.financingOptions,
      db.debtManager,
      db.profitabilityAnalyzer,
      db.financialStrategyPlanner,
      db.contingencyPlanner,
      db.financialEducationKit,
      db.investmentEvaluator,
      db.businessModelAnalyzer,
      db.internationalFinanceManager,
      db.fintechEvaluator,
      db.valuationCalculator,
      db.resilienceEvaluator,
    ],
    async () => {
      await Promise.all([
        db.settings.clear(),
        db.progress.clear(),
        db.cashflow.clear(),
        db.costs.clear(),
        db.budget.clear(),
        db.breakeven.clear(),
        db.unitEconomics.clear(),
        db.financingOptions.clear(),
        db.debtManager.clear(),
        db.profitabilityAnalyzer.clear(),
        db.financialStrategyPlanner.clear(),
        db.contingencyPlanner.clear(),
        db.financialEducationKit.clear(),
        db.investmentEvaluator.clear(),
        db.businessModelAnalyzer.clear(),
        db.internationalFinanceManager.clear(),
        db.fintechEvaluator.clear(),
        db.valuationCalculator.clear(),
        db.resilienceEvaluator.clear(),
      ]);

      await db.settings.put({ id: "singleton", value: snapshot.settings });
      await db.progress.put({ id: "singleton", value: snapshot.progress });
      if (snapshot.cashflow.length > 0) await db.cashflow.bulkPut(snapshot.cashflow);
      if (snapshot.costs.length > 0) await db.costs.bulkPut(snapshot.costs);
      if (snapshot.budget.length > 0) await db.budget.bulkPut(snapshot.budget);
      if (snapshot.breakeven) await db.breakeven.put({ id: "singleton", value: snapshot.breakeven });

      await db.unitEconomics.put({ id: "singleton", value: snapshot.unitEconomics });
      await db.financingOptions.put({ id: "singleton", value: snapshot.financingOptions });
      await db.debtManager.put({ id: "singleton", value: snapshot.debtManager });
      await db.profitabilityAnalyzer.put({ id: "singleton", value: snapshot.profitabilityAnalyzer });
      await db.financialStrategyPlanner.put({
        id: "singleton",
        value: snapshot.financialStrategyPlanner,
      });
      await db.contingencyPlanner.put({ id: "singleton", value: snapshot.contingencyPlanner });
      await db.financialEducationKit.put({ id: "singleton", value: snapshot.financialEducationKit });
      await db.investmentEvaluator.put({ id: "singleton", value: snapshot.investmentEvaluator });
      await db.businessModelAnalyzer.put({ id: "singleton", value: snapshot.businessModelAnalyzer });
      await db.internationalFinanceManager.put({
        id: "singleton",
        value: snapshot.internationalFinanceManager,
      });
      await db.fintechEvaluator.put({ id: "singleton", value: snapshot.fintechEvaluator });
      await db.valuationCalculator.put({ id: "singleton", value: snapshot.valuationCalculator });
      await db.resilienceEvaluator.put({ id: "singleton", value: snapshot.resilienceEvaluator });
    },
  );
}

export async function resetAllData(): Promise<void> {
  const db = getDb();
  await db.transaction(
    "rw",
    [
      db.settings,
      db.progress,
      db.cashflow,
      db.costs,
      db.budget,
      db.breakeven,
      db.unitEconomics,
      db.financingOptions,
      db.debtManager,
      db.profitabilityAnalyzer,
      db.financialStrategyPlanner,
      db.contingencyPlanner,
      db.financialEducationKit,
      db.investmentEvaluator,
      db.businessModelAnalyzer,
      db.internationalFinanceManager,
      db.fintechEvaluator,
      db.valuationCalculator,
      db.resilienceEvaluator,
    ],
    async () => {
      await Promise.all([
        db.cashflow.clear(),
        db.costs.clear(),
        db.budget.clear(),
        db.breakeven.clear(),
        db.unitEconomics.clear(),
        db.financingOptions.clear(),
        db.debtManager.clear(),
        db.profitabilityAnalyzer.clear(),
        db.financialStrategyPlanner.clear(),
        db.contingencyPlanner.clear(),
        db.financialEducationKit.clear(),
        db.investmentEvaluator.clear(),
        db.businessModelAnalyzer.clear(),
        db.internationalFinanceManager.clear(),
        db.fintechEvaluator.clear(),
        db.valuationCalculator.clear(),
        db.resilienceEvaluator.clear(),
      ]);
      await db.settings.put({ id: "singleton", value: DEFAULT_SETTINGS });
      await db.progress.put({ id: "singleton", value: DEFAULT_PROGRESS });
    },
  );
}
