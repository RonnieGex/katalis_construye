import type { ToolId } from "@/lib/domain";

export type FormulaSourceType = "excel-cell" | "book-chapter" | "vba-module";

export interface FormulaRegistryEntry {
  formulaId: string;
  toolId: ToolId;
  expression: string;
  humanName: string;           // readable name, e.g. "Valor de Vida del Cliente (LTV)"
  humanExplanation: string;    // plain-language breakdown of what each variable is/does
  sourceType: FormulaSourceType;
  sourceRef: string;
}

export const FORMULA_REGISTRY: FormulaRegistryEntry[] = [
  {
    formulaId: "unit-economics.contribution-margin",
    toolId: "unit-economics",
    expression: "margenContribucion = precio − costoVariable",
    humanName: "Margen de Contribución",
    humanExplanation:
      "Cuánto te queda de cada venta después de pagar lo que costó producir o entregar ese producto o servicio. Si el precio es $500 y el costo variable es $200, tu margen es $300 — ese dinero es el que cubre tus gastos fijos y genera utilidad.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo5_internacional.md",
  },
  {
    formulaId: "unit-economics.coca",
    toolId: "unit-economics",
    expression: "COCA = gastoEnMarketing ÷ clientesNuevos",
    humanName: "Costo de Adquisición de Cliente (COCA)",
    humanExplanation:
      "Cuánto te costó conseguir cada cliente nuevo en un período. Si gastaste $10,000 en marketing y conseguiste 50 clientes nuevos, cada cliente te costó $200. Comparar este número con el LTV te dice si tu modelo tiene sentido económico.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo5_internacional.md",
  },
  {
    formulaId: "unit-economics.ltv",
    toolId: "unit-economics",
    expression: "LTV = ticketPromedio × frecuenciaCompra × mesesRetencion",
    humanName: "Valor de Vida del Cliente (LTV)",
    humanExplanation:
      "Cuánto dinero te genera un cliente a lo largo de toda su relación contigo. Se calcula multiplicando cuánto compra cada vez, cuántas veces compra al mes, y cuántos meses en promedio se queda como cliente. Si LTV ÷ COCA < 3, estás gastando demasiado en adquisición.",
    sourceType: "excel-cell",
    sourceRef: "LCR LTV & COCA calculo.xlsm::Sheet1!C20",
  },
  {
    formulaId: "financing-options.effective-debt-cost",
    toolId: "financing-options",
    expression: "costoEfectivoTotal = ((intereses + comisiones + otrosCargos) ÷ capital) × 100",
    humanName: "Costo Efectivo Total del Financiamiento (%)",
    humanExplanation:
      "El verdadero porcentaje que pagas por un crédito, incluyendo intereses, comisiones y cualquier otro cargo. Un crédito con tasa del 12% pero con comisiones puede costar 18% real. Este número es el que debes comparar entre opciones — no la tasa nominal.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo8_internacional.md",
  },
  {
    formulaId: "debt-manager.debt-ratio",
    toolId: "debt-manager",
    expression: "ratioEndeudamiento = (deudaTotal ÷ activosTotales) × 100",
    humanName: "Ratio de Endeudamiento (%)",
    humanExplanation:
      "Qué porcentaje de tus activos totales está financiado con deuda. Si tienes activos por $1,000,000 y deudas por $600,000, tu ratio es 60%. Valores sobre 60–70% indican riesgo elevado; los bancos y acreedores usan este número para evaluar si prestar.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo8_internacional.md",
  },
  {
    formulaId: "debt-manager.interest-coverage",
    toolId: "debt-manager",
    expression: "coberturaIntereses = utilidadOperativa ÷ gastoIntereses",
    humanName: "Cobertura de Intereses (veces)",
    humanExplanation:
      "Cuántas veces puede tu utilidad operativa pagar los intereses que debes. Un resultado de 1.5 significa que ganas 1.5 veces lo que pagas en intereses. Un valor menor a 1.25 es señal de alerta: si bajan las ventas, podrías no poder pagar tu deuda.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo8_internacional.md",
  },
  {
    formulaId: "profitability.gross-margin",
    toolId: "profitability-analyzer",
    expression: "margenBruto = ((ventas − costoVentas) ÷ ventas) × 100",
    humanName: "Margen Bruto (%)",
    humanExplanation:
      "Del total de ventas, qué porcentaje queda después de pagar lo que costó producir o comprar lo que vendiste (sin contar gastos operativos como renta, sueldos de oficina, etc.). Un margen bruto alto significa que tienes espacio para cubrir gastos y generar utilidad.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo9_internacional.md",
  },
  {
    formulaId: "profitability.operating-margin",
    toolId: "profitability-analyzer",
    expression: "margenOperativo = ((ventas − costoVentas − gastosOperativos) ÷ ventas) × 100",
    humanName: "Margen Operativo (%)",
    humanExplanation:
      "Del total de ventas, qué queda después de pagar tanto los costos directos como todos los gastos operativos del negocio (renta, sueldos, marketing, etc.), pero antes de impuestos e intereses. Refleja la eficiencia real de operación del negocio.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo9_internacional.md",
  },
  {
    formulaId: "profitability.roi",
    toolId: "profitability-analyzer",
    expression: "ROI = (utilidadNeta ÷ inversion) × 100",
    humanName: "Retorno sobre la Inversión (ROI %)",
    humanExplanation:
      "Cuánto ganaste en términos porcentuales respecto a lo que invertiste. Si invertiste $100,000 y tu utilidad neta fue $25,000, tu ROI es 25%. Te permite comparar si fue mejor invertir en este negocio o en cualquier otra alternativa (banco, otro proyecto, etc.).",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo9_internacional.md",
  },
  {
    formulaId: "strategy.revenue-projection",
    toolId: "financial-strategy-planner",
    expression: "ingresosAnioN = ingresosActuales × (1 + tasaCrecimiento)^N",
    humanName: "Proyección de Ingresos (año Y)",
    humanExplanation:
      "Cuánto ingresarás en un año futuro si mantienes una tasa de crecimiento constante. Funciona como el interés compuesto: si hoy tienes $1,000,000 y creces 20% anual, en 3 años tendrás $1,728,000. El exponente 'N' es la cantidad de años proyectados.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo10_internacional.md",
  },
  {
    formulaId: "contingency.risk-score",
    toolId: "contingency-planner",
    expression: "puntajeRiesgo = probabilidad × impacto",
    humanName: "Puntuación de Riesgo (Matriz P×I)",
    humanExplanation:
      "Cómo priorizar riesgos: multiplicas qué tan probable es que ocurra (del 1 al 5) por qué tan grave sería su impacto (del 1 al 5). El resultado máximo es 25. Riesgos con score ≥ 15 requieren plan de respuesta inmediato; los de score ≤ 5 pueden monitorearse.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo11_internacional.md",
  },
  {
    formulaId: "education.training-roi",
    toolId: "financial-education-kit",
    expression: "ROICapacitacion = (mejoraBeneficio − costoCapacitacion) ÷ costoCapacitacion × 100",
    humanName: "ROI de Capacitación (%)",
    humanExplanation:
      "Cuánto retorno económico genera invertir en formación financiera. Si capacitar al equipo cuesta $5,000 y eso genera $15,000 en mejoras de eficiencia o reducción de errores, el ROI es 200%. Ayuda a justificar el gasto en educación como inversión, no como costo.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo12_internacional.md",
  },
  {
    formulaId: "investment.npv",
    toolId: "investment-evaluator",
    expression: "VPN = Σ(flujoAnioN ÷ (1 + tasa)^N) − inversionInicial",
    humanName: "Valor Presente Neto (NPV / VPN)",
    humanExplanation:
      "El valor actual de todos los flujos de caja futuros de una inversión, descontados por el costo del dinero en el tiempo (tasa 'r'), menos lo que inviertes hoy. Si el resultado es positivo, la inversión vale la pena — generarás más de lo que cuesta el dinero. Si es negativo, hay mejores alternativas.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo13_internacional.md",
  },
  {
    formulaId: "kpis.current-ratio",
    toolId: "kpis",
    expression: "razonLiquidez = activosCorrientes ÷ pasivosCorrientes",
    humanName: "Razón de Liquidez Corriente",
    humanExplanation:
      "Cuántos pesos tienes disponibles (o por cobrar en el corto plazo) por cada peso que debes pagar en los próximos 12 meses. Un resultado mayor a 1.5 es saludable. Si es menor a 1, significa que no tienes suficiente liquidez para cubrir tus obligaciones de corto plazo.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo14_internacional.md",
  },
  {
    formulaId: "international.fx-impact",
    toolId: "international-finance-manager",
    expression: "impactoFX = montoExtranjero × (tipoCambioReal − tipoCambioPlaneado)",
    humanName: "Impacto Cambiario (Ganancia/Pérdida FX)",
    humanExplanation:
      "Cuánto dinero ganas o pierdes por la diferencia entre el tipo de cambio que esperabas y el que ocurrió en realidad. Si planeaste cobrar $10,000 USD a $18/USD pero el dólar cayó a $17, perdiste $10,000 en pesos. Esta fórmula te ayuda a dimensionar tu exposición.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo16_internacional.md",
  },
  {
    formulaId: "fintech.tool-roi",
    toolId: "fintech-evaluator",
    expression: "ROIHerramienta = ((beneficioAnual − costoAnual) ÷ costoAnual) × 100",
    humanName: "ROI de Adopción de Herramienta Fintech (%)",
    humanExplanation:
      "Si vale la pena pagar por una solución tecnológica financiera. Compara el beneficio anual que aporta (ahorro de tiempo, reducción de errores, más clientes) contra lo que cuesta al año. Si el ROI es positivo y supera tu tasa mínima de retorno, la adopción tiene sentido.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo17_internacional.md",
  },
  {
    formulaId: "valuation.sales-multiple",
    toolId: "valuation-calculator",
    expression: "valorPorMultiplo = ventasAnuales × multiploDelSector",
    humanName: "Valuación por Múltiplo de Ventas",
    humanExplanation:
      "Una forma rápida de estimar el valor de tu empresa multiplicando tus ventas anuales por un factor estándar del sector (el múltiplo). Si tu sector se vende a 2× ventas y facturaste $5M, tu empresa vale ~$10M. Los múltiplos varían mucho por industria, tamaño y rentabilidad.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo18_internacional.md",
  },
  {
    formulaId: "resilience.runway",
    toolId: "resilience-evaluator",
    expression: "runway = efectivoDisponible ÷ gastoMensualPromedio",
    humanName: "Runway (Meses de Operación sin Ingresos)",
    humanExplanation:
      "Cuántos meses puede sobrevivir tu negocio usando solo el efectivo que tiene hoy, sin recibir ningún ingreso nuevo. Si tienes $300,000 en caja y gastas $50,000 al mes, tienes 6 meses de runway. Un runway mínimo saludable es 3 meses; lo ideal es 6 o más.",
    sourceType: "book-chapter",
    sourceRef: "elementos_estructurales/capitulo19_internacional.md",
  },
  {
    formulaId: "modelo-financiero.tir",
    toolId: "investment-evaluator",
    expression: "TIR = TasaQuéHaceVPN_Cero(serieFlujoDescontado)",
    humanName: "Tasa Interna de Retorno (TIR / IRR)",
    humanExplanation:
      "La tasa de descuento a la que el Valor Presente Neto de una inversión es exactamente cero. En términos simples: la rentabilidad anual que ofrece la inversión. Si la TIR (ej. 25%) supera tu costo de capital (ej. 15%), la inversión crea valor. Si la TIR < costo de capital, la destruye.",
    sourceType: "excel-cell",
    sourceRef: "Modelo Financiero Cafeteria.xlsm::Modelo Financiero!C8",
  },
  {
    formulaId: "lcr.discounted-profit",
    toolId: "unit-economics",
    expression: "utilidadDescontadaT = utilidadBrutaT ÷ (1 + tasa)^T",
    humanName: "Utilidad Bruta Descontada (Periodo T)",
    humanExplanation:
      "Cuánto vale hoy la utilidad bruta que generará un cliente en un período futuro. Un peso de utilidad que recibirás en 3 años vale menos que uno que recibirás hoy — esta fórmula aplica el descuento temporal. La suma de todos estos valores es el LTV descontado real del cliente.",
    sourceType: "excel-cell",
    sourceRef: "LCR LTV & COCA calculo.xlsm::Sheet1!C18:G18",
  },
];
