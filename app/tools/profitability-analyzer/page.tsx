"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateProfitability } from "@/lib/calculations/advanced/profitability-analyzer";
import { buildProfitabilityCsv } from "@/lib/csv/builders";
import { formatAmountByDisplayMode } from "@/lib/currency";
import type { ProfitabilityModel } from "@/lib/domain";
import { getProfitabilitySampleModel } from "@/lib/guidance/sample-data";
import { getProfitabilityModel, saveProfitabilityModel } from "@/lib/repo";

function formatNullable(value: number | null): string {
  return value === null ? "N/A" : `${value.toFixed(2)}%`;
}

export default function ProfitabilityAnalyzerPage() {
  return (
    <AdvancedToolPage<ProfitabilityModel>
      toolId="profitability-analyzer"
      title="Analizador de Rentabilidad"
      description="Calcula margenes bruto/operativo/neto, ROI y rentabilidad por segmento."
      exportPrefix="profitability-analyzer"
      fields={[
        { key: "sales", label: "Ventas", type: "number", step: "0.01" },
        { key: "cogs", label: "Costo de ventas", type: "number", step: "0.01" },
        { key: "opex", label: "Gastos operativos", type: "number", step: "0.01" },
        { key: "netIncome", label: "Utilidad neta", type: "number", step: "0.01" },
        { key: "investment", label: "Inversion", type: "number", step: "0.01" },
        { key: "segmentRevenue", label: "Ventas segmento", type: "number", step: "0.01" },
        { key: "segmentCosts", label: "Costos segmento", type: "number", step: "0.01" },
      ]}
      getModel={getProfitabilityModel}
      saveModel={saveProfitabilityModel}
      sampleModel={getProfitabilitySampleModel}
      buildRows={buildProfitabilityCsv}
      summary={(model, settings) => {
        const s = calculateProfitability(model);
        return [
          { label: "Margen bruto", value: formatNullable(s.grossMargin) },
          { label: "Margen operativo", value: formatNullable(s.operatingMargin) },
          { label: "Margen neto", value: formatNullable(s.netMargin) },
          { label: "ROI", value: formatNullable(s.roi) },
          {
            label: "Rentabilidad segmento",
            value: formatAmountByDisplayMode(s.segmentProfitability, settings),
          },
        ];
      }}
    />
  );
}
