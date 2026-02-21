"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateBusinessModelAnalyzer } from "@/lib/calculations/advanced/business-model-analyzer";
import { buildBusinessModelAnalyzerCsv } from "@/lib/csv/builders";
import type { BusinessModelAnalyzerModel } from "@/lib/domain";
import { getBusinessModelAnalyzerSampleModel } from "@/lib/guidance/sample-data";
import { getBusinessModelAnalyzerModel, saveBusinessModelAnalyzerModel } from "@/lib/repo";

function formatNullable(value: number | null): string {
  return value === null ? "N/A" : value.toFixed(2);
}

export default function BusinessModelAnalyzerPage() {
  return (
    <AdvancedToolPage<BusinessModelAnalyzerModel>
      toolId="business-model-analyzer"
      title="Analizador por Modelo de Negocio"
      description="Evalua KPI clave por tipo de modelo y compara con benchmark/target."
      exportPrefix="business-model-analyzer"
      fields={[
        {
          key: "model",
          label: "Modelo",
          type: "select",
          options: [
            { label: "Ecommerce", value: "ecommerce" },
            { label: "Servicios", value: "services" },
            { label: "SaaS", value: "saas" },
            { label: "Manufactura", value: "manufacturing" },
            { label: "Otro", value: "other" },
          ],
        },
        { key: "sales", label: "Ventas", type: "number", step: "0.01" },
        { key: "cogs", label: "Costos directos", type: "number", step: "0.01" },
        { key: "marketingSales", label: "Marketing+ventas", type: "number", step: "0.01" },
        { key: "newCustomers", label: "Nuevos clientes", type: "number", step: "1" },
        { key: "ltv", label: "LTV", type: "number", step: "0.01" },
        { key: "churnPct", label: "Churn (%)", type: "number", step: "0.01" },
        { key: "capacityUsedPct", label: "Capacidad usada (%)", type: "number", step: "0.01" },
        { key: "benchmark", label: "Benchmark", type: "number", step: "0.01" },
        { key: "target", label: "Target", type: "number", step: "0.01" },
      ]}
      getModel={getBusinessModelAnalyzerModel}
      saveModel={saveBusinessModelAnalyzerModel}
      sampleModel={getBusinessModelAnalyzerSampleModel}
      buildRows={buildBusinessModelAnalyzerCsv}
      summary={(model) => {
        const s = calculateBusinessModelAnalyzer(model);
        return [
          { label: "KPI principal", value: s.kpiName },
          { label: "Valor KPI", value: formatNullable(s.kpiValue) },
          { label: "Benchmark", value: s.benchmark.toFixed(2) },
          { label: "Target", value: s.target.toFixed(2) },
          { label: "Gap", value: formatNullable(s.gap) },
        ];
      }}
    />
  );
}
