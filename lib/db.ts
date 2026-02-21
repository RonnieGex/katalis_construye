import Dexie, { type Table } from "dexie";

import type {
  AnnualBudget,
  AppSettings,
  BreakEvenModel,
  BusinessModelAnalyzerModel,
  ContingencyModel,
  DebtManagerModel,
  FinancialEducationModel,
  FinancialStrategyModel,
  FinancingOptionsModel,
  FintechEvaluatorModel,
  InternationalFinanceModel,
  InvestmentEvaluatorModel,
  CashFlowEntry,
  CostExpenseEntry,
  ProgressState,
  ProfitabilityModel,
  ResilienceModel,
  UnitEconomicsModel,
  ValuationModel,
} from "@/lib/domain";

export interface SingletonRecord<T> {
  id: "singleton";
  value: T;
}

class FinanceToolkitDb extends Dexie {
  settings!: Table<SingletonRecord<AppSettings>, "singleton">;
  progress!: Table<SingletonRecord<ProgressState>, "singleton">;
  cashflow!: Table<CashFlowEntry, string>;
  costs!: Table<CostExpenseEntry, number>;
  budget!: Table<AnnualBudget, number>;
  breakeven!: Table<SingletonRecord<BreakEvenModel>, "singleton">;

  unitEconomics!: Table<SingletonRecord<UnitEconomicsModel>, "singleton">;
  financingOptions!: Table<SingletonRecord<FinancingOptionsModel>, "singleton">;
  debtManager!: Table<SingletonRecord<DebtManagerModel>, "singleton">;
  profitabilityAnalyzer!: Table<SingletonRecord<ProfitabilityModel>, "singleton">;
  financialStrategyPlanner!: Table<SingletonRecord<FinancialStrategyModel>, "singleton">;
  contingencyPlanner!: Table<SingletonRecord<ContingencyModel>, "singleton">;
  financialEducationKit!: Table<SingletonRecord<FinancialEducationModel>, "singleton">;
  investmentEvaluator!: Table<SingletonRecord<InvestmentEvaluatorModel>, "singleton">;
  businessModelAnalyzer!: Table<SingletonRecord<BusinessModelAnalyzerModel>, "singleton">;
  internationalFinanceManager!: Table<SingletonRecord<InternationalFinanceModel>, "singleton">;
  fintechEvaluator!: Table<SingletonRecord<FintechEvaluatorModel>, "singleton">;
  valuationCalculator!: Table<SingletonRecord<ValuationModel>, "singleton">;
  resilienceEvaluator!: Table<SingletonRecord<ResilienceModel>, "singleton">;

  constructor() {
    super("finance_toolkit_db");
    this.version(1).stores({
      settings: "id",
      progress: "id",
      cashflow: "month",
      costs: "++id,date,type,category",
      budget: "year",
      breakeven: "id",
    });

    this.version(2).stores({
      settings: "id",
      progress: "id",
      cashflow: "month",
      costs: "++id,date,type,category",
      budget: "year",
      breakeven: "id",
      unitEconomics: "id",
      financingOptions: "id",
      debtManager: "id",
      profitabilityAnalyzer: "id",
      financialStrategyPlanner: "id",
      contingencyPlanner: "id",
      financialEducationKit: "id",
      investmentEvaluator: "id",
      businessModelAnalyzer: "id",
      internationalFinanceManager: "id",
      fintechEvaluator: "id",
      valuationCalculator: "id",
      resilienceEvaluator: "id",
    });
  }
}

let dbInstance: FinanceToolkitDb | null = null;

export function getDb(): FinanceToolkitDb {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser.");
  }

  if (!dbInstance) {
    dbInstance = new FinanceToolkitDb();
  }

  return dbInstance;
}