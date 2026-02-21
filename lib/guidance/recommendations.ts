import type { ToolId } from "@/lib/domain";
import { STAGE_META, type StageId } from "@/lib/guidance/stages";

export interface GuidanceRecommendation {
  stage: StageId;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

const STAGE_RECOMMENDATIONS: Record<StageId, GuidanceRecommendation> = {
  setup: {
    stage: "setup",
    title: "Completa tu configuración inicial",
    description: "Define tu moneda base y modelo de negocio para interpretar montos sin confusión.",
    actionLabel: "Empezar configuración",
    actionHref: "/onboarding",
  },
  fundamentos: {
    stage: "fundamentos",
    title: "Domina los fundamentos financieros",
    description: "Lee el capítulo 1 y marca progreso para desbloquear recomendaciones de acción.",
    actionLabel: "Ir al capítulo 1",
    actionHref: "/chapter/capitulo1_internacional",
  },
  costos: {
    stage: "costos",
    title: "Registra costos y gastos reales",
    description: "Carga al menos 3 movimientos y combina tipos para generar análisis útil.",
    actionLabel: "Abrir Costos vs Gastos",
    actionHref: "/tools/costs-expenses",
  },
  flujo: {
    stage: "flujo",
    title: "Activa el control de caja",
    description: "Completa un mes con entradas y salidas para proyectar cierres confiables.",
    actionLabel: "Abrir Flujo de caja",
    actionHref: "/tools/cash-flow",
  },
  equilibrio_kpi: {
    stage: "equilibrio_kpi",
    title: "Valida equilibrio y monitorea KPI",
    description: "Define tu punto de equilibrio y revisa indicadores para tomar decisiones rápidas.",
    actionLabel: "Abrir Punto de equilibrio",
    actionHref: "/tools/break-even",
  },
  presupuesto: {
    stage: "presupuesto",
    title: "Consolida tu presupuesto anual",
    description: "Completa plan vs real y usa variaciones para priorizar ajustes.",
    actionLabel: "Abrir Presupuesto anual",
    actionHref: "/tools/budget",
  },
};

const TOOL_HINT_BY_STAGE: Partial<Record<StageId, Partial<Record<ToolId, string>>>> = {
  costos: {
    costs: "Registra al menos 3 movimientos reales para activar esta etapa.",
    "unit-economics": "Valida margen de contribución y COCA para priorizar rentabilidad.",
    "profitability-analyzer": "Compara márgenes y ROI para detectar fugas de utilidad.",
  },
  flujo: {
    cashflow: "Captura un mes completo (ingresos + egresos) para cerrar la etapa.",
    "debt-manager": "Revisa deuda y cobertura para proteger liquidez operativa.",
    "contingency-planner": "Define triggers y fondo de emergencia para reaccionar rápido.",
  },
  equilibrio_kpi: {
    breakeven: "Ingresa costos fijos y margen positivo para validar tu equilibrio.",
    kpis: "Revisa márgenes y saldo proyectado para confirmar salud financiera.",
    "investment-evaluator": "Evalua NPV e IRR antes de comprometer capital.",
    "business-model-analyzer": "Contrasta KPI del modelo contra benchmark y target.",
  },
  presupuesto: {
    budget: "Completa plan y real mensual para detectar variaciones.",
    "financial-strategy-planner": "Alinea crecimiento, margen y mix de capital a 5 años.",
    "financing-options": "Compara deuda/equity con costo efectivo y control.",
    "valuation-calculator": "Usa múltiples y DCF para definir rango de valor.",
    "international-finance-manager": "Mide impacto FX y precio recomendado por riesgo.",
    "fintech-evaluator": "Prioriza herramientas con mayor fit y menor riesgo de migración.",
    "financial-education-kit": "Convierte capacitación en mejoras de KPI medibles.",
    "resilience-evaluator": "Monitorea runway y score de resiliencia ante crisis.",
  },
};

export function getStageRecommendation(stage: StageId): GuidanceRecommendation {
  return STAGE_RECOMMENDATIONS[stage];
}

export function getToolRecommendation(
  toolId: ToolId,
  stage: StageId,
  currentStepTitle?: string,
): string {
  const toolHint = TOOL_HINT_BY_STAGE[stage]?.[toolId];
  if (toolHint) {
    return currentStepTitle ? `${toolHint} Paso actual: ${currentStepTitle}.` : toolHint;
  }

  const generic = `Tu etapa actual es ${STAGE_META[stage].title.toLowerCase()}. Continúa con la acción recomendada para avanzar.`;
  return currentStepTitle ? `${generic} Paso actual: ${currentStepTitle}.` : generic;
}

