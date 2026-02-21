"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateFintechEvaluator } from "@/lib/calculations/advanced/fintech-evaluator";
import { buildFintechEvaluatorCsv } from "@/lib/csv/builders";
import type { FintechEvaluatorModel } from "@/lib/domain";
import { getFintechEvaluatorSampleModel } from "@/lib/guidance/sample-data";
import { getFintechEvaluatorModel, saveFintechEvaluatorModel } from "@/lib/repo";

export default function FintechEvaluatorPage() {
  return (
    <AdvancedToolPage<FintechEvaluatorModel>
      toolId="fintech-evaluator"
      title="Evaluador de Tecnologia Financiera"
      description="Puntua ajuste funcional, ROI de herramienta y riesgo de migracion."
      exportPrefix="fintech-evaluator"
      fields={[
        { key: "tool", label: "Herramienta", type: "text" },
        { key: "needsCoverageScore", label: "Cobertura necesidades", type: "number", step: "1" },
        { key: "securityScore", label: "Seguridad", type: "number", step: "1" },
        { key: "integrationScore", label: "Integracion", type: "number", step: "1" },
        { key: "easeScore", label: "Facilidad de uso", type: "number", step: "1" },
        { key: "annualCost", label: "Costo anual", type: "number", step: "0.01" },
        { key: "annualBenefit", label: "Beneficio anual", type: "number", step: "0.01" },
        { key: "dataRiskScore", label: "Riesgo de datos", type: "number", step: "1" },
        { key: "operationalRiskScore", label: "Riesgo operativo", type: "number", step: "1" },
        { key: "vendorRiskScore", label: "Riesgo proveedor", type: "number", step: "1" },
      ]}
      getModel={getFintechEvaluatorModel}
      saveModel={saveFintechEvaluatorModel}
      sampleModel={getFintechEvaluatorSampleModel}
      buildRows={buildFintechEvaluatorCsv}
      summary={(model) => {
        const s = calculateFintechEvaluator(model);
        return [
          { label: "Puntaje de ajuste", value: s.fitScore.toFixed(2) },
          { label: "ROI de herramienta", value: `${s.toolRoi.toFixed(2)}%` },
          { label: "Puntaje de riesgo de migracion", value: s.migrationRiskScore.toFixed(2) },
          { label: "Recomendacion", value: s.fitScore >= 70 ? "Adoptar" : "Revisar" },
        ];
      }}
    />
  );
}
