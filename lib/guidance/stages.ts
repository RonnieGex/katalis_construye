import { computeWeightedContributionMargin } from "@/lib/calculations/breakeven";
import type {
  AnnualBudget,
  AppSettings,
  BreakEvenModel,
  CashFlowEntry,
  CostExpenseEntry,
  ProgressState,
} from "@/lib/domain";

export type StageId =
  | "setup"
  | "fundamentos"
  | "costos"
  | "flujo"
  | "equilibrio_kpi"
  | "presupuesto";

export interface StageMeta {
  id: StageId;
  title: string;
  description: string;
}

export interface GuidanceStageInput {
  settings: AppSettings;
  progress: ProgressState;
  cashflow: CashFlowEntry[];
  costs: CostExpenseEntry[];
  budgets: AnnualBudget[];
  breakEven: BreakEvenModel | null;
}

export interface StageResolution {
  currentStage: StageId;
  checks: Record<StageId, boolean>;
}

export const STAGE_ORDER: StageId[] = [
  "setup",
  "fundamentos",
  "costos",
  "flujo",
  "equilibrio_kpi",
  "presupuesto",
];

export const STAGE_META: Record<StageId, StageMeta> = {
  setup: {
    id: "setup",
    title: "Etapa 0: Configuración",
    description: "Define moneda, tipo de cambio y modelo de negocio para empezar sin fricción.",
  },
  fundamentos: {
    id: "fundamentos",
    title: "Etapa 1: Fundamentos",
    description: "Completa el capítulo 1 para dominar lenguaje financiero base.",
  },
  costos: {
    id: "costos",
    title: "Etapa 2: Costos",
    description: "Registra costos y gastos reales para crear visibilidad operativa.",
  },
  flujo: {
    id: "flujo",
    title: "Etapa 3: Flujo",
    description: "Controla entradas y salidas mensuales para evitar quiebres de caja.",
  },
  equilibrio_kpi: {
    id: "equilibrio_kpi",
    title: "Etapa 4: Equilibrio y KPI",
    description: "Valida rentabilidad mínima y monitorea indicadores clave.",
  },
  presupuesto: {
    id: "presupuesto",
    title: "Etapa 5: Presupuesto",
    description: "Consolida plan vs real y ajusta decisiones con variaciones mensuales.",
  },
};

function isUserSeed<T extends { seedSource?: "sample" | "user" }>(entry: T): boolean {
  return entry.seedSource !== "sample";
}

function hasSignificantCashFlow(entry: CashFlowEntry): boolean {
  const inflowTotal = entry.inflows.reduce(
    (total, line) => total + Math.max(0, line.projected) + Math.max(0, line.actual ?? 0),
    0,
  );
  const outflowTotal = entry.outflows.reduce(
    (total, line) => total + Math.max(0, line.projected) + Math.max(0, line.actual ?? 0),
    0,
  );

  return inflowTotal > 0 && outflowTotal > 0;
}

function hasCostMilestone(costs: CostExpenseEntry[]): boolean {
  const userCosts = costs.filter(isUserSeed);
  const distinctTypes = new Set(userCosts.map((entry) => entry.type));
  return userCosts.length >= 3 && distinctTypes.size >= 2;
}

function hasCashFlowMilestone(cashflow: CashFlowEntry[]): boolean {
  return cashflow.some((entry) => isUserSeed(entry) && hasSignificantCashFlow(entry));
}

function hasBreakEvenMilestone(model: BreakEvenModel | null): boolean {
  if (!model || model.seedSource === "sample" || model.fixedCosts <= 0) {
    return false;
  }

  const singleMargin = (model.singleProduct?.price ?? 0) - (model.singleProduct?.variableCost ?? 0);
  if (singleMargin > 0) {
    return true;
  }

  const weighted = computeWeightedContributionMargin(model.multiProduct?.products ?? []);
  return weighted > 0;
}

function hasKpiDerivableMilestone(cashflow: CashFlowEntry[], costs: CostExpenseEntry[]): boolean {
  const userCosts = costs.filter(isUserSeed).length;
  const userCashFlow = cashflow.filter(isUserSeed).filter(hasSignificantCashFlow).length;
  return userCosts > 0 && userCashFlow > 0;
}

function hasBudgetMilestone(budgets: AnnualBudget[]): boolean {
  return budgets
    .filter(isUserSeed)
    .some((budget) => {
      const values = [
        ...budget.incomeLines.flatMap((line) => [...line.plannedByMonth, ...line.actualByMonth]),
        ...budget.expenseLines.flatMap((line) => [...line.plannedByMonth, ...line.actualByMonth]),
      ];
      return values.some((value) => value !== 0);
    });
}

export function resolveGuidanceStage(input: GuidanceStageInput): StageResolution {
  const checks: Record<StageId, boolean> = {
    setup: Boolean(input.settings.onboardingCompletedAt),
    fundamentos: input.progress.completedChapterSlugs.includes("capitulo1_internacional"),
    costos: hasCostMilestone(input.costs),
    flujo: hasCashFlowMilestone(input.cashflow),
    equilibrio_kpi:
      hasBreakEvenMilestone(input.breakEven) &&
      hasKpiDerivableMilestone(input.cashflow, input.costs),
    presupuesto: hasBudgetMilestone(input.budgets),
  };

  const firstPending = STAGE_ORDER.find((stageId) => !checks[stageId]);
  return {
    currentStage: firstPending ?? "presupuesto",
    checks,
  };
}