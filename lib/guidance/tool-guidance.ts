import { TOOL_IDS, type ToolId, type ToolStepId } from "@/lib/domain";

export type UnitHint = "monto" | "%" | "meses" | "anual" | "ratio" | "conteo";

export interface FieldGuide {
  fieldKey: string;
  whatIsIt: string;
  howToFill: string;
  example: string;
  unitHint?: UnitHint;
  commonMistake?: string;
}

export interface ResultGuide {
  resultKey: string;
  meaning: string;
  healthyRange?: string;
  warningRule?: string;
  nextAction: string;
}

export interface ToolGuideStep {
  id: ToolStepId;
  title: string;
  objective: string;
  fields: FieldGuide[];
  completionRule: string;
}

export interface ToolGuideSpec {
  toolId: ToolId;
  purpose: string;
  whenToUse: string;
  successSignal: string;
  steps: ToolGuideStep[];
  results: ResultGuide[];
}

interface ResolveGuideInput {
  toolId: ToolId;
  fieldKeys: string[];
  resultKeys: string[];
  fieldLabels?: Partial<Record<string, string>>;
}

const TOOL_PURPOSES: Record<ToolId, string> = {
  cashflow: "Controlar entradas y salidas para evitar quiebres de caja.",
  costs: "Entender la estructura de costos y gastos para proteger margen.",
  budget: "Comparar plan vs real para corregir a tiempo.",
  breakeven: "Calcular unidades minimas para cubrir costos fijos.",
  kpis: "Monitorear salud financiera integral con indicadores accionables.",
  "unit-economics": "Validar rentabilidad unitaria antes de escalar.",
  "financing-options": "Comparar alternativas de financiamiento por costo y control.",
  "debt-manager": "Optimizar deuda y cobertura de intereses.",
  "profitability-analyzer": "Medir margenes y retorno por segmento.",
  "financial-strategy-planner": "Proyectar estrategia financiera de mediano plazo.",
  "contingency-planner": "Preparar respuesta financiera para riesgos criticos.",
  "financial-education-kit": "Vincular formacion financiera con resultados del equipo.",
  "investment-evaluator": "Evaluar inversiones con criterios objetivos.",
  "business-model-analyzer": "Analizar KPI clave por modelo de negocio.",
  "international-finance-manager": "Medir impacto cambiario y definir cobertura/precio.",
  "fintech-evaluator": "Elegir tecnologia financiera por ajuste, ROI y riesgo de migracion.",
  "valuation-calculator": "Estimar rango de valuacion del negocio.",
  "resilience-evaluator": "Medir capacidad de resistir escenarios adversos.",
};

const CORE_OVERRIDES: Partial<Record<ToolId, Pick<ToolGuideSpec, "steps" | "results">>> = {
  cashflow: {
    steps: [
      {
        id: "cashflow-step-context",
        title: "Paso 1: Contexto base",
        objective: "Define saldo inicial para leer correctamente el cierre de caja.",
        completionRule: "Completa saldo inicial del mes.",
        fields: [
          {
            fieldKey: "startingBalance",
            whatIsIt: "Caja al inicio del mes.",
            howToFill: "Usa el saldo real final del mes anterior.",
            example: "125000",
            unitHint: "monto",
            commonMistake: "Usar saldo proyectado en lugar de real.",
          },
        ],
      },
      {
        id: "cashflow-step-capture",
        title: "Paso 2: Captura principal",
        objective: "Registra ingresos y egresos proyectados y reales.",
        completionRule: "Agrega al menos una linea de ingreso y una de egreso.",
        fields: [
          {
            fieldKey: "inflows",
            whatIsIt: "Entradas de dinero del mes.",
            howToFill: "Crea una linea por fuente de ingreso.",
            example: "Ventas tienda: 85000 / 79000",
          },
          {
            fieldKey: "outflows",
            whatIsIt: "Salidas de dinero del mes.",
            howToFill: "Separa costos directos y gastos operativos.",
            example: "Nomina: 30000 / 30000",
          },
        ],
      },
      {
        id: "cashflow-step-interpret",
        title: "Paso 3: Interpretacion y decision",
        objective: "Compara cierre proyectado vs real y corrige desviaciones.",
        completionRule: "Revisa cierre real y define una accion correctiva.",
        fields: [
          {
            fieldKey: "closing-balance",
            whatIsIt: "Resultado de caja al cierre.",
            howToFill: "No se captura; se interpreta en resultados.",
            example: "Cierre real >= 0",
          },
        ],
      },
    ],
    results: [
      {
        resultKey: "projectedEndingBalance",
        meaning: "Caja esperada al cierre.",
        warningRule: "Si es negativa, falta liquidez para operar.",
        nextAction: "Reprograma egresos no criticos y acelera cobranzas.",
      },
      {
        resultKey: "actualEndingBalance",
        meaning: "Caja real al cierre.",
        healthyRange: ">= 0",
        nextAction: "Ajusta el siguiente mes con base en la desviacion.",
      },
    ],
  },
  costs: {
    steps: [
      {
        id: "costs-step-context",
        title: "Paso 1: Contexto base",
        objective: "Define tipo de movimiento para analizar margen correctamente.",
        completionRule: "Completa fecha y tipo del movimiento.",
        fields: [
          {
            fieldKey: "date",
            whatIsIt: "Fecha real del movimiento.",
            howToFill: "Registra la fecha de pago/compra.",
            example: "2026-02-20",
          },
          {
            fieldKey: "type",
            whatIsIt: "Clasificacion del movimiento.",
            howToFill: "Selecciona costo fijo, variable o gasto.",
            example: "variable_cost",
          },
        ],
      },
      {
        id: "costs-step-capture",
        title: "Paso 2: Captura principal",
        objective: "Captura monto y descripcion para trazabilidad.",
        completionRule: "Registra monto, descripcion y categoria.",
        fields: [
          {
            fieldKey: "amount",
            whatIsIt: "Monto total del movimiento.",
            howToFill: "Ingresa valor exacto del comprobante.",
            example: "2450.50",
            unitHint: "monto",
          },
          {
            fieldKey: "description",
            whatIsIt: "Concepto del movimiento.",
            howToFill: "Describe que se pago o compro.",
            example: "Publicidad Meta semana 3",
          },
          {
            fieldKey: "category",
            whatIsIt: "Etiqueta para agrupar.",
            howToFill: "Usa categorias consistentes.",
            example: "marketing",
          },
        ],
      },
      {
        id: "costs-step-interpret",
        title: "Paso 3: Interpretacion y decision",
        objective: "Analiza composicion de costos para priorizar ajustes.",
        completionRule: "Detecta el tipo de salida con mayor peso.",
        fields: [
          {
            fieldKey: "distribution",
            whatIsIt: "Distribucion porcentual por tipo.",
            howToFill: "Se interpreta en grafico, no se captura.",
            example: "Costos variables 48%",
          },
        ],
      },
    ],
    results: [
      {
        resultKey: "overallTotal",
        meaning: "Total acumulado del periodo.",
        warningRule: "Si sube mas rapido que ventas, erosiona margen.",
        nextAction: "Reduce o renegocia el tipo de salida dominante.",
      },
    ],
  },
  budget: {
    steps: [
      {
        id: "budget-step-context",
        title: "Paso 1: Contexto base",
        objective: "Selecciona el ano y define lineas relevantes.",
        completionRule: "Define ano y lineas de ingreso/egreso.",
        fields: [
          {
            fieldKey: "year",
            whatIsIt: "Ano presupuestal.",
            howToFill: "Usa el ano fiscal vigente.",
            example: "2026",
          },
          {
            fieldKey: "incomeLines",
            whatIsIt: "Fuentes de ingreso a seguir.",
            howToFill: "Una linea por fuente principal.",
            example: "Ventas B2B",
          },
          {
            fieldKey: "expenseLines",
            whatIsIt: "Lineas de egreso a controlar.",
            howToFill: "Incluye costos directos y operativos.",
            example: "Costos directos",
          },
        ],
      },
      {
        id: "budget-step-capture",
        title: "Paso 2: Captura principal",
        objective: "Carga plan y real por mes.",
        completionRule: "Completa al menos un mes en plan y real.",
        fields: [
          {
            fieldKey: "plannedByMonth",
            whatIsIt: "Monto objetivo mensual.",
            howToFill: "Define meta realista por mes.",
            example: "Enero: 120000",
            unitHint: "monto",
          },
          {
            fieldKey: "actualByMonth",
            whatIsIt: "Monto ejecutado mensual.",
            howToFill: "Registra el cierre real del mes.",
            example: "Enero: 114500",
            unitHint: "monto",
          },
        ],
      },
      {
        id: "budget-step-interpret",
        title: "Paso 3: Interpretacion y decision",
        objective: "Detecta variaciones y define acciones correctivas.",
        completionRule: "Identifica una variacion critica con accion asociada.",
        fields: [
          {
            fieldKey: "variance",
            whatIsIt: "Diferencia entre plan y real.",
            howToFill: "Se interpreta en resumen de variaciones.",
            example: "-5500 en ingresos de enero",
          },
        ],
      },
    ],
    results: [
      {
        resultKey: "netVariance",
        meaning: "Brecha neta del presupuesto.",
        warningRule: "Negativa y recurrente implica ajuste inmediato.",
        nextAction: "Corrige precio, costo o gasto del mes actual.",
      },
    ],
  },
  breakeven: {
    steps: [
      {
        id: "breakeven-step-context",
        title: "Paso 1: Contexto base",
        objective: "Define costos fijos y margenes unitarios base.",
        completionRule: "Completa costos fijos, precio y costo variable.",
        fields: [
          {
            fieldKey: "fixedCosts",
            whatIsIt: "Costos que existen aunque no vendas.",
            howToFill: "Suma renta, nomina fija y servicios.",
            example: "95000",
            unitHint: "monto",
          },
          {
            fieldKey: "singleProduct.price",
            whatIsIt: "Precio unitario promedio.",
            howToFill: "Usa precio real de venta.",
            example: "350",
            unitHint: "monto",
          },
          {
            fieldKey: "singleProduct.variableCost",
            whatIsIt: "Costo variable por unidad.",
            howToFill: "Incluye solo costos que varian con la venta.",
            example: "140",
            unitHint: "monto",
          },
        ],
      },
      {
        id: "breakeven-step-capture",
        title: "Paso 2: Captura principal",
        objective: "Modela mezcla de productos y escenarios.",
        completionRule: "Completa mix o crea al menos un escenario.",
        fields: [
          {
            fieldKey: "multiProduct.products",
            whatIsIt: "Productos y participacion en ventas.",
            howToFill: "Define nombre, precio, costo y mix.",
            example: "A 60%, B 40%",
          },
          {
            fieldKey: "scenarios",
            whatIsIt: "Simulaciones de cambios de costo/precio.",
            howToFill: "Crea escenario base, optimista y pesimista.",
            example: "Precio -5%, costo +8%",
          },
        ],
      },
      {
        id: "breakeven-step-interpret",
        title: "Paso 3: Interpretacion y decision",
        objective: "Valida si existe equilibrio sostenible.",
        completionRule: "Confirma unidades de equilibrio y margen positivo.",
        fields: [
          {
            fieldKey: "units",
            whatIsIt: "Unidades minimas para cubrir costos.",
            howToFill: "Se interpreta en resultados.",
            example: "450 unidades",
          },
        ],
      },
    ],
    results: [
      {
        resultKey: "units",
        meaning: "Minimo de unidades para no perder dinero.",
        warningRule: "Sin margen positivo no hay equilibrio.",
        nextAction: "Ajusta precio o costo variable antes de escalar.",
      },
    ],
  },
  kpis: {
    steps: [
      {
        id: "kpis-step-context",
        title: "Paso 1: Contexto base",
        objective: "Verifica que las fuentes de datos esten actualizadas.",
        completionRule: "Actualiza flujo, costos y presupuesto del periodo.",
        fields: [
          {
            fieldKey: "source-cashflow",
            whatIsIt: "Fuente de flujo de caja.",
            howToFill: "Revisa que exista al menos un mes real actualizado.",
            example: "Mes corriente con datos reales",
          },
          {
            fieldKey: "source-costs",
            whatIsIt: "Fuente de costos y gastos.",
            howToFill: "Registra movimientos clasificados del periodo.",
            example: ">= 3 movimientos reales",
          },
          {
            fieldKey: "source-budget",
            whatIsIt: "Fuente de presupuesto.",
            howToFill: "Carga plan y real del ano activo.",
            example: "Plan/real actualizado al ultimo mes",
          },
        ],
      },
      {
        id: "kpis-step-capture",
        title: "Paso 2: Lectura principal",
        objective: "Revisa indicadores financieros y de liquidez.",
        completionRule: "Evalua margenes y liquidez al menos una vez por cierre.",
        fields: [
          {
            fieldKey: "grossMargin",
            whatIsIt: "Margen bruto del negocio.",
            howToFill: "Se calcula automatico; valida tendencia.",
            example: ">= 40% segun modelo",
            unitHint: "%",
          },
          {
            fieldKey: "runwayMonths",
            whatIsIt: "Meses de caja disponible.",
            howToFill: "Se calcula automatico con caja y burn.",
            example: ">= 6 meses",
            unitHint: "meses",
          },
        ],
      },
      {
        id: "kpis-step-interpret",
        title: "Paso 3: Interpretacion y decision",
        objective: "Cruza indicadores para tomar acciones concretas.",
        completionRule: "Define una accion por KPI en alerta.",
        fields: [
          {
            fieldKey: "kpi-thresholds",
            whatIsIt: "Umbrales de referencia.",
            howToFill: "Compara valor actual contra rango saludable.",
            example: "LTV/CAC >= 3",
          },
        ],
      },
    ],
    results: [
      {
        resultKey: "margins.grossMargin",
        meaning: "Rentabilidad antes de gastos operativos.",
        nextAction: "Si baja, ajusta costo directo o precio.",
      },
      {
        resultKey: "margins.netMargin",
        meaning: "Rentabilidad final del periodo.",
        nextAction: "Si baja, recorta gasto improductivo y mejora conversion.",
      },
      {
        resultKey: "runwayMonths",
        meaning: "Meses de supervivencia con caja actual.",
        healthyRange: ">= 6 meses",
        nextAction: "Si es bajo, activa plan de liquidez inmediato.",
      },
    ],
  },
};

function toTitle(value: string): string {
  return value
    .replace(/\./g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .trim();
}

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

type FieldGuideTemplate = Omit<FieldGuide, "fieldKey">;
type ResultGuideTemplate = Omit<ResultGuide, "resultKey">;

const TOOL_WHEN_TO_USE: Record<ToolId, string> = {
  cashflow: "Usala en cierre semanal o mensual para anticipar faltantes de caja.",
  costs: "Usala cada semana para clasificar gastos y proteger margen.",
  budget: "Usala en cada cierre mensual para comparar plan contra realidad.",
  breakeven: "Usala antes de lanzar o ajustar precios para validar sostenibilidad.",
  kpis: "Usala al cierre para revisar salud financiera integral y actuar rapido.",
  "unit-economics":
    "Usala antes de escalar ventas; primero valida que cada cliente deje valor.",
  "financing-options":
    "Usala cuando necesites capital y quieras comparar costo real, control y riesgo.",
  "debt-manager":
    "Usala al renegociar deuda o cuando sube el costo financiero de la empresa.",
  "profitability-analyzer":
    "Usala en cierres mensuales para detectar que segmento gana y cual destruye margen.",
  "financial-strategy-planner":
    "Usala en planeacion trimestral o anual para alinear metas, crecimiento y capital.",
  "contingency-planner":
    "Usala antes de una crisis para definir reservas, responsables y tiempos de respuesta.",
  "financial-education-kit":
    "Usala al formar equipo para vincular capacitacion financiera con resultados reales.",
  "investment-evaluator":
    "Usala antes de invertir para priorizar proyectos por retorno, riesgo y recuperacion.",
  "business-model-analyzer":
    "Usala al ajustar estrategia comercial segun tu modelo de negocio.",
  "international-finance-manager":
    "Usala cuando operes con moneda extranjera y necesites controlar riesgo cambiario.",
  "fintech-evaluator":
    "Usala al elegir tecnologia financiera para evitar comprar por moda y no por necesidad.",
  "valuation-calculator":
    "Usala para estimar valor del negocio con varios metodos, no con un solo numero.",
  "resilience-evaluator":
    "Usala para medir si tu empresa resiste caidas de ventas y eventos imprevistos.",
};

const TOOL_SUCCESS_SIGNALS: Record<ToolId, string> = {
  cashflow: "Sabes si faltara caja y ya definiste accion concreta para corregirlo.",
  costs: "Identificaste en que rubro actuar primero para mejorar rentabilidad.",
  budget: "Puedes explicar las variaciones y su plan de correccion.",
  breakeven: "Conoces cuantas unidades necesitas vender sin perder dinero.",
  kpis: "Tienes KPI en alerta con accion y responsable definidos.",
  "unit-economics":
    "Tu relacion LTV/COCA y tiempo de recuperacion justifican crecimiento.",
  "financing-options":
    "Elegiste una opcion de financiamiento por criterio, no por intuicion.",
  "debt-manager": "Priorizaste pagos y evaluaste si refinanciar baja costo total.",
  "profitability-analyzer":
    "Detectaste que producto o segmento requiere ajuste de precio o costo.",
  "financial-strategy-planner":
    "Tu proyeccion cumple metas y respeta limite de deuda definido.",
  "contingency-planner":
    "Tu riesgo critico tiene trigger, responsable y fondo de emergencia suficiente.",
  "financial-education-kit":
    "Puedes medir si la capacitacion esta mejorando resultados operativos.",
  "investment-evaluator":
    "Decides con ROI, VAN y periodo de recuperacion, no solo con percepcion.",
  "business-model-analyzer":
    "Conoces el KPI palanca de tu modelo y la brecha contra objetivo.",
  "international-finance-manager":
    "Tienes claro el impacto cambiario y el precio recomendado con buffer.",
  "fintech-evaluator":
    "Seleccionaste herramienta por ajuste, retorno y riesgo de migracion.",
  "valuation-calculator":
    "Obtuviste un rango de valor coherente y defendible con supuestos claros.",
  "resilience-evaluator":
    "Conoces tu runway, reserva objetivo y nivel real de resiliencia.",
};

const FIELD_GUIDE_BY_KEY: Record<string, FieldGuideTemplate> = {
  ebit: {
    whatIsIt:
      "Ganancia operativa antes de intereses e impuestos. Mide si la operacion genera resultado por si sola.",
    howToFill:
      "Toma el dato del estado de resultados del mismo periodo: ventas menos costos y gastos operativos.",
    example: "Si vendes 300000 y tus costos/gastos operativos son 240000, EBIT = 60000.",
    unitHint: "monto",
    commonMistake: "Usar utilidad neta en lugar de EBIT.",
  },
  ebitda: {
    whatIsIt:
      "Resultado operativo antes de intereses, impuestos, depreciacion y amortizacion.",
    howToFill:
      "Usa el EBITDA real del periodo o calculalo desde tu estado financiero.",
    example: "EBITDA anual: 1250000.",
    unitHint: "monto",
    commonMistake: "Confundir EBITDA con flujo de caja disponible.",
  },
  marketingsales: {
    whatIsIt:
      "Inversion en marketing y ventas del periodo para conseguir clientes nuevos.",
    howToFill:
      "Incluye anuncios, comisiones y costos comerciales directamente ligados a adquisicion.",
    example: "Publicidad y comisiones: 38000 en el mes.",
    unitHint: "monto",
    commonMistake: "Sumar gastos administrativos que no adquieren clientes.",
  },
  price: {
    whatIsIt: "Precio promedio de venta por unidad.",
    howToFill: "Usa el precio real que cobras hoy, sin promociones excepcionales.",
    example: "250",
    unitHint: "monto",
    commonMistake: "Usar precio de lista cuando vendes casi siempre con descuento.",
  },
  variablecost: {
    whatIsIt: "Costo variable por unidad vendida.",
    howToFill:
      "Incluye solo costos que cambian al vender una unidad (insumo, comision, envio variable).",
    example: "110",
    unitHint: "monto",
    commonMistake: "Meter costos fijos como renta o sueldos administrativos.",
  },
  avgticket: {
    whatIsIt: "Monto promedio que compra cada cliente por transaccion.",
    howToFill: "Calculalo con ventas del periodo dividido entre numero de compras.",
    example: "380",
    unitHint: "monto",
  },
  purchasefrequency: {
    whatIsIt: "Veces que un cliente promedio compra en un periodo.",
    howToFill: "Usa historial real de recompra (por mes o por ano, pero se consistente).",
    example: "1.8",
    unitHint: "ratio",
    commonMistake: "Cambiar de periodo sin ajustar el resto de supuestos.",
  },
  retentionperiod: {
    whatIsIt: "Tiempo promedio que un cliente permanece activo.",
    howToFill: "Captura meses reales de permanencia promedio de clientes.",
    example: "12",
    unitHint: "meses",
  },
  newcustomers: {
    whatIsIt: "Numero de clientes nuevos del periodo.",
    howToFill: "Cuenta solo clientes adquiridos en ese periodo, sin duplicados.",
    example: "45 clientes nuevos en marzo.",
    unitHint: "conteo",
    commonMistake: "Incluir clientes recurrentes como nuevos.",
  },
  ltv: {
    whatIsIt: "Valor total que te deja un cliente durante su relacion con tu negocio.",
    howToFill:
      "Si tienes historial confiable, usa tu LTV observado. Si no, estima con ticket, frecuencia y retencion.",
    example: "LTV estimado: 7200.",
    unitHint: "monto",
  },
  discountratepct: {
    whatIsIt: "Tasa para traer flujos futuros a valor presente.",
    howToFill:
      "Usa una tasa anual conservadora (por defecto 11%) y ajustala segun riesgo del negocio.",
    example: "11",
    unitHint: "%",
    commonMistake: "Usar 0% y sobrevalorar resultados futuros.",
  },
  annualratepct: {
    whatIsIt: "Tasa nominal anual del financiamiento.",
    howToFill: "Escribe la tasa pactada con la entidad financiera.",
    example: "24",
    unitHint: "%",
  },
  equityofferedpct: {
    whatIsIt: "Porcentaje de participacion accionaria que cederias.",
    howToFill: "Ingresa el porcentaje ofrecido a inversionistas.",
    example: "12",
    unitHint: "%",
    commonMistake: "Subestimar el impacto de ceder participacion en decisiones futuras.",
  },
  controlscore: {
    whatIsIt: "Puntaje de control que conservarias con la opcion elegida.",
    howToFill: "Califica de 0 a 100 (100 = control alto).",
    example: "80",
    unitHint: "conteo",
  },
  riskscore: {
    whatIsIt: "Puntaje de riesgo de la opcion evaluada.",
    howToFill: "Califica de 0 a 100 (100 = riesgo alto).",
    example: "55",
    unitHint: "conteo",
  },
  flexibilityscore: {
    whatIsIt: "Puntaje de flexibilidad para adaptarte a cambios.",
    howToFill: "Califica de 0 a 100 segun posibilidad de renegociar o ajustar terminos.",
    example: "70",
    unitHint: "conteo",
  },
  debtpct: {
    whatIsIt: "Porcentaje de estructura de capital que proviene de deuda.",
    howToFill: "Define el mix objetivo deuda-capital de tu plan.",
    example: "35",
    unitHint: "%",
  },
  maxdebtpct: {
    whatIsIt: "Limite maximo de deuda permitido en tu estrategia.",
    howToFill: "Fija un tope prudente segun capacidad de pago.",
    example: "40",
    unitHint: "%",
  },
  probabilitypct: {
    whatIsIt: "Probabilidad estimada de que ocurra un riesgo.",
    howToFill: "Asigna un porcentaje realista con base en tu contexto.",
    example: "30",
    unitHint: "%",
  },
  impactpct: {
    whatIsIt: "Impacto financiero estimado si el riesgo ocurre.",
    howToFill: "Define el porcentaje de afectacion esperado sobre ingresos o margen.",
    example: "25",
    unitHint: "%",
  },
  reservebalance: {
    whatIsIt: "Caja reservada hoy para emergencias.",
    howToFill: "Ingresa solo recursos liquidos y realmente disponibles.",
    example: "180000",
    unitHint: "monto",
  },
  monthlyfixedoutflow: {
    whatIsIt: "Salidas fijas mensuales que debes cubrir aun en crisis.",
    howToFill: "Suma nomina fija, renta, servicios y otros compromisos ineludibles.",
    example: "95000",
    unitHint: "monto",
  },
  reservemonths: {
    whatIsIt: "Meses objetivo que quieres cubrir con tu fondo de emergencia.",
    howToFill: "Define meta segun riesgo del negocio (comunmente 3 a 6 meses).",
    example: "6",
    unitHint: "meses",
  },
  burn: {
    whatIsIt: "Consumo de caja del periodo.",
    howToFill: "Usa el flujo neto negativo mensual real.",
    example: "42000",
    unitHint: "monto",
  },
  monthlyburn: {
    whatIsIt: "Consumo mensual de caja de tu operacion.",
    howToFill: "Ingresa cuanto efectivo neto pierdes al mes cuando hay quema.",
    example: "48000",
    unitHint: "monto",
  },
  availablecash: {
    whatIsIt: "Efectivo disponible para operar de inmediato.",
    howToFill: "Incluye caja y bancos de libre disposicion.",
    example: "320000",
    unitHint: "monto",
  },
  churnpct: {
    whatIsIt: "Porcentaje de clientes que se van en un periodo.",
    howToFill: "Calculalo sobre la base de clientes activos del mismo periodo.",
    example: "4.5",
    unitHint: "%",
  },
  fxriskbufferpct: {
    whatIsIt: "Colchon de precio para protegerte ante variaciones del tipo de cambio.",
    howToFill: "Define un porcentaje prudente segun volatilidad historica de la moneda.",
    example: "8",
    unitHint: "%",
  },
  annualebitda: {
    whatIsIt: "EBITDA acumulado del ultimo ano.",
    howToFill: "Usa el dato anual auditado o cierre confiable de 12 meses.",
    example: "2400000",
    unitHint: "monto",
  },
  terminalvalue: {
    whatIsIt: "Valor residual esperado al final del horizonte de proyeccion.",
    howToFill: "Usa un supuesto conservador y consistente con crecimiento de largo plazo.",
    example: "3200000",
    unitHint: "monto",
    commonMistake: "Inflarlo sin justificar con crecimiento sostenible.",
  },
};

function inferUnitHint(fieldKey: string): UnitHint | undefined {
  const normalized = normalizeKey(fieldKey);
  if (normalized.includes("pct") || normalized.includes("margin") || normalized.includes("ratio")) {
    return "%";
  }
  if (
    normalized.includes("month") ||
    normalized.includes("months") ||
    normalized.includes("year") ||
    normalized.includes("years") ||
    normalized.includes("period") ||
    normalized.includes("term") ||
    normalized.includes("horizon") ||
    normalized.includes("runway")
  ) {
    return "meses";
  }
  if (
    normalized.includes("count") ||
    normalized.includes("customers") ||
    normalized.includes("modules") ||
    normalized.includes("score")
  ) {
    return "conteo";
  }
  if (
    normalized.includes("amount") ||
    normalized.includes("cost") ||
    normalized.includes("expense") ||
    normalized.includes("price") ||
    normalized.includes("cash") ||
    normalized.includes("sales") ||
    normalized.includes("revenue") ||
    normalized.includes("assets") ||
    normalized.includes("liabilities") ||
    normalized.includes("debt") ||
    normalized.includes("investment") ||
    normalized.includes("balance") ||
    normalized.includes("benefit") ||
    normalized.includes("value")
  ) {
    return "monto";
  }
  return undefined;
}

function buildFieldGuideFromHeuristic(fieldKey: string, fieldLabel?: string): FieldGuideTemplate {
  const normalized = normalizeKey(fieldKey);
  const title = fieldLabel?.trim() ? fieldLabel : toTitle(fieldKey);
  const unitHint = inferUnitHint(fieldKey);

  if (normalized.includes("pct") || normalized.includes("rate")) {
    return {
      whatIsIt: `${title} expresado en porcentaje para medir comportamiento o riesgo.`,
      howToFill: "Ingresa un porcentaje real del periodo (sin inflarlo para que el resultado se vea mejor).",
      example: "12.5",
      unitHint: "%",
      commonMistake: "Capturar 0.125 cuando el campo espera 12.5.",
    };
  }

  if (normalized.includes("score")) {
    return {
      whatIsIt: `${title} en escala comparativa para priorizar decisiones.`,
      howToFill: "Asigna un puntaje consistente (0 a 100) usando el mismo criterio entre opciones.",
      example: "72",
      unitHint: "conteo",
      commonMistake: "Cambiar la escala entre una opcion y otra.",
    };
  }

  if (normalized.includes("month") || normalized.includes("year") || normalized.includes("period")) {
    return {
      whatIsIt: `${title} como horizonte temporal del analisis.`,
      howToFill: "Captura el numero real de meses o anos que quieres evaluar.",
      example: "12",
      unitHint: "meses",
    };
  }

  return {
    whatIsIt: `${title} dentro del calculo principal de esta herramienta.`,
    howToFill:
      "Usa datos reales de operacion reciente o cierre contable del mismo periodo.",
    example: unitHint === "monto" ? "150000" : "Dato real del periodo",
    unitHint,
    commonMistake: "Mezclar periodos distintos y distorsionar la interpretacion.",
  };
}

function resolveFieldGuide(fieldKey: string, fieldLabels?: Partial<Record<string, string>>): FieldGuideTemplate {
  const normalized = normalizeKey(fieldKey);
  return FIELD_GUIDE_BY_KEY[normalized] ?? buildFieldGuideFromHeuristic(fieldKey, fieldLabels?.[fieldKey]);
}

function asGuides(fieldKeys: string[], fieldLabels?: Partial<Record<string, string>>): FieldGuide[] {
  return fieldKeys.map((fieldKey) => ({
    fieldKey,
    ...resolveFieldGuide(fieldKey, fieldLabels),
  }));
}

function splitIntoSteps(fieldKeys: string[]): [string[], string[], string[]] {
  if (fieldKeys.length === 0) {
    return [[], [], []];
  }

  const minPerStep = Math.ceil(fieldKeys.length / 3);
  const step1 = fieldKeys.slice(0, minPerStep);
  const step2 = fieldKeys.slice(minPerStep, minPerStep * 2);
  const step3 = fieldKeys.slice(minPerStep * 2);

  return [step1, step2, step3];
}

function buildGenericGuide(
  toolId: ToolId,
  fieldKeys: string[],
  resultKeys: string[],
  fieldLabels?: Partial<Record<string, string>>,
): ToolGuideSpec {
  const [step1, step2, step3] = splitIntoSteps(fieldKeys);
  const purpose = TOOL_PURPOSES[toolId];

  return {
    toolId,
    purpose,
    whenToUse: TOOL_WHEN_TO_USE[toolId],
    successSignal: TOOL_SUCCESS_SIGNALS[toolId],
    steps: [
      {
        id: `${toolId}-step-context`,
        title: "Paso 1: Contexto base",
        objective: "Define variables base de la herramienta.",
        fields: asGuides(step1, fieldLabels),
        completionRule: "Completa las variables base del paso.",
      },
      {
        id: `${toolId}-step-capture`,
        title: "Paso 2: Captura principal",
        objective: "Carga datos operativos del periodo.",
        fields: asGuides(step2, fieldLabels),
        completionRule: "Completa las variables operativas del paso.",
      },
      {
        id: `${toolId}-step-interpret`,
        title: "Paso 3: Interpretacion y decision",
        objective: "Interpreta resultados y define accion.",
        fields: asGuides(step3.length > 0 ? step3 : resultKeys, fieldLabels),
        completionRule: "Revisa al menos un resultado y define una accion.",
      },
    ],
    results: resultKeys.map((resultKey) => ({
      resultKey,
      ...resolveResultGuide(resultKey),
    })),
  };
}

const RESULT_GUIDE_BY_KEY: Record<string, ResultGuideTemplate> = {
  margendecontribucion: {
    meaning: "Cuanto dinero te deja cada venta para cubrir estructura y utilidad.",
    healthyRange: "Mientras mas alto, mejor.",
    nextAction: "Si es bajo, ajusta precio, costo variable o mezcla de producto.",
  },
  coca: {
    meaning: "Costo promedio para conseguir un cliente nuevo.",
    healthyRange: "Debe recuperar con margen en pocos meses.",
    nextAction: "Si sube, mejora conversion comercial y canales de captacion.",
  },
  ltv: {
    meaning: "Valor economico que aporta un cliente durante su relacion contigo.",
    nextAction: "Si es bajo, trabaja retencion, frecuencia y ticket promedio.",
  },
  uniteconomics: {
    meaning: "Resultado unitario despues de restar el costo de adquirir cliente al margen de contribucion.",
    warningRule: "Si es negativo, crecer mas solo acelera la perdida.",
    nextAction: "Corrige precio, costo variable o adquisicion antes de escalar.",
  },
  ltvcoca: {
    meaning: "Relacion entre valor generado por cliente y costo de adquisicion.",
    healthyRange: ">= 3",
    warningRule: "Menor a 1 indica perdida por adquisicion.",
    nextAction: "No escales hasta mejorar margen, retencion o costo de captacion.",
  },
  paybackmeses: {
    meaning: "Meses que tardas en recuperar lo invertido para adquirir cliente.",
    healthyRange: "Menor es mejor.",
    nextAction: "Si es largo, reduce costo de adquisicion o sube margen por cliente.",
  },
  ratiodedeuda: {
    meaning: "Porcentaje de activos financiados con deuda.",
    healthyRange: "< 40%",
    nextAction: "Si sube demasiado, baja apalancamiento o fortalece capital propio.",
  },
  coberturadeintereses: {
    meaning: "Cuantas veces tu operacion cubre el pago de intereses.",
    healthyRange: "> 3",
    warningRule: "Si cae por debajo de 1, hay riesgo de incumplimiento.",
    nextAction: "Renegocia deuda, reduce costos o mejora utilidad operativa.",
  },
  margenneto: {
    meaning: "Porcentaje final de utilidad despues de todos los costos y gastos.",
    nextAction: "Si baja, revisa precio, eficiencia operativa y gastos no esenciales.",
  },
  margenbruto: {
    meaning: "Porcentaje que queda despues de costos directos de venta.",
    nextAction: "Si se contrae, revisa costo unitario y estrategia de precio.",
  },
  margenoperativo: {
    meaning: "Rentabilidad antes de impuestos e intereses.",
    nextAction: "Si cae, corrige gastos operativos y eficiencia del proceso.",
  },
  roi: {
    meaning: "Retorno obtenido sobre la inversion realizada.",
    nextAction: "Prioriza iniciativas con mayor retorno ajustado por riesgo.",
  },
  van: {
    meaning: "Valor actual neto de la inversion descontando costo de capital.",
    healthyRange: "> 0",
    nextAction: "Si es negativo, replantea monto, horizonte o beneficios esperados.",
  },
  npv: {
    meaning: "Valor actual neto de la inversion descontando costo de capital.",
    healthyRange: "> 0",
    nextAction: "Si es negativo, replantea monto, horizonte o beneficios esperados.",
  },
  tir: {
    meaning: "Tasa interna de retorno del proyecto.",
    nextAction: "Comparala contra tu tasa minima aceptable para decidir.",
  },
  irr: {
    meaning: "Tasa interna de retorno del proyecto.",
    nextAction: "Comparala contra tu tasa minima aceptable para decidir.",
  },
  runwaymeses: {
    meaning: "Meses de operacion que puedes sostener con la caja disponible.",
    healthyRange: ">= 6 meses",
    nextAction: "Si es bajo, activa plan de liquidez y ajuste de gasto.",
  },
  valordcf: {
    meaning: "Valor del negocio por flujos descontados.",
    nextAction: "Usalo junto con otros metodos para definir un rango de valor.",
  },
  vallibro: {
    meaning: "Valor contable neto (activos menos pasivos).",
    nextAction: "Contrastalo con metodos por multiples y flujo para contexto completo.",
  },
  gap: {
    meaning: "Brecha entre valor actual y objetivo.",
    nextAction: "Cierra la brecha con un plan de acciones medibles y fecha.",
  },
};

function buildResultGuideFromHeuristic(resultKey: string): ResultGuideTemplate {
  const normalized = normalizeKey(resultKey);
  const title = toTitle(resultKey);

  if (normalized.includes("score") || normalized.includes("puntaje")) {
    return {
      meaning: `${title} resume la evaluacion comparativa del escenario.`,
      nextAction: "Prioriza acciones en la variable con menor puntaje.",
    };
  }

  if (normalized.includes("margen") || normalized.includes("margin")) {
    return {
      meaning: `${title} muestra rentabilidad del negocio en el periodo evaluado.`,
      nextAction: "Si baja, revisa precio, costo y gasto del periodo.",
    };
  }

  if (normalized.includes("cobertura") || normalized.includes("runway")) {
    return {
      meaning: `${title} mide capacidad de resistencia financiera en el corto plazo.`,
      nextAction: "Define plan de liquidez si cae por debajo de tu umbral.",
    };
  }

  if (
    normalized.includes("costo") ||
    normalized.includes("valor") ||
    normalized.includes("impacto") ||
    normalized.includes("pago") ||
    normalized.includes("delta")
  ) {
    return {
      meaning: `${title} cuantifica el efecto economico del escenario evaluado.`,
      nextAction: "Usa este dato para comparar alternativas y tomar una decision.",
    };
  }

  return {
    meaning: `${title} resume el resultado principal de la herramienta.`,
    nextAction: "Si no cumple tu objetivo, ajusta supuestos y vuelve a simular.",
  };
}

function resolveResultGuide(resultKey: string): ResultGuideTemplate {
  const normalized = normalizeKey(resultKey);
  return RESULT_GUIDE_BY_KEY[normalized] ?? buildResultGuideFromHeuristic(resultKey);
}

export function resolveToolGuideSpec(input: ResolveGuideInput): ToolGuideSpec {
  const override = CORE_OVERRIDES[input.toolId];
  if (override) {
    return {
      toolId: input.toolId,
      purpose: TOOL_PURPOSES[input.toolId],
      whenToUse: TOOL_WHEN_TO_USE[input.toolId],
      successSignal: TOOL_SUCCESS_SIGNALS[input.toolId],
      steps: override.steps,
      results: override.results,
    };
  }

  return buildGenericGuide(input.toolId, input.fieldKeys, input.resultKeys, input.fieldLabels);
}

export function getAllToolIdsWithGuidance(): ToolId[] {
  return TOOL_IDS;
}

export function getDefaultStepId(spec: ToolGuideSpec): ToolStepId {
  return spec.steps[0]?.id ?? `${spec.toolId}-step-context`;
}

export function getStepById(spec: ToolGuideSpec, stepId: string): ToolGuideStep | null {
  return spec.steps.find((step) => step.id === stepId) ?? null;
}

export function getNextStepId(spec: ToolGuideSpec, stepId: string): ToolStepId {
  const index = spec.steps.findIndex((step) => step.id === stepId);
  if (index < 0 || index >= spec.steps.length - 1) {
    return stepId;
  }
  return spec.steps[index + 1].id;
}

export function getFieldGuide(spec: ToolGuideSpec, fieldKey: string): FieldGuide | null {
  for (const step of spec.steps) {
    const match = step.fields.find((field) => field.fieldKey === fieldKey);
    if (match) {
      return match;
    }
  }
  return null;
}

export function getResultGuide(spec: ToolGuideSpec, resultKey: string): ResultGuide | null {
  return spec.results.find((result) => result.resultKey === resultKey) ?? null;
}
