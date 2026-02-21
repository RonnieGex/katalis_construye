import type { ToolId } from "@/lib/domain";
import type { StageId } from "@/lib/guidance/stages";

export type TipRoute = "learn" | ToolId;

export interface GuidanceTip {
  id: string;
  title: string;
  description: string;
  routes: TipRoute[];
  stages?: StageId[];
}

const ALL_TIPS: GuidanceTip[] = [
  {
    id: "learn-stage-progress",
    title: "Avanza por etapas",
    description:
      "Completa una acción por etapa. El progreso se actualiza automáticamente según tus datos reales.",
    routes: ["learn"],
  },
  {
    id: "cashflow-starting-balance",
    title: "Empieza por saldo inicial",
    description:
      "Define el saldo inicial del mes antes de cargar líneas. Te ayuda a leer mejor el cierre real.",
    routes: ["cashflow"],
    stages: ["flujo", "equilibrio_kpi", "presupuesto"],
  },
  {
    id: "cashflow-projected-vs-actual",
    title: "Separa plan y realidad",
    description:
      "Usa proyectado para planear y real para controlar ejecución. Compara ambos cada cierre mensual.",
    routes: ["cashflow"],
  },
  {
    id: "costs-category-choice",
    title: "Clasifica con criterio",
    description:
      "Una categoría clara por movimiento te permite detectar rápido en donde se va el dinero.",
    routes: ["costs"],
    stages: ["costos", "flujo", "equilibrio_kpi"],
  },
  {
    id: "costs-fixed-vs-variable",
    title: "Distingue fijo vs variable",
    description:
      "Separar costos fijos y variables mejora tu lectura de margen y punto de equilibrio.",
    routes: ["costs"],
  },
  {
    id: "budget-plan-real-discipline",
    title: "Plan y real cada mes",
    description:
      "No esperes al cierre anual: registra mes a mes para reaccionar antes.",
    routes: ["budget"],
    stages: ["presupuesto"],
  },
  {
    id: "budget-variance-action",
    title: "Mira variaciones accionables",
    description:
      "Cuando una variación crece, decide si ajustar precio, costo o gasto en ese mismo mes.",
    routes: ["budget"],
  },
  {
    id: "breakeven-positive-margin",
    title: "Valida margen positivo",
    description:
      "Si el precio no supera el costo variable, no existe punto de equilibrio sostenible.",
    routes: ["breakeven"],
    stages: ["equilibrio_kpi"],
  },
  {
    id: "kpi-read-in-context",
    title: "Lee KPI en contexto",
    description:
      "Usa márgenes junto a flujo y costos; un KPI aislado puede ocultar riesgos.",
    routes: ["kpis"],
    stages: ["equilibrio_kpi", "presupuesto"],
  },
  {
    id: "unit-economics-ltv-cac",
    title: "Revisa LTV/CAC antes de escalar",
    description:
      "Si tu relación LTV/CAC cae por debajo de 3, ajusta adquisición o margen antes de crecer.",
    routes: ["unit-economics"],
  },
  {
    id: "financing-weighted-score",
    title: "No mires solo la tasa",
    description:
      "El score ponderado incorpora costo, control, riesgo y flexibilidad para decidir mejor.",
    routes: ["financing-options"],
  },
  {
    id: "investment-discount-rate",
    title: "Ajusta tasa de descuento",
    description:
      "Una tasa de descuento más alta reduce NPV y endurece el criterio de inversión.",
    routes: ["investment-evaluator"],
  },
  {
    id: "valuation-range",
    title: "Trabaja con rango de valor",
    description:
      "Contrasta múltiples y DCF para usar un rango de negociación, no un único número.",
    routes: ["valuation-calculator"],
  },
  {
    id: "resilience-runway-alert",
    title: "Runway bajo = alerta temprana",
    description:
      "Si runway cae por debajo de 6 meses, activa acciones de caja y contingencia.",
    routes: ["resilience-evaluator"],
  },
];

interface VisibleTipsInput {
  route: TipRoute;
  stage: StageId;
  dismissedTipIds: string[];
  limit?: number;
}

export function getVisibleTips(input: VisibleTipsInput): GuidanceTip[] {
  const dismissed = new Set(input.dismissedTipIds);
  const limit = input.limit ?? 2;

  return ALL_TIPS.filter((tip) => {
    if (!tip.routes.includes(input.route)) {
      return false;
    }

    if (dismissed.has(tip.id)) {
      return false;
    }

    if (!tip.stages || tip.stages.length === 0) {
      return true;
    }

    return tip.stages.includes(input.stage);
  }).slice(0, limit);
}
