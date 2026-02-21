"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateFinancialEducation } from "@/lib/calculations/advanced/financial-education-kit";
import { buildFinancialEducationCsv } from "@/lib/csv/builders";
import { formatAmountByDisplayMode } from "@/lib/currency";
import type { FinancialEducationModel } from "@/lib/domain";
import { getFinancialEducationSampleModel } from "@/lib/guidance/sample-data";
import { getFinancialEducationModel, saveFinancialEducationModel } from "@/lib/repo";

function formatNullablePct(value: number | null): string {
  return value === null ? "N/A" : `${value.toFixed(2)}%`;
}

export default function FinancialEducationKitPage() {
  return (
    <AdvancedToolPage<FinancialEducationModel>
      toolId="financial-education-kit"
      title="Kit de Educación Financiera"
      description="Mide conocimiento, tasa de finalización y ROI de capacitación por rol."
      exportPrefix="financial-education"
      fields={[
        { key: "role", label: "Rol", type: "text" },
        { key: "testScore1", label: "Test 1", type: "number", step: "0.01" },
        { key: "testScore2", label: "Test 2", type: "number", step: "0.01" },
        { key: "testScore3", label: "Test 3", type: "number", step: "0.01" },
        { key: "completedModules", label: "Modulos completados", type: "number", step: "1" },
        { key: "totalModules", label: "Total modulos", type: "number", step: "1" },
        { key: "trainingCost", label: "Costo de capacitación", type: "number", step: "0.01" },
        { key: "profitImprovement", label: "Mejora utilidad", type: "number", step: "0.01" },
      ]}
      getModel={getFinancialEducationModel}
      saveModel={saveFinancialEducationModel}
      sampleModel={getFinancialEducationSampleModel}
      buildRows={buildFinancialEducationCsv}
      summary={(model, settings) => {
        const s = calculateFinancialEducation(model);
        return [
          { label: "Indice de conocimiento", value: s.knowledgeIndex.toFixed(2) },
          { label: "Tasa de finalizacion", value: formatNullablePct(s.completionRate) },
          {
            label: "Costo de capacitación",
            value: formatAmountByDisplayMode(model.trainingCost, settings),
          },
          {
            label: "Mejora de utilidad",
            value: formatAmountByDisplayMode(model.profitImprovement, settings),
          },
          { label: "ROI de capacitación", value: formatNullablePct(s.trainingRoi) },
        ];
      }}
    />
  );
}
