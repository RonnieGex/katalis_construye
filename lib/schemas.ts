import { z } from "zod";

export const currencySchema = z.object({
  code: z.string().min(1),
  symbol: z.string().min(1),
});

export const businessModelSchema = z.enum([
  "ecommerce",
  "services",
  "saas",
  "manufacturing",
  "other",
]);

export const currencyDisplayModeSchema = z.enum(["base", "usd"]);
export const seedSourceSchema = z.enum(["sample", "user"]);
export const learningLayerIdSchema = z.enum(["base", "intermediate", "advanced"]);
export const toolIdSchema = z.enum([
  "cashflow",
  "costs",
  "budget",
  "breakeven",
  "kpis",
  "unit-economics",
  "financing-options",
  "debt-manager",
  "profitability-analyzer",
  "financial-strategy-planner",
  "contingency-planner",
  "financial-education-kit",
  "investment-evaluator",
  "business-model-analyzer",
  "international-finance-manager",
  "fintech-evaluator",
  "valuation-calculator",
  "resilience-evaluator",
]);
export const toolSampleStateSchema = z.enum(["active", "dismissed", "consumed"]);

const toolSampleStateRecordSchema = z.record(z.string(), toolSampleStateSchema);
const toolStepProgressRecordSchema = z.record(
  z.string(),
  z.object({
    currentStepId: z.string().min(1),
    completedStepIds: z.array(z.string().min(1)).default([]),
  }),
);

export const appSettingsSchema = z.object({
  schemaVersion: z.number().int().nonnegative(),
  baseCurrency: currencySchema,
  currencyDisplayMode: currencyDisplayModeSchema,
  fxRateToUsd: z.number().positive(),
  businessModel: businessModelSchema,
  onboardingCompletedAt: z.string().optional(),
});

export const progressStateSchema = z.object({
  completedChapterSlugs: z.array(z.string()),
  bookmarks: z.array(
    z.object({
      slug: z.string(),
      updatedAt: z.string(),
    }),
  ),
  dismissedTipIds: z.array(z.string()).default([]),
  dismissedGuideBlocks: z.array(z.string()).default([]),
  toolSampleState: toolSampleStateRecordSchema.default({}),
  toolStepProgress: toolStepProgressRecordSchema.default({}),
  activeLearningLayer: learningLayerIdSchema.default("base"),
});

export const cashFlowLineSchema = z.object({
  name: z.string().min(1),
  projected: z.number(),
  actual: z.number().optional(),
});

export const cashFlowEntrySchema = z.object({
  month: z.string(),
  startingBalance: z.number(),
  inflows: z.array(cashFlowLineSchema),
  outflows: z.array(cashFlowLineSchema),
  seedSource: seedSourceSchema.optional(),
});

export const costExpenseEntrySchema = z.object({
  id: z.number().optional(),
  date: z.string(),
  description: z.string().min(1),
  amount: z.number(),
  type: z.enum(["fixed_cost", "variable_cost", "expense"]),
  category: z.string().min(1),
  notes: z.string().optional(),
  seedSource: seedSourceSchema.optional(),
});

export const annualBudgetLineSchema = z.object({
  name: z.string().min(1),
  plannedByMonth: z.array(z.number()),
  actualByMonth: z.array(z.number()),
});

export const annualBudgetSchema = z.object({
  year: z.number().int(),
  incomeLines: z.array(annualBudgetLineSchema),
  expenseLines: z.array(annualBudgetLineSchema),
  seedSource: seedSourceSchema.optional(),
});

export const breakEvenScenarioSchema = z.object({
  name: z.string().min(1),
  fixedCosts: z.number().optional(),
  price: z.number().optional(),
  variableCost: z.number().optional(),
});

export const breakEvenModelSchema = z.object({
  fixedCosts: z.number(),
  singleProduct: z
    .object({
      price: z.number(),
      variableCost: z.number(),
    })
    .optional(),
  multiProduct: z
    .object({
      products: z.array(
        z.object({
          name: z.string(),
          price: z.number(),
          variableCost: z.number(),
          salesMixPct: z.number(),
        }),
      ),
    })
    .optional(),
  scenarios: z.array(breakEvenScenarioSchema),
  seedSource: seedSourceSchema.optional(),
});

export const unitEconomicsSchema = z.object({
  price: z.number(),
  variableCost: z.number(),
  marketingSales: z.number(),
  newCustomers: z.number(),
  avgTicket: z.number(),
  purchaseFrequency: z.number(),
  retentionPeriod: z.number(),
  discountRatePct: z.number(),
  seedSource: seedSourceSchema.optional(),
});

export const financingOptionsSchema = z.object({
  optionType: z.enum(["debt", "equity", "mixed"]),
  principal: z.number(),
  annualRatePct: z.number(),
  termMonths: z.number(),
  fees: z.number(),
  otherCosts: z.number(),
  equityOfferedPct: z.number(),
  controlScore: z.number(),
  riskScore: z.number(),
  flexibilityScore: z.number(),
  seedSource: seedSourceSchema.optional(),
});

export const debtManagerSchema = z.object({
  totalDebt: z.number(),
  totalAssets: z.number(),
  ebit: z.number(),
  interestExpense: z.number(),
  loanAmount: z.number(),
  fees: z.number(),
  otherCosts: z.number(),
  primaryBalance: z.number(),
  primaryRatePct: z.number(),
  secondaryBalance: z.number(),
  secondaryRatePct: z.number(),
  oldTotalCost: z.number(),
  newTotalCost: z.number(),
  seedSource: seedSourceSchema.optional(),
});

export const profitabilitySchema = z.object({
  sales: z.number(),
  cogs: z.number(),
  opex: z.number(),
  netIncome: z.number(),
  investment: z.number(),
  segmentRevenue: z.number(),
  segmentCosts: z.number(),
  seedSource: seedSourceSchema.optional(),
});

export const financialStrategySchema = z.object({
  revenue0: z.number(),
  growthRatePct: z.number(),
  targetNetMarginPct: z.number(),
  reinvestPct: z.number(),
  dividendPct: z.number(),
  debtPct: z.number(),
  equityPct: z.number(),
  maxDebtPct: z.number(),
  horizonYears: z.number(),
  seedSource: seedSourceSchema.optional(),
});

export const contingencySchema = z.object({
  riskName: z.string(),
  probabilityPct: z.number(),
  impactPct: z.number(),
  monthlyFixedOutflow: z.number(),
  reserveMonths: z.number(),
  reserveBalance: z.number(),
  trigger: z.string(),
  owner: z.string(),
  responseTimeDays: z.number(),
  seedSource: seedSourceSchema.optional(),
});

export const financialEducationSchema = z.object({
  role: z.string(),
  testScore1: z.number(),
  testScore2: z.number(),
  testScore3: z.number(),
  completedModules: z.number(),
  totalModules: z.number(),
  trainingCost: z.number(),
  profitImprovement: z.number(),
  seedSource: seedSourceSchema.optional(),
});

export const investmentEvaluatorSchema = z.object({
  investmentId: z.string(),
  initialCost: z.number(),
  annualBenefit: z.number(),
  discountRatePct: z.number(),
  years: z.number(),
  scenario: z.string(),
  seedSource: seedSourceSchema.optional(),
});

export const businessModelAnalyzerSchema = z.object({
  model: businessModelSchema,
  sales: z.number(),
  cogs: z.number(),
  marketingSales: z.number(),
  newCustomers: z.number(),
  ltv: z.number(),
  churnPct: z.number(),
  capacityUsedPct: z.number(),
  benchmark: z.number(),
  target: z.number(),
  seedSource: seedSourceSchema.optional(),
});

export const internationalFinanceSchema = z.object({
  currencyCode: z.string(),
  foreignAmount: z.number(),
  plannedRate: z.number(),
  actualRate: z.number(),
  hedgedResult: z.number(),
  unhedgedResult: z.number(),
  basePrice: z.number(),
  fxRiskBufferPct: z.number(),
  seedSource: seedSourceSchema.optional(),
});

export const fintechEvaluatorSchema = z.object({
  tool: z.string(),
  needsCoverageScore: z.number(),
  securityScore: z.number(),
  integrationScore: z.number(),
  easeScore: z.number(),
  annualCost: z.number(),
  annualBenefit: z.number(),
  dataRiskScore: z.number(),
  operationalRiskScore: z.number(),
  vendorRiskScore: z.number(),
  seedSource: seedSourceSchema.optional(),
});

export const valuationSchema = z.object({
  annualSales: z.number(),
  salesMultiple: z.number(),
  annualEbitda: z.number(),
  ebitdaMultiple: z.number(),
  annualNetIncome: z.number(),
  netIncomeMultiple: z.number(),
  totalAssets: z.number(),
  totalLiabilities: z.number(),
  discountRatePct: z.number(),
  freeCashFlow: z.number(),
  terminalValue: z.number(),
  years: z.number(),
  seedSource: seedSourceSchema.optional(),
});

export const resilienceSchema = z.object({
  availableCash: z.number(),
  monthlyBurn: z.number(),
  monthlyOperatingExpense: z.number(),
  targetMonths: z.number(),
  liquidityScore: z.number(),
  debtScore: z.number(),
  diversificationScore: z.number(),
  contingencyReadinessScore: z.number(),
  salesDropPct: z.number(),
  seedSource: seedSourceSchema.optional(),
});

export const backupSnapshotSchema = z.object({
  schemaVersion: z.number().int().nonnegative(),
  settings: appSettingsSchema,
  progress: progressStateSchema,
  cashflow: z.array(cashFlowEntrySchema),
  costs: z.array(costExpenseEntrySchema),
  budget: z.array(annualBudgetSchema),
  breakeven: breakEvenModelSchema.nullable(),
  unitEconomics: unitEconomicsSchema,
  financingOptions: financingOptionsSchema,
  debtManager: debtManagerSchema,
  profitabilityAnalyzer: profitabilitySchema,
  financialStrategyPlanner: financialStrategySchema,
  contingencyPlanner: contingencySchema,
  financialEducationKit: financialEducationSchema,
  investmentEvaluator: investmentEvaluatorSchema,
  businessModelAnalyzer: businessModelAnalyzerSchema,
  internationalFinanceManager: internationalFinanceSchema,
  fintechEvaluator: fintechEvaluatorSchema,
  valuationCalculator: valuationSchema,
  resilienceEvaluator: resilienceSchema,
});

const legacyProgressSchema = z.object({
  completedChapterSlugs: z.array(z.string()),
  bookmarks: z.array(
    z.object({
      slug: z.string(),
      updatedAt: z.string(),
    }),
  ),
});

export const legacyBackupV0Schema = z.object({
  schemaVersion: z.literal(0),
  settings: z.object({
    schemaVersion: z.literal(0),
    baseCurrency: currencySchema,
    showUsd: z.boolean(),
    fxRateToUsd: z.number().positive(),
  }),
  progress: legacyProgressSchema,
  cashflow: z.array(cashFlowEntrySchema.omit({ seedSource: true })),
  costs: z.array(costExpenseEntrySchema.omit({ seedSource: true })),
  budget: z.array(annualBudgetSchema.omit({ seedSource: true })),
  breakeven: breakEvenModelSchema.omit({ seedSource: true }).nullable(),
});

export const legacyBackupV1Schema = z.object({
  schemaVersion: z.literal(1),
  settings: z.object({
    schemaVersion: z.literal(1),
    baseCurrency: currencySchema,
    showUsd: z.boolean(),
    fxRateToUsd: z.number().positive(),
    businessModel: businessModelSchema,
  }),
  progress: legacyProgressSchema,
  cashflow: z.array(cashFlowEntrySchema.omit({ seedSource: true })),
  costs: z.array(costExpenseEntrySchema.omit({ seedSource: true })),
  budget: z.array(annualBudgetSchema.omit({ seedSource: true })),
  breakeven: breakEvenModelSchema.omit({ seedSource: true }).nullable(),
});

export const legacyBackupV2Schema = z.object({
  schemaVersion: z.literal(2),
  settings: appSettingsSchema.extend({
    schemaVersion: z.literal(2),
  }),
  progress: progressStateSchema,
  cashflow: z.array(cashFlowEntrySchema),
  costs: z.array(costExpenseEntrySchema),
  budget: z.array(annualBudgetSchema),
  breakeven: breakEvenModelSchema.nullable(),
});

export const legacyBackupV3Schema = z.object({
  schemaVersion: z.literal(3),
  settings: appSettingsSchema.extend({
    schemaVersion: z.literal(3),
  }),
  progress: z.object({
    completedChapterSlugs: z.array(z.string()),
    bookmarks: z.array(
      z.object({
        slug: z.string(),
        updatedAt: z.string(),
      }),
    ),
    dismissedTipIds: z.array(z.string()).default([]),
    toolSampleState: toolSampleStateRecordSchema.default({}),
    activeLearningLayer: learningLayerIdSchema.default("base"),
  }),
  cashflow: z.array(cashFlowEntrySchema),
  costs: z.array(costExpenseEntrySchema),
  budget: z.array(annualBudgetSchema),
  breakeven: breakEvenModelSchema.nullable(),
  unitEconomics: unitEconomicsSchema,
  financingOptions: financingOptionsSchema,
  debtManager: debtManagerSchema,
  profitabilityAnalyzer: profitabilitySchema,
  financialStrategyPlanner: financialStrategySchema,
  contingencyPlanner: contingencySchema,
  financialEducationKit: financialEducationSchema,
  investmentEvaluator: investmentEvaluatorSchema,
  businessModelAnalyzer: businessModelAnalyzerSchema,
  internationalFinanceManager: internationalFinanceSchema,
  fintechEvaluator: fintechEvaluatorSchema,
  valuationCalculator: valuationSchema,
  resilienceEvaluator: resilienceSchema,
});
