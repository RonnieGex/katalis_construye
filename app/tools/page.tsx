"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { StageGuidanceCard } from "@/components/stage-guidance-card";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import type { AppSettings } from "@/lib/domain";
import { deriveGuidanceSummary, type GuidanceSummary } from "@/lib/guidance/summary";
import {
  getBreakEvenModel,
  getProgress,
  getSettings,
  listBudgets,
  listCashFlowEntries,
  listCostEntries,
} from "@/lib/repo";

interface ToolCard {
  href: string;
  title: string;
  tagline: string;         // one sentence — the job it does
  description: string;    // 2-3 sentences — why you care + what you get
  formula: string;        // core formula written out explicitly
  inputs: string[];       // datos que necesitas tener listos
  outputs: string[];      // qué te entrega la herramienta
  chapters?: string;
}

interface ToolGroup {
  title: string;
  subtitle: string;
  chapterHint: string;
  cards: ToolCard[];
}

const GROUPS: ToolGroup[] = [
  {
    title: "Rentabilidad",
    subtitle: "¿Estoy ganando lo suficiente con cada venta?",
    chapterHint: "Capítulos 5, 9 y 14",
    cards: [
      {
        href: "/tools/unit-economics",
        title: "Unit Economics",
        tagline: "Calcula cuánto vale cada cliente y cuánto te cuesta conseguirlo.",
        description:
          "Muchos negocios crecen gastando más en clientes de lo que esos clientes aportan. Esta herramienta te muestra exactamente si tu modelo tiene sentido: ¿cuánto ganas por venta, cuándo recuperas lo que invertiste en conseguir al cliente, y si tu LTV supera al menos 3 veces tu costo de adquisición?",
        formula: "LTV = Compra Promedio × Frecuencia Mensual × Meses de Retención   |   COCA = Gasto en Marketing ÷ Clientes Nuevos   |   Ratio sano: LTV ≥ 3× COCA",
        inputs: ["Precio de venta promedio", "Costo variable por unidad", "Gasto mensual en marketing", "Clientes nuevos por mes", "Tasa de retención"],
        outputs: ["Margen de contribución", "COCA (costo por cliente)", "LTV (valor de vida)", "Payback period", "Ratio LTV:COCA"],
        chapters: "Cap. 4 y 5",
      },
      {
        href: "/tools/profitability-analyzer",
        title: "Analizador de Rentabilidad",
        tagline: "Descubre qué productos, servicios o clientes te generan más margen real.",
        description:
          "No toda venta es igual de valiosa. Esta herramienta te ayuda a ver la rentabilidad real por producto, línea o segmento de cliente — incluyendo ROI y utilidad neta — para que puedas enfocarte en lo que más te conviene y dejar ir lo que te drena recursos.",
        formula: "Margen Bruto = (Ingresos − Costos Directos) ÷ Ingresos   |   ROI = (Utilidad Neta ÷ Inversión Total) × 100",
        inputs: ["Ingresos por línea o producto", "Costos directos e indirectos", "Gastos operativos asignables"],
        outputs: ["Margen bruto y neto por segmento", "ROI por línea", "Ranking de rentabilidad"],
        chapters: "Cap. 9",
      },
      {
        href: "/tools/break-even",
        title: "Punto de Equilibrio",
        tagline: "Sabe exactamente cuánto necesitas vender para no perder dinero.",
        description:
          "Antes de tomar cualquier decisión de precio o inversión, necesitas saber tu piso mínimo de ventas. Esta calculadora te muestra el punto de equilibrio en unidades y en pesos, para uno o varios productos, y te permite simular \"¿qué pasa si bajo el precio un 10%?\" antes de hacerlo.",
        formula: "Punto de Equilibrio = Costos Fijos Totales ÷ (Precio de Venta − Costo Variable por Unidad)",
        inputs: ["Costos fijos totales", "Precio de venta por unidad", "Costo variable por unidad"],
        outputs: ["Unidades mínimas a vender", "Ingresos mínimos requeridos", "Margen de seguridad actual", "Simulación de escenarios"],
        chapters: "Cap. 4",
      },
      {
        href: "/tools/kpis",
        title: "Dashboard KPI",
        tagline: "Todos tus indicadores financieros clave en un solo lugar.",
        description:
          "Un tablero financiero que concentra los números más importantes de tu negocio. En lugar de revisar hojas de cálculo separadas, aquí ves de un vistazo si tu negocio está en zona verde, amarilla o roja — y por qué.",
        formula: "Liquidez = Activos Corrientes ÷ Pasivos Corrientes   |   Rotación de Cartera = Ventas ÷ Cuentas por Cobrar Promedio",
        inputs: ["Ingresos y costos del período", "Cuentas por cobrar y pagar", "Flujo de efectivo del mes"],
        outputs: ["Score financiero integral", "Semáforo por indicador", "Comparativo vs. período anterior"],
        chapters: "Cap. 14",
      },
    ],
  },
  {
    title: "Planeación y Capital",
    subtitle: "¿Tu negocio tiene el financiamiento y el plan que necesita para crecer?",
    chapterHint: "Capítulos 7, 10, 13 y 18",
    cards: [
      {
        href: "/tools/financing-options",
        title: "Evaluador de Financiamiento",
        tagline: "Compara opciones de crédito, inversión o deuda para elegir la más conveniente.",
        description:
          "No todos los financiamientos cuestan lo mismo ni tienen el mismo impacto en tu negocio. Esta herramienta calcula el costo real total de cada opción, el efecto en tu dilución accionaria si aplica, y te da un score ponderado para que compares manzanas con manzanas.",
        formula: "Costo Real (TEA) = (1 + Tasa Nominal ÷ Períodos)^Períodos − 1   |   Dilución = Nuevas Acciones ÷ (Acciones Actuales + Nuevas Acciones)",
        inputs: ["Monto requerido", "Tasa de interés o porcentaje de dilución", "Plazo", "Condiciones especiales"],
        outputs: ["Costo total de financiamiento (TEA)", "Impacto en dilución", "Score comparativo por opción"],
        chapters: "Cap. 7",
      },
      {
        href: "/tools/debt-manager",
        title: "Administrador de Deuda",
        tagline: "Controla tus deudas actuales y sabe si tu nivel de endeudamiento es saludable.",
        description:
          "No toda deuda es mala, pero demasiada deuda puede ahogar tu negocio. Esta herramienta calcula tu ratio de endeudamiento, tu capacidad de cobertura de deuda, y te avisa cuando estás cerca del límite — antes de que el banco te lo diga.",
        formula: "Ratio de Endeudamiento = Deuda Total ÷ Activos Totales   |   Cobertura de Deuda = EBITDA ÷ Servicio Anual de Deuda   (sano: > 1.25)",
        inputs: ["Deudas actuales (monto, tasa, plazo)", "EBITDA o flujo operativo", "Activos totales"],
        outputs: ["Debt ratio", "Índice de cobertura de deuda", "Alerta de riesgo", "Escenario de refinanciación"],
        chapters: "Cap. 8",
      },
      {
        href: "/tools/financial-strategy-planner",
        title: "Planificador de Estrategia",
        tagline: "Proyecta tus finanzas a 5 años y diseña el mix de capital ideal para tu crecimiento.",
        description:
          "Crecer sin un plan financiero es caminar con los ojos cerrados. Esta herramienta te ayuda a construir proyecciones realistas a mediano plazo, identificar cuándo necesitarás capital adicional y decidir si conviene deuda, equity o una combinación de ambos.",
        formula: "Ingresos Año N = Ingresos Actuales × (1 + Tasa Crecimiento)^N   |   Necesidad de Capital = Inversión Planeada − Flujo Libre Proyectado",
        inputs: ["Ingresos actuales y tasa de crecimiento esperada", "Costos fijos y variables proyectados", "Inversiones planeadas"],
        outputs: ["Proyección P&L a 5 años", "Flujo de caja proyectado", "Necesidad de capital por año", "Mix de financiamiento sugerido"],
        chapters: "Cap. 10",
      },
      {
        href: "/tools/investment-evaluator",
        title: "Evaluador de Inversiones",
        tagline: "Decide si una inversión vale la pena antes de comprometer tu dinero.",
        description:
          "Antes de comprar un equipo, abrir una sucursal o lanzar un producto nuevo, esta herramienta te dice cuándo recuperarás lo invertido, cuál es la tasa interna de retorno y si el valor presente neto justifica el riesgo que estás tomando.",
        formula: "Payback = Inversión ÷ Flujo Anual Promedio   |   NPV = Σ (Flujo Año N ÷ (1 + Tasa)^N) − Inversión Inicial   (positivo = vale la pena)",
        inputs: ["Monto de inversión", "Flujos de caja esperados por año", "Tasa de descuento o costo de capital"],
        outputs: ["Período de payback", "NPV (valor presente neto)", "IRR (tasa interna de retorno)", "Decisión recomendada"],
        chapters: "Cap. 13",
      },
      {
        href: "/tools/valuation-calculator",
        title: "Calculadora de Valoración",
        tagline: "Estima cuánto vale tu empresa hoy usando los métodos que usan los inversionistas.",
        description:
          "Si alguna vez necesitas levantar capital, vender o simplemente saber dónde paras, necesitas una valuación. Esta herramienta aplica tres métodos: múltiplos de EBITDA, valor en libros y flujo de caja descontado — y te muestra un rango realista de valor.",
        formula: "Por Múltiplos: Valor = EBITDA × Múltiplo del Sector   |   Por DCF: Valor = Σ (Flujo Libre N ÷ (1 + WACC)^N) + Valor Terminal",
        inputs: ["EBITDA o utilidad operativa", "Activos y pasivos", "Flujos de caja históricos y proyectados"],
        outputs: ["Valuación por múltiplos", "Valuación por DCF", "Valuación por valor libro", "Rango estimado de valor"],
        chapters: "Cap. 18",
      },
      {
        href: "/tools/budget",
        title: "Presupuesto Anual",
        tagline: "Planea tus ingresos y gastos, y monitorea mes a mes si vas en línea.",
        description:
          "Un presupuesto no es solo un plan — es tu termómetro de salud financiera. Esta herramienta te permite definir metas por categoría, registrar lo que realmente pasó cada mes y ver inmediatamente dónde te desviaste para corregir el rumbo a tiempo.",
        formula: "Variación = Real − Presupuestado   |   Variación % = (Real − Presupuestado) ÷ Presupuestado × 100   (negativo en gasto = eficiencia)",
        inputs: ["Metas de ingresos por categoría", "Gastos presupuestados por rubro", "Cifras reales del mes"],
        outputs: ["Comparativo plan vs. real", "Variación en pesos y porcentaje", "Alerta por categorías fuera de rango"],
        chapters: "Cap. 6",
      },
    ],
  },
  {
    title: "Riesgo y Resiliencia",
    subtitle: "¿Tu negocio sobreviviría una crisis de 3 meses?",
    chapterHint: "Capítulos 8, 11, 16 y 19",
    cards: [
      {
        href: "/tools/contingency-planner",
        title: "Planificador de Contingencia",
        tagline: "Identifica tus riesgos clave y prepara un plan de acción antes de que llegue la crisis.",
        description:
          "No se trata de ser pesimista — se trata de estar preparado. Esta herramienta te ayuda a mapear los riesgos financieros de tu negocio, definir qué tan probable y grave es cada uno, y diseñar respuestas concretas para cada escenario. También calcula el fondo de emergencia que necesitas.",
        formula: "Prioridad de Riesgo = Probabilidad (1-5) × Impacto (1-5)   |   Fondo de Emergencia = Gastos Fijos Mensuales × 3 meses mínimo",
        inputs: ["Lista de riesgos potenciales", "Gastos fijos mensuales", "Ingresos mínimos de supervivencia"],
        outputs: ["Mapa de riesgos priorizado", "Fondo de emergencia recomendado", "Triggers de activación por escenario", "Plan de respuesta por riesgo"],
        chapters: "Cap. 11",
      },
      {
        href: "/tools/international-finance-manager",
        title: "Gestor de Finanzas Internacionales",
        tagline: "Proteges tu negocio de la volatilidad cambiaria si operas en más de una moneda.",
        description:
          "Si compras en dólares y vendes en pesos, o tienes clientes en el extranjero, los movimientos del tipo de cambio pueden convertir una ganancia en pérdida. Esta herramienta calcula tu exposición real en divisa extranjera y te sugiere estrategias de cobertura para dormir tranquilo.",
        formula: "Exposición Neta FX = Ingresos en Divisa − Egresos en Divisa   |   Pérdida Potencial = Exposición Neta × Variación % Esperada del Tipo de Cambio",
        inputs: ["Ingresos y egresos por moneda", "Tipo de cambio actual y proyectado", "Contratos o compromisos en moneda extranjera"],
        outputs: ["Exposición neta en FX", "Costo de cobertura estimado", "Buffer recomendado por volatilidad"],
        chapters: "Cap. 16",
      },
      {
        href: "/tools/resilience-evaluator",
        title: "Evaluador de Resiliencia",
        tagline: "Mide qué tan sólido está tu negocio para aguantar un período difícil.",
        description:
          "¿Cuántos meses puede operar tu empresa sin ingresos nuevos? ¿Tienes suficiente reserva? ¿Qué tan estresado está tu flujo de caja en un escenario adverso? Esta herramienta te da un score de resiliencia financiera con recomendaciones concretas para mejorarlo.",
        formula: "Runway = Efectivo Disponible ÷ Gasto Mensual Promedio   |   Reserva Mínima = Gastos Fijos × 3   (saludable: runway ≥ 6 meses)",
        inputs: ["Efectivo disponible", "Gastos fijos mensuales", "Líneas de crédito disponibles", "Cuentas por cobrar"],
        outputs: ["Runway en meses", "Score de resiliencia (0-100)", "Nivel de reserva vs. recomendado", "Acciones prioritarias"],
        chapters: "Cap. 19",
      },
    ],
  },
  {
    title: "Operación y Escalamiento",
    subtitle: "¿Tienes los sistemas y el conocimiento para operar a mayor escala?",
    chapterHint: "Capítulos 3, 6, 12, 15 y 17",
    cards: [
      {
        href: "/tools/cash-flow",
        title: "Flujo de Caja",
        tagline: "Visualiza mes a mes cuándo entra y cuándo sale el efectivo en tu negocio.",
        description:
          "La herramienta más importante de operaciones diarias: un registro claro de entradas y salidas reales de efectivo, comparado con lo que proyectaste. Te ayuda a anticipar meses difíciles, identificar cobros pendientes críticos y tener siempre claridad sobre tu posición real de caja.",
        formula: "Flujo Neto = Total de Entradas − Total de Salidas   |   Saldo Final = Saldo Inicial + Flujo Neto del Período",
        inputs: ["Ingresos recibidos por mes", "Pagos realizados por categoría", "Proyección de cobros y pagos pendientes"],
        outputs: ["Flujo neto mensual", "Comparativo proyección vs. real", "Gráfica de saldo acumulado", "Alerta de meses negativos"],
        chapters: "Cap. 3",
      },
      {
        href: "/tools/costs-expenses",
        title: "Costos vs Gastos",
        tagline: "Clasifica correctamente cada peso que sale y descubre dónde se va realmente el dinero.",
        description:
          "Confundir costos con gastos es uno de los errores más comunes — y más caros — en los negocios pequeños. Esta herramienta te guía para registrar y clasificar cada salida de dinero correctamente, mostrándote después gráficas de distribución para que puedas tomar decisiones de reducción con datos reales.",
        formula: "Costo Variable Total = Costo Unitario × Unidades Producidas   |   Utilidad Bruta = Ingresos − Costos Directos (NO incluye gastos operativos)",
        inputs: ["Gastos y costos del período", "Categoría de cada uno (fijo/variable, costo/gasto)"],
        outputs: ["Distribución porcentual por categoría", "Total de costos fijos y variables", "Comparativo entre períodos"],
        chapters: "Cap. 2",
      },
      {
        href: "/tools/financial-education-kit",
        title: "Kit de Educación Financiera",
        tagline: "Mide qué tanto sabe tu equipo de finanzas y planea cómo mejorar ese conocimiento.",
        description:
          "El mayor riesgo financiero de un negocio pequeño es el dueño que no entiende sus propios números. Este kit evalúa el nivel de conocimiento financiero del equipo, calcula el ROI de capacitarse y genera un plan de aprendizaje priorizado según las áreas más débiles.",
        formula: "ROI de Capacitación = (Beneficio Económico Estimado − Costo de Capacitación) ÷ Costo de Capacitación × 100",
        inputs: ["Evaluación de conocimientos por área", "Costo de opciones de capacitación", "Tamaño del equipo"],
        outputs: ["Índice de conocimiento financiero", "Brechas prioritarias", "Plan de capacitación sugerido", "ROI de la inversión en formación"],
        chapters: "Cap. 12",
      },
      {
        href: "/tools/business-model-analyzer",
        title: "Analizador por Modelo de Negocio",
        tagline: "Obtén los KPIs correctos según si eres e-commerce, SaaS, servicios o manufactura.",
        description:
          "No todos los negocios se miden igual. Un SaaS mide Churn y MRR; una tienda en línea mide ROAS y ticket promedio; un taller mide utilización de capacidad. Esta herramienta te da el tablero de métricas específico para tu modelo de negocio, para que dejes de medir cosas que no importan.",
        formula: "SaaS → MRR = Clientes Activos × Suscripción Promedio   |   E-commerce → ROAS = Ingresos por Publicidad ÷ Gasto en Publicidad",
        inputs: ["Tipo de modelo de negocio", "Métricas operativas del período"],
        outputs: ["KPIs prioritarios para tu modelo", "Benchmarks de referencia", "Alerta de métricas fuera de rango"],
        chapters: "Cap. 15",
      },
      {
        href: "/tools/fintech-evaluator",
        title: "Evaluador de Tecnología Financiera",
        tagline: "Evalúa si una herramienta fintech realmente le conviene a tu negocio antes de adoptarla.",
        description:
          "El mercado está lleno de apps y plataformas financieras, pero no todas son adecuadas para tu tamaño y modelo de negocio. Esta herramienta te da un score de compatibilidad basado en tus necesidades reales, calcula el ROI esperado de la adopción y estima el riesgo de migración.",
        formula: "ROI de Adopción = (Ahorro o Ganancia Anual por la herramienta − Costo Anual) ÷ Costo de Implementación × 100",
        inputs: ["Necesidades financieras actuales", "Costo de la solución evaluada", "Tiempo de implementación estimado"],
        outputs: ["Fit score (compatibilidad)", "ROI proyectado de la adopción", "Riesgo de migración", "Alternativas comparadas"],
        chapters: "Cap. 17",
      },
    ],
  },
];

function ToolAccordionCard({ card }: { card: ToolCard }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[var(--stroke)] bg-[var(--background)] overflow-hidden">
      {/* Header — always visible, acts as the link + expand toggle */}
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div className="flex-1 min-w-0">
          <p className="font-black text-[var(--foreground)] text-base leading-tight">{card.title}</p>
          <p className="mt-1 text-sm text-neutral-600 leading-snug">{card.tagline}</p>
          {card.chapters && (
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">{card.chapters}</p>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex-shrink-0 mt-0.5 w-7 h-7 flex items-center justify-center border border-[var(--stroke)] text-neutral-500 hover:bg-neutral-100 transition-colors"
          aria-label={open ? "Cerrar detalles" : "Ver detalles"}
        >
          <span className="text-xs font-bold select-none">{open ? "−" : "+"}</span>
        </button>
      </div>

      {/* Accordion body */}
      {open && (
        <div className="border-t border-[var(--stroke)] bg-neutral-50 px-5 py-4 space-y-4">
          {/* Description */}
          <p className="text-sm text-neutral-700 leading-relaxed">{card.description}</p>

          {/* Inputs + Outputs */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">Necesitas tener listo</p>
              <ul className="space-y-1">
                {card.inputs.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-neutral-600">
                    <span className="mt-0.5 text-[9px] text-neutral-400 font-bold flex-shrink-0">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">Qué obtienes</p>
              <ul className="space-y-1">
                {card.outputs.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-neutral-600">
                    <span className="mt-0.5 text-[9px] text-neutral-800 font-bold flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-1">
            <Link
              href={card.href}
              className="inline-block bg-[#171717] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-neutral-800 transition-colors"
            >
              Abrir herramienta →
            </Link>
          </div>
        </div>
      )}

      {/* Formula strip (visible when closed) */}
      {!open && (
        <div className="border-t border-[var(--stroke)] px-5 py-2.5 flex items-start justify-between gap-4 bg-neutral-50">
          <p className="text-[10px] font-mono text-neutral-500 leading-relaxed flex-1">
            <span className="font-bold text-neutral-400 not-italic mr-1.5">f(x)</span>
            {card.formula}
          </p>
          <Link
            href={card.href}
            className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest text-neutral-700 hover:text-black transition-colors"
          >
            Abrir →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ToolsHomePage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [guidance, setGuidance] = useState<GuidanceSummary | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [savedSettings, savedProgress, cashflow, costs, budgets, breakEven] = await Promise.all([
        getSettings(),
        getProgress(),
        listCashFlowEntries(),
        listCostEntries(),
        listBudgets(),
        getBreakEvenModel(),
      ]);

      if (!active) return;
      setSettings(savedSettings);
      setGuidance(
        deriveGuidanceSummary({
          settings: savedSettings,
          progress: savedProgress,
          cashflow,
          costs,
          budgets,
          breakEven,
        }),
      );
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <section className="panel-soft p-6">
        <h1 className="section-title text-4xl text-black">Herramientas</h1>
        <p className="mt-2 text-neutral-700 max-w-2xl">
          Cada herramienta está vinculada a los capítulos del libro y produce resultados que puedes exportar. Expande cualquier tarjeta para ver qué necesitas tener listo y qué obtendrás.
        </p>
        <p className="mt-2 text-xs text-neutral-500">
          Moneda visible: {settings.currencyDisplayMode === "usd" ? "USD" : settings.baseCurrency.code}
        </p>
      </section>

      {guidance ? <StageGuidanceCard guidance={guidance} compact /> : null}

      {/* Tool groups */}
      {GROUPS.map((group) => (
        <section key={group.title} className="space-y-4">
          <div className="border-b border-[var(--stroke)] pb-3">
            <h2 className="section-title text-2xl text-black">{group.title}</h2>
            <p className="mt-1 text-sm text-neutral-600">{group.subtitle}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">{group.chapterHint}</p>
          </div>
          <div className="space-y-2">
            {group.cards.map((card) => (
              <ToolAccordionCard key={card.href} card={card} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
