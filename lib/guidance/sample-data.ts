import type {
  AnnualBudget,
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
  ProfitabilityModel,
  ResilienceModel,
  UnitEconomicsModel,
  ValuationModel,
} from "@/lib/domain";
import { currentYear } from "@/lib/months";

function isoMonthWithOffset(offset: number): string {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + offset);
  return date.toISOString().slice(0, 7);
}

function isoDateWithOffset(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function getCashFlowSampleEntries(): CashFlowEntry[] {
  return [
    {
      month: isoMonthWithOffset(-1),
      startingBalance: 18000,
      inflows: [
        { name: "Ventas mostrador", projected: 42000, actual: 40500 },
        { name: "Cobros a credito", projected: 8000, actual: 7600 },
      ],
      outflows: [
        { name: "Nomina", projected: 12000, actual: 12000 },
        { name: "Renta", projected: 7000, actual: 7000 },
        { name: "Marketing", projected: 4500, actual: 5100 },
      ],
      seedSource: "sample",
    },
    {
      month: isoMonthWithOffset(0),
      startingBalance: 22000,
      inflows: [
        { name: "Ventas online", projected: 48000, actual: 0 },
        { name: "Servicios", projected: 12000, actual: 0 },
      ],
      outflows: [
        { name: "Inventario", projected: 16000, actual: 0 },
        { name: "Gasto operativo", projected: 9000, actual: 0 },
      ],
      seedSource: "sample",
    },
  ];
}

export function getCostsSampleEntries(): CostExpenseEntry[] {
  return [
    {
      date: isoDateWithOffset(-14),
      description: "Renta del local",
      amount: 7000,
      type: "fixed_cost",
      category: "operacion",
      notes: "Pago mensual",
      seedSource: "sample",
    },
    {
      date: isoDateWithOffset(-13),
      description: "Materia prima",
      amount: 5200,
      type: "variable_cost",
      category: "produccion",
      notes: "Compra semanal",
      seedSource: "sample",
    },
    {
      date: isoDateWithOffset(-10),
      description: "Publicidad digital",
      amount: 1800,
      type: "expense",
      category: "marketing",
      notes: "Campana awareness",
      seedSource: "sample",
    },
    {
      date: isoDateWithOffset(-7),
      description: "Comisiones de venta",
      amount: 1300,
      type: "variable_cost",
      category: "ventas",
      notes: "Pasarela + vendedores",
      seedSource: "sample",
    },
    {
      date: isoDateWithOffset(-3),
      description: "Servicios administrativos",
      amount: 950,
      type: "expense",
      category: "administracion",
      notes: "Software y licencias",
      seedSource: "sample",
    },
  ];
}

function monthSeries(start: number, growth: number): number[] {
  return Array.from({ length: 12 }, (_, index) => Math.round(start + growth * index));
}

export function getBudgetSample(year = currentYear()): AnnualBudget {
  return {
    year,
    incomeLines: [
      {
        name: "Ventas",
        plannedByMonth: monthSeries(52000, 900),
        actualByMonth: monthSeries(49800, 750),
      },
      {
        name: "Servicios",
        plannedByMonth: monthSeries(11000, 200),
        actualByMonth: monthSeries(10400, 180),
      },
    ],
    expenseLines: [
      {
        name: "Costos directos",
        plannedByMonth: monthSeries(23000, 450),
        actualByMonth: monthSeries(23800, 420),
      },
      {
        name: "Gastos operativos",
        plannedByMonth: monthSeries(12000, 160),
        actualByMonth: monthSeries(12600, 170),
      },
      {
        name: "Impuestos/Intereses",
        plannedByMonth: monthSeries(3000, 40),
        actualByMonth: monthSeries(2900, 35),
      },
    ],
    seedSource: "sample",
  };
}

export function getBreakEvenSampleModel(): BreakEvenModel {
  return {
    fixedCosts: 42000,
    singleProduct: {
      price: 520,
      variableCost: 260,
    },
    multiProduct: {
      products: [
        { name: "Linea A", price: 520, variableCost: 260, salesMixPct: 50 },
        { name: "Linea B", price: 680, variableCost: 360, salesMixPct: 30 },
        { name: "Linea C", price: 420, variableCost: 210, salesMixPct: 20 },
      ],
    },
    scenarios: [
      { name: "Optimista", price: 560 },
      { name: "Conservador", variableCost: 290 },
    ],
    seedSource: "sample",
  };
}

export function getUnitEconomicsSampleModel(): UnitEconomicsModel {
  return {
    price: 249,
    variableCost: 90,
    marketingSales: 18000,
    newCustomers: 120,
    avgTicket: 249,
    purchaseFrequency: 1.8,
    retentionPeriod: 10,
    discountRatePct: 11,
    seedSource: "sample",
  };
}

export function getFinancingOptionsSampleModel(): FinancingOptionsModel {
  return {
    optionType: "mixed",
    principal: 800000,
    annualRatePct: 14,
    termMonths: 48,
    fees: 24000,
    otherCosts: 9000,
    equityOfferedPct: 12,
    controlScore: 72,
    riskScore: 58,
    flexibilityScore: 66,
    seedSource: "sample",
  };
}

export function getDebtManagerSampleModel(): DebtManagerModel {
  return {
    totalDebt: 950000,
    totalAssets: 2600000,
    ebit: 240000,
    interestExpense: 65000,
    loanAmount: 450000,
    fees: 9000,
    otherCosts: 3000,
    primaryBalance: 320000,
    primaryRatePct: 22,
    secondaryBalance: 180000,
    secondaryRatePct: 16,
    oldTotalCost: 570000,
    newTotalCost: 514000,
    seedSource: "sample",
  };
}

export function getProfitabilitySampleModel(): ProfitabilityModel {
  return {
    sales: 1550000,
    cogs: 810000,
    opex: 420000,
    netIncome: 190000,
    investment: 600000,
    segmentRevenue: 480000,
    segmentCosts: 310000,
    seedSource: "sample",
  };
}

export function getFinancialStrategySampleModel(): FinancialStrategyModel {
  return {
    revenue0: 2200000,
    growthRatePct: 18,
    targetNetMarginPct: 14,
    reinvestPct: 65,
    dividendPct: 35,
    debtPct: 38,
    equityPct: 62,
    maxDebtPct: 45,
    horizonYears: 5,
    seedSource: "sample",
  };
}

export function getContingencySampleModel(): ContingencyModel {
  return {
    riskName: "Caida de demanda",
    probabilityPct: 35,
    impactPct: 45,
    monthlyFixedOutflow: 210000,
    reserveMonths: 6,
    reserveBalance: 920000,
    trigger: "3 semanas seguidas con -20% en ventas",
    owner: "Direccion general",
    responseTimeDays: 5,
    seedSource: "sample",
  };
}

export function getFinancialEducationSampleModel(): FinancialEducationModel {
  return {
    role: "Equipo comercial",
    testScore1: 72,
    testScore2: 78,
    testScore3: 84,
    completedModules: 9,
    totalModules: 12,
    trainingCost: 45000,
    profitImprovement: 98000,
    seedSource: "sample",
  };
}

export function getInvestmentEvaluatorSampleModel(): InvestmentEvaluatorModel {
  return {
    investmentId: "MAQ-2026",
    initialCost: 780000,
    annualBenefit: 260000,
    discountRatePct: 11,
    years: 6,
    scenario: "base",
    seedSource: "sample",
  };
}

export function getBusinessModelAnalyzerSampleModel(): BusinessModelAnalyzerModel {
  return {
    model: "saas",
    sales: 3400000,
    cogs: 1100000,
    marketingSales: 520000,
    newCustomers: 640,
    ltv: 14800,
    churnPct: 4.2,
    capacityUsedPct: 83,
    benchmark: 3,
    target: 4,
    seedSource: "sample",
  };
}

export function getInternationalFinanceSampleModel(): InternationalFinanceModel {
  return {
    currencyCode: "USD",
    foreignAmount: 120000,
    plannedRate: 18.7,
    actualRate: 19.4,
    hedgedResult: 2280000,
    unhedgedResult: 2190000,
    basePrice: 1450,
    fxRiskBufferPct: 7,
    seedSource: "sample",
  };
}

export function getFintechEvaluatorSampleModel(): FintechEvaluatorModel {
  return {
    tool: "Suite financiera cloud",
    needsCoverageScore: 82,
    securityScore: 88,
    integrationScore: 76,
    easeScore: 72,
    annualCost: 98000,
    annualBenefit: 210000,
    dataRiskScore: 22,
    operationalRiskScore: 31,
    vendorRiskScore: 27,
    seedSource: "sample",
  };
}

export function getValuationSampleModel(): ValuationModel {
  return {
    annualSales: 4800000,
    salesMultiple: 1.7,
    annualEbitda: 920000,
    ebitdaMultiple: 6.2,
    annualNetIncome: 610000,
    netIncomeMultiple: 8,
    totalAssets: 3900000,
    totalLiabilities: 1350000,
    discountRatePct: 11,
    freeCashFlow: 540000,
    terminalValue: 2400000,
    years: 5,
    seedSource: "sample",
  };
}

export function getResilienceSampleModel(): ResilienceModel {
  return {
    availableCash: 1300000,
    monthlyBurn: 210000,
    monthlyOperatingExpense: 260000,
    targetMonths: 6,
    liquidityScore: 74,
    debtScore: 62,
    diversificationScore: 68,
    contingencyReadinessScore: 79,
    salesDropPct: 25,
    seedSource: "sample",
  };
}
