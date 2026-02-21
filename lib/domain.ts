export type BusinessModel =
  | "ecommerce"
  | "services"
  | "saas"
  | "manufacturing"
  | "other";

export type CurrencyDisplayMode = "base" | "usd";
export type SeedSource = "sample" | "user";
export type LearningLayerId = "base" | "intermediate" | "advanced";

export type CoreToolId = "cashflow" | "costs" | "budget" | "breakeven" | "kpis";

export type AdvancedToolId =
  | "unit-economics"
  | "financing-options"
  | "debt-manager"
  | "profitability-analyzer"
  | "financial-strategy-planner"
  | "contingency-planner"
  | "financial-education-kit"
  | "investment-evaluator"
  | "business-model-analyzer"
  | "international-finance-manager"
  | "fintech-evaluator"
  | "valuation-calculator"
  | "resilience-evaluator";

export type ToolId = CoreToolId | AdvancedToolId;
export type ToolSampleState = "active" | "dismissed" | "consumed";
export type ToolStepId = string;

export const TOOL_IDS: ToolId[] = [
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
];

export interface Currency {
  code: string;
  symbol: string;
}

export interface AppSettings {
  schemaVersion: number;
  baseCurrency: Currency;
  currencyDisplayMode: CurrencyDisplayMode;
  fxRateToUsd: number;
  businessModel: BusinessModel;
  onboardingCompletedAt?: string;
  // Legacy field kept optional for migration compatibility.
  showUsd?: boolean;
}

export interface Bookmark {
  slug: string;
  updatedAt: string;
}

export interface ProgressState {
  completedChapterSlugs: string[];
  bookmarks: Bookmark[];
  dismissedTipIds: string[];
  dismissedGuideBlocks: string[];
  toolSampleState: Partial<Record<ToolId, ToolSampleState>>;
  toolStepProgress: Partial<
    Record<
      ToolId,
      {
        currentStepId: ToolStepId;
        completedStepIds: ToolStepId[];
      }
    >
  >;
  activeLearningLayer: LearningLayerId;
}

export interface CashFlowLine {
  name: string;
  projected: number;
  actual?: number;
}

export interface CashFlowEntry {
  month: string;
  startingBalance: number;
  inflows: CashFlowLine[];
  outflows: CashFlowLine[];
  seedSource?: SeedSource;
}

export type CostType = "fixed_cost" | "variable_cost" | "expense";

export interface CostExpenseEntry {
  id?: number;
  date: string;
  description: string;
  amount: number;
  type: CostType;
  category: string;
  notes?: string;
  seedSource?: SeedSource;
}

export interface AnnualBudgetLine {
  name: string;
  plannedByMonth: number[];
  actualByMonth: number[];
}

export interface AnnualBudget {
  year: number;
  incomeLines: AnnualBudgetLine[];
  expenseLines: AnnualBudgetLine[];
  seedSource?: SeedSource;
}

export interface BreakEvenSingleProduct {
  price: number;
  variableCost: number;
}

export interface BreakEvenMultiProductItem {
  name: string;
  price: number;
  variableCost: number;
  salesMixPct: number;
}

export interface BreakEvenScenario {
  name: string;
  fixedCosts?: number;
  price?: number;
  variableCost?: number;
}

export interface BreakEvenModel {
  fixedCosts: number;
  singleProduct?: BreakEvenSingleProduct;
  multiProduct?: {
    products: BreakEvenMultiProductItem[];
  };
  scenarios: BreakEvenScenario[];
  seedSource?: SeedSource;
}

export interface UnitEconomicsModel {
  price: number;
  variableCost: number;
  marketingSales: number;
  newCustomers: number;
  avgTicket: number;
  purchaseFrequency: number;
  retentionPeriod: number;
  discountRatePct: number;
  seedSource?: SeedSource;
}

export interface FinancingOptionsModel {
  optionType: "debt" | "equity" | "mixed";
  principal: number;
  annualRatePct: number;
  termMonths: number;
  fees: number;
  otherCosts: number;
  equityOfferedPct: number;
  controlScore: number;
  riskScore: number;
  flexibilityScore: number;
  seedSource?: SeedSource;
}

export interface DebtManagerModel {
  totalDebt: number;
  totalAssets: number;
  ebit: number;
  interestExpense: number;
  loanAmount: number;
  fees: number;
  otherCosts: number;
  primaryBalance: number;
  primaryRatePct: number;
  secondaryBalance: number;
  secondaryRatePct: number;
  oldTotalCost: number;
  newTotalCost: number;
  seedSource?: SeedSource;
}

export interface ProfitabilityModel {
  sales: number;
  cogs: number;
  opex: number;
  netIncome: number;
  investment: number;
  segmentRevenue: number;
  segmentCosts: number;
  seedSource?: SeedSource;
}

export interface FinancialStrategyModel {
  revenue0: number;
  growthRatePct: number;
  targetNetMarginPct: number;
  reinvestPct: number;
  dividendPct: number;
  debtPct: number;
  equityPct: number;
  maxDebtPct: number;
  horizonYears: number;
  seedSource?: SeedSource;
}

export interface ContingencyModel {
  riskName: string;
  probabilityPct: number;
  impactPct: number;
  monthlyFixedOutflow: number;
  reserveMonths: number;
  reserveBalance: number;
  trigger: string;
  owner: string;
  responseTimeDays: number;
  seedSource?: SeedSource;
}

export interface FinancialEducationModel {
  role: string;
  testScore1: number;
  testScore2: number;
  testScore3: number;
  completedModules: number;
  totalModules: number;
  trainingCost: number;
  profitImprovement: number;
  seedSource?: SeedSource;
}

export interface InvestmentEvaluatorModel {
  investmentId: string;
  initialCost: number;
  annualBenefit: number;
  discountRatePct: number;
  years: number;
  scenario: string;
  seedSource?: SeedSource;
}

export interface BusinessModelAnalyzerModel {
  model: BusinessModel;
  sales: number;
  cogs: number;
  marketingSales: number;
  newCustomers: number;
  ltv: number;
  churnPct: number;
  capacityUsedPct: number;
  benchmark: number;
  target: number;
  seedSource?: SeedSource;
}

export interface InternationalFinanceModel {
  currencyCode: string;
  foreignAmount: number;
  plannedRate: number;
  actualRate: number;
  hedgedResult: number;
  unhedgedResult: number;
  basePrice: number;
  fxRiskBufferPct: number;
  seedSource?: SeedSource;
}

export interface FintechEvaluatorModel {
  tool: string;
  needsCoverageScore: number;
  securityScore: number;
  integrationScore: number;
  easeScore: number;
  annualCost: number;
  annualBenefit: number;
  dataRiskScore: number;
  operationalRiskScore: number;
  vendorRiskScore: number;
  seedSource?: SeedSource;
}

export interface ValuationModel {
  annualSales: number;
  salesMultiple: number;
  annualEbitda: number;
  ebitdaMultiple: number;
  annualNetIncome: number;
  netIncomeMultiple: number;
  totalAssets: number;
  totalLiabilities: number;
  discountRatePct: number;
  freeCashFlow: number;
  terminalValue: number;
  years: number;
  seedSource?: SeedSource;
}

export interface ResilienceModel {
  availableCash: number;
  monthlyBurn: number;
  monthlyOperatingExpense: number;
  targetMonths: number;
  liquidityScore: number;
  debtScore: number;
  diversificationScore: number;
  contingencyReadinessScore: number;
  salesDropPct: number;
  seedSource?: SeedSource;
}

export interface BackupSnapshot {
  schemaVersion: number;
  settings: AppSettings;
  progress: ProgressState;
  cashflow: CashFlowEntry[];
  costs: CostExpenseEntry[];
  budget: AnnualBudget[];
  breakeven: BreakEvenModel | null;
  unitEconomics: UnitEconomicsModel;
  financingOptions: FinancingOptionsModel;
  debtManager: DebtManagerModel;
  profitabilityAnalyzer: ProfitabilityModel;
  financialStrategyPlanner: FinancialStrategyModel;
  contingencyPlanner: ContingencyModel;
  financialEducationKit: FinancialEducationModel;
  investmentEvaluator: InvestmentEvaluatorModel;
  businessModelAnalyzer: BusinessModelAnalyzerModel;
  internationalFinanceManager: InternationalFinanceModel;
  fintechEvaluator: FintechEvaluatorModel;
  valuationCalculator: ValuationModel;
  resilienceEvaluator: ResilienceModel;
}
