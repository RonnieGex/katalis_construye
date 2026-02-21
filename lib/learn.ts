import type { LearningLayerId } from "@/lib/domain";

export interface RelatedTool {
  name: string;
  href: string;
}

export interface LearningLayer {
  id: LearningLayerId;
  title: string;
  description: string;
  chapterNumbers: number[];
}

export interface LearningPathStep {
  id: string;
  layerId: LearningLayerId;
  title: string;
  description: string;
  chapterSlug?: string;
  chapterNumber?: number;
  actionLabel: string;
  actionHref: string;
  toolLinks: RelatedTool[];
}

export interface LayerProgress {
  layerId: LearningLayerId;
  total: number;
  completed: number;
  percent: number;
}

export interface ChapterOutlineItem {
  chapterNumber: number;
  slug: string;
  title: string;
  hint: string;
  layerId: LearningLayerId;
  tools: RelatedTool[];
}

function chapterSlug(chapterNumber: number): string {
  return `capitulo${chapterNumber}_internacional`;
}

export const LEARNING_LAYERS: LearningLayer[] = [
  {
    id: "base",
    title: "Base",
    description: "Conceptos esenciales y control operativo inicial.",
    chapterNumbers: [1, 2, 3, 4, 5, 6],
  },
  {
    id: "intermediate",
    title: "Intermedia",
    description: "Rentabilidad, deuda, inversión y decisiones de capital.",
    chapterNumbers: [7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: "advanced",
    title: "Avanzada",
    description: "Control estratégico, valoración, fintech y resiliencia.",
    chapterNumbers: [14, 15, 16, 17, 18, 19],
  },
];

const CHAPTER_TOOL_MAP: Record<number, RelatedTool[]> = {
  1: [],
  2: [{ name: "Costos vs Gastos", href: "/tools/costs-expenses" }],
  3: [{ name: "Flujo de caja", href: "/tools/cash-flow" }],
  4: [
    { name: "Punto de equilibrio", href: "/tools/break-even" },
    { name: "Dashboard KPI", href: "/tools/kpis" },
  ],
  5: [{ name: "Unit Economics", href: "/tools/unit-economics" }],
  6: [{ name: "Presupuesto anual", href: "/tools/budget" }],
  7: [{ name: "Evaluador de Financiamiento", href: "/tools/financing-options" }],
  8: [{ name: "Administrador de Deuda", href: "/tools/debt-manager" }],
  9: [{ name: "Analizador de Rentabilidad", href: "/tools/profitability-analyzer" }],
  10: [{ name: "Planificador de Estrategia", href: "/tools/financial-strategy-planner" }],
  11: [{ name: "Planificador de Contingencia", href: "/tools/contingency-planner" }],
  12: [{ name: "Kit de Educación Financiera", href: "/tools/financial-education-kit" }],
  13: [{ name: "Evaluador de Inversiones", href: "/tools/investment-evaluator" }],
  14: [{ name: "Dashboard KPI", href: "/tools/kpis" }],
  15: [{ name: "Analizador por Modelo de Negocio", href: "/tools/business-model-analyzer" }],
  16: [{ name: "Gestor de Finanzas Internacionales", href: "/tools/international-finance-manager" }],
  17: [{ name: "Evaluador de Tecnología Financiera", href: "/tools/fintech-evaluator" }],
  18: [{ name: "Calculadora de Valoración", href: "/tools/valuation-calculator" }],
  19: [{ name: "Evaluador de Resiliencia", href: "/tools/resilience-evaluator" }],
};

const CHAPTER_HINTS: Record<number, string> = {
  1: "Domina el lenguaje financiero para tomar decisiones con criterio.",
  2: "Clasifica costos y gastos para entender tu estructura real.",
  3: "Controla entradas/salidas para evitar tensión de caja.",
  4: "Encuentra tu punto de equilibrio y valida sostenibilidad.",
  5: "Mide economía unitaria para escalar con rentabilidad.",
  6: "Plan vs real: disciplina mensual para no improvisar.",
  7: "Compara fuentes de financiamiento con costo y control.",
  8: "Optimiza deuda y cobertura para bajar riesgo financiero.",
  9: "Monitorea márgenes y retorno de la operación.",
  10: "Alinea crecimiento, margen y estructura de capital.",
  11: "Prepara contingencias con triggers y fondos de respaldo.",
  12: "Convierte formación financiera en resultados medibles.",
  13: "Evalúa inversión con NPV/IRR antes de comprometer caja.",
  14: "Control integral con indicadores de salud financiera.",
  15: "Ajusta decisiones según modelo de negocio.",
  16: "Gestiona riesgo cambiario y exposición internacional.",
  17: "Elige fintech con fit real, ROI y riesgo controlado.",
  18: "Valora tu empresa con múltiples y DCF.",
  19: "Fortalece resiliencia para resistir escenarios adversos.",
};

const CHAPTER_TITLES: Record<number, string> = {
  1: "Las Finanzas desde Cero",
  2: "Costos y Gastos Claramente Diferenciados",
  3: "El Flujo de Efectivo",
  4: "Métricas Financieras Esenciales",
  5: "Unit Economics y Rentabilidad",
  6: "Presupuesto y Planeación Financiera",
  7: "Financiamiento y Fuentes de Capital",
  8: "Administración de Deuda y Riesgo",
  9: "Estrategias para Mejorar Rentabilidad",
  10: "Estrategia Financiera a Largo Plazo",
  11: "Plan de Contingencia Financiera",
  12: "Educación Financiera para Equipos",
  13: "Estrategias de Inversión",
  14: "KPIs Financieros y No Financieros",
  15: "Finanzas por Modelo de Negocio",
  16: "Finanzas Internacionales para PyMEs",
  17: "Tecnología Financiera para PyMEs",
  18: "Valoración de Empresas",
  19: "Resiliencia Financiera en Crisis",
};

const SETUP_STEP: LearningPathStep = {
  id: "setup",
  layerId: "base",
  title: "Paso 0: Configuración inicial",
  description: "Define moneda base y modelo de negocio antes de comenzar.",
  actionLabel: "Empezar configuración",
  actionHref: "/onboarding",
  toolLinks: [],
};

const CHAPTER_STEPS: LearningPathStep[] = LEARNING_LAYERS.flatMap((layer) =>
  layer.chapterNumbers.map((chapterNumber) => {
    const toolLinks = CHAPTER_TOOL_MAP[chapterNumber] ?? [];
    const primaryTool = toolLinks[0];
    return {
      id: `capitulo-${chapterNumber}`,
      layerId: layer.id,
      title: `Capítulo ${chapterNumber}`,
      description: CHAPTER_HINTS[chapterNumber] ?? "Aplica los conceptos del capítulo en una herramienta.",
      chapterSlug: chapterSlug(chapterNumber),
      chapterNumber,
      actionLabel: primaryTool ? `Aplicar: ${primaryTool.name}` : "Leer capítulo",
      actionHref: primaryTool ? primaryTool.href : `/chapter/${chapterSlug(chapterNumber)}`,
      toolLinks,
    };
  }),
);

export const LEARNING_PATH: LearningPathStep[] = [SETUP_STEP, ...CHAPTER_STEPS];

export function getLearningStepsByLayer(layerId: LearningLayerId): LearningPathStep[] {
  if (layerId === "base") {
    return LEARNING_PATH.filter((step) => step.layerId === layerId);
  }
  return CHAPTER_STEPS.filter((step) => step.layerId === layerId);
}

export function getLayerProgress(
  completedChapterSlugs: string[],
): Record<LearningLayerId, LayerProgress> {
  const completed = new Set(completedChapterSlugs);
  const output = {} as Record<LearningLayerId, LayerProgress>;

  for (const layer of LEARNING_LAYERS) {
    const slugs = layer.chapterNumbers.map((chapterNumber) => chapterSlug(chapterNumber));
    const done = slugs.filter((slug) => completed.has(slug)).length;
    const total = slugs.length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    output[layer.id] = {
      layerId: layer.id,
      total,
      completed: done,
      percent,
    };
  }

  return output;
}

export function getChapterOutlineByLayer(layerId: LearningLayerId): ChapterOutlineItem[] {
  const layer = LEARNING_LAYERS.find((item) => item.id === layerId);
  if (!layer) {
    return [];
  }

  return layer.chapterNumbers.map((chapterNumber) => ({
    chapterNumber,
    slug: chapterSlug(chapterNumber),
    title: CHAPTER_TITLES[chapterNumber] ?? `Capítulo ${chapterNumber}`,
    hint: CHAPTER_HINTS[chapterNumber] ?? "Aplica este capítulo en una herramienta relacionada.",
    layerId,
    tools: getRelatedTools(chapterNumber),
  }));
}

export function getRelatedTools(chapterNumber?: number): RelatedTool[] {
  if (!chapterNumber) {
    return [];
  }
  return CHAPTER_TOOL_MAP[chapterNumber] ?? [];
}

export function getLearningStepForChapter(chapterSlugValue: string): LearningPathStep | null {
  return CHAPTER_STEPS.find((step) => step.chapterSlug === chapterSlugValue) ?? null;
}

export function getNextStepForChapter(chapterSlugValue: string): LearningPathStep | null {
  const index = CHAPTER_STEPS.findIndex((step) => step.chapterSlug === chapterSlugValue);
  if (index < 0) {
    return null;
  }
  return CHAPTER_STEPS[index + 1] ?? null;
}

