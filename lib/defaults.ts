import { CURRENT_SCHEMA_VERSION } from "@/lib/schema-version";
import type {
  AnnualBudget,
  AppSettings,
  BreakEvenModel,
  BusinessModel,
  BusinessModelAnalyzerModel,
  ContingencyModel,
  DebtManagerModel,
  FinancialEducationModel,
  FinancialStrategyModel,
  FinancingOptionsModel,
  FintechEvaluatorModel,
  InternationalFinanceModel,
  InvestmentEvaluatorModel,
  ProgressState,
  ProfitabilityModel,
  ResilienceModel,
  UnitEconomicsModel,
  ValuationModel,
} from "@/lib/domain";

export const DEFAULT_SETTINGS: AppSettings = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  baseCurrency: { code: "MXN", symbol: "$" },
  currencyDisplayMode: "base",
  fxRateToUsd: 20,
  businessModel: "other",
};

export const DEFAULT_PROGRESS: ProgressState = {
  completedChapterSlugs: [],
  bookmarks: [],
  dismissedTipIds: [],
  dismissedGuideBlocks: [],
  toolSampleState: {},
  toolStepProgress: {},
  activeLearningLayer: "base",
};

export function createDefaultBudget(year: number): AnnualBudget {
  const zeros = Array.from({ length: 12 }, () => 0);
  return {
    year,
    incomeLines: [
      { name: "Ventas", plannedByMonth: [...zeros], actualByMonth: [...zeros] },
      { name: "Servicios", plannedByMonth: [...zeros], actualByMonth: [...zeros] },
    ],
    expenseLines: [
      {
        name: "Costos directos",
        plannedByMonth: [...zeros],
        actualByMonth: [...zeros],
      },
      { name: "Gastos operativos", plannedByMonth: [...zeros], actualByMonth: [...zeros] },
      { name: "Impuestos/Intereses", plannedByMonth: [...zeros], actualByMonth: [...zeros] },
    ],
  };
}

export const DEFAULT_BREAKEVEN: BreakEvenModel = {
  fixedCosts: 0,
  singleProduct: {
    price: 0,
    variableCost: 0,
  },
  multiProduct: {
    products: [
      {
        name: "Producto A",
        price: 0,
        variableCost: 0,
        salesMixPct: 100,
      },
    ],
  },
  scenarios: [],
};

export const DEFAULT_UNIT_ECONOMICS: UnitEconomicsModel = {
  price: 200,
  variableCost: 70,
  marketingSales: 5000,
  newCustomers: 50,
  avgTicket: 200,
  purchaseFrequency: 2,
  retentionPeriod: 12,
  discountRatePct: 10,
};

export const DEFAULT_FINANCING_OPTIONS: FinancingOptionsModel = {
  optionType: "debt",
  principal: 500000,
  annualRatePct: 12,
  termMonths: 60,
  fees: 10000,
  otherCosts: 5000,
  equityOfferedPct: 10,
  controlScore: 75,
  riskScore: 50,
  flexibilityScore: 65,
};

export const DEFAULT_DEBT_MANAGER: DebtManagerModel = {
  totalDebt: 400000,
  totalAssets: 1000000,
  ebit: 50000,
  interestExpense: 10000,
  loanAmount: 100000,
  fees: 2000,
  otherCosts: 1000,
  primaryBalance: 150000,
  primaryRatePct: 20,
  secondaryBalance: 200000,
  secondaryRatePct: 15,
  oldTotalCost: 170000,
  newTotalCost: 145000,
};

export const DEFAULT_PROFITABILITY: ProfitabilityModel = {
  sales: 100000,
  cogs: 60000,
  opex: 25000,
  netIncome: 10000,
  investment: 200000,
  segmentRevenue: 45000,
  segmentCosts: 28000,
};

export const DEFAULT_FINANCIAL_STRATEGY: FinancialStrategyModel = {
  revenue0: 2000000,
  growthRatePct: 20,
  targetNetMarginPct: 15,
  reinvestPct: 70,
  dividendPct: 30,
  debtPct: 40,
  equityPct: 60,
  maxDebtPct: 40,
  horizonYears: 5,
};

export const DEFAULT_CONTINGENCY: ContingencyModel = {
  riskName: "Caida de ventas",
  probabilityPct: 30,
  impactPct: 50,
  monthlyFixedOutflow: 100000,
  reserveMonths: 6,
  reserveBalance: 350000,
  trigger: "Caida de ventas >20% por 2 meses",
  owner: "Direccion financiera",
  responseTimeDays: 7,
};

export const DEFAULT_FINANCIAL_EDUCATION: FinancialEducationModel = {
  role: "Comercial",
  testScore1: 65,
  testScore2: 70,
  testScore3: 80,
  completedModules: 6,
  totalModules: 10,
  trainingCost: 20000,
  profitImprovement: 35000,
};

export const DEFAULT_INVESTMENT_EVALUATOR: InvestmentEvaluatorModel = {
  investmentId: "INV-001",
  initialCost: 100000,
  annualBenefit: 40000,
  discountRatePct: 10,
  years: 5,
  scenario: "base",
};

export const DEFAULT_BUSINESS_MODEL_ANALYZER: BusinessModelAnalyzerModel = {
  model: "ecommerce",
  sales: 120000,
  cogs: 70000,
  marketingSales: 10000,
  newCustomers: 80,
  ltv: 4800,
  churnPct: 8,
  capacityUsedPct: 72,
  benchmark: 3,
  target: 4,
};

export const DEFAULT_INTERNATIONAL_FINANCE: InternationalFinanceModel = {
  currencyCode: "USD",
  foreignAmount: 10000,
  plannedRate: 20,
  actualRate: 18,
  hedgedResult: 200000,
  unhedgedResult: 180000,
  basePrice: 1000,
  fxRiskBufferPct: 8,
};

export const DEFAULT_FINTECH_EVALUATOR: FintechEvaluatorModel = {
  tool: "ERP Financiero",
  needsCoverageScore: 80,
  securityScore: 75,
  integrationScore: 70,
  easeScore: 65,
  annualCost: 50000,
  annualBenefit: 90000,
  dataRiskScore: 30,
  operationalRiskScore: 35,
  vendorRiskScore: 25,
};

export const DEFAULT_VALUATION: ValuationModel = {
  annualSales: 2000000,
  salesMultiple: 1.2,
  annualEbitda: 300000,
  ebitdaMultiple: 5,
  annualNetIncome: 180000,
  netIncomeMultiple: 6,
  totalAssets: 1500000,
  totalLiabilities: 500000,
  discountRatePct: 11,
  freeCashFlow: 180000,
  terminalValue: 600000,
  years: 5,
};

export const DEFAULT_RESILIENCE: ResilienceModel = {
  availableCash: 600000,
  monthlyBurn: 100000,
  monthlyOperatingExpense: 100000,
  targetMonths: 6,
  liquidityScore: 70,
  debtScore: 65,
  diversificationScore: 55,
  contingencyReadinessScore: 60,
  salesDropPct: 30,
};

export function createModelDefaultsByBusinessModel(model: BusinessModel): BusinessModelAnalyzerModel {
  if (model === "services") {
    return {
      ...DEFAULT_BUSINESS_MODEL_ANALYZER,
      model,
      churnPct: 5,
      capacityUsedPct: 78,
      benchmark: 65,
      target: 75,
    };
  }

  if (model === "saas") {
    return {
      ...DEFAULT_BUSINESS_MODEL_ANALYZER,
      model,
      benchmark: 3,
      target: 4,
      churnPct: 6,
    };
  }

  if (model === "manufacturing") {
    return {
      ...DEFAULT_BUSINESS_MODEL_ANALYZER,
      model,
      benchmark: 40,
      target: 50,
      capacityUsedPct: 80,
    };
  }

  return {
    ...DEFAULT_BUSINESS_MODEL_ANALYZER,
    model,
  };
}
