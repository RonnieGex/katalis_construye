export interface GlossaryTerm {
  key: string;
  shortLabel: string;
  displayLabel: string;
  description: string;
  aliases?: string[];
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    key: "roi",
    shortLabel: "ROI",
    displayLabel: "ROI (Retorno sobre inversión)",
    description: "Mide cuánto ganas respecto a lo que invertiste.",
  },
  {
    key: "roa",
    shortLabel: "ROA",
    displayLabel: "ROA (Retorno sobre activos)",
    description: "Mide qué tan bien conviertes activos en utilidad.",
  },
  {
    key: "ltv",
    shortLabel: "LTV",
    displayLabel: "LTV (Valor de vida del cliente)",
    description: "Ingresos esperados por cliente durante toda su relación.",
  },
  {
    key: "cac",
    shortLabel: "CAC",
    displayLabel: "COCA/CAC (Costo de adquisición de cliente)",
    description: "Costo promedio para conseguir un cliente nuevo.",
    aliases: ["COCA"],
  },
  {
    key: "ebit",
    shortLabel: "EBIT",
    displayLabel: "EBIT (Utilidad operativa antes de intereses e impuestos)",
    description:
      "Ganancia operativa del período antes de gastos financieros e impuestos.",
  },
  {
    key: "npv",
    shortLabel: "NPV",
    displayLabel: "VAN (NPV)",
    description: "Valor actual de los flujos descontados menos inversión inicial.",
    aliases: ["VAN"],
  },
  {
    key: "irr",
    shortLabel: "IRR",
    displayLabel: "TIR (IRR)",
    description: "Tasa que hace que el VAN sea cero.",
    aliases: ["TIR"],
  },
  {
    key: "ebitda",
    shortLabel: "EBITDA",
    displayLabel: "EBITDA (Flujo operativo)",
    description: "Resultado operativo antes de intereses, impuestos y depreciaciones.",
  },
  {
    key: "runway",
    shortLabel: "Runway",
    displayLabel: "Runway (Meses de caja)",
    description: "Meses que puedes operar con la caja disponible.",
  },
  {
    key: "burn",
    shortLabel: "Burn",
    displayLabel: "Burn (Consumo mensual de caja)",
    description: "Efectivo que consume la empresa cada mes.",
  },
  {
    key: "gross-margin",
    shortLabel: "Margen bruto",
    displayLabel: "Margen bruto",
    description: "Porcentaje que queda después de costos directos.",
  },
  {
    key: "net-margin",
    shortLabel: "Margen neto",
    displayLabel: "Margen neto",
    description: "Porcentaje de utilidad final sobre ventas.",
  },
];

const TERM_LOOKUP = new Map<string, GlossaryTerm>();
for (const term of GLOSSARY_TERMS) {
  TERM_LOOKUP.set(term.shortLabel.toLowerCase(), term);
  for (const alias of term.aliases ?? []) {
    TERM_LOOKUP.set(alias.toLowerCase(), term);
  }
}

export function listGlossaryTerms(): GlossaryTerm[] {
  return GLOSSARY_TERMS;
}

export function getGlossaryTermByToken(token: string): GlossaryTerm | undefined {
  return TERM_LOOKUP.get(token.trim().toLowerCase());
}

export function expandGlossaryLabel(label: string): string {
  let result = label;
  const sorted = [...GLOSSARY_TERMS]
    .sort((left, right) => right.shortLabel.length - left.shortLabel.length)
    .flatMap((term) => [term.shortLabel, ...(term.aliases ?? [])].map((token) => ({ token, term })));

  for (const entry of sorted) {
    const regex = new RegExp(`\\b${escapeRegex(entry.token)}\\b`, "g");
    result = result.replace(regex, entry.term.displayLabel);
  }

  return result;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}
