"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateContingency } from "@/lib/calculations/advanced/contingency-planner";
import { buildContingencyCsv } from "@/lib/csv/builders";
import { formatAmountByDisplayMode } from "@/lib/currency";
import type { ContingencyModel } from "@/lib/domain";
import { getContingencySampleModel } from "@/lib/guidance/sample-data";
import { getContingencyModel, saveContingencyModel } from "@/lib/repo";

function formatNullable(value: number | null): string {
  return value === null ? "N/A" : value.toFixed(2);
}

export default function ContingencyPlannerPage() {
  return (
    <AdvancedToolPage<ContingencyModel>
      toolId="contingency-planner"
      title="Planificador de Contingencia"
      description="Prioriza riesgos por score y valida si tus reservas cubren el objetivo de meses."
      exportPrefix="contingency-plan"
      fields={[
        { key: "riskName", label: "Riesgo", type: "text" },
        { key: "probabilityPct", label: "Probabilidad", type: "number", step: "0.01" },
        { key: "impactPct", label: "Impacto", type: "number", step: "0.01" },
        { key: "monthlyFixedOutflow", label: "Salida fija mensual", type: "number", step: "0.01" },
        { key: "reserveMonths", label: "Meses de reserva objetivo", type: "number", step: "1" },
        { key: "reserveBalance", label: "Reserva disponible", type: "number", step: "0.01" },
        { key: "trigger", label: "Trigger", type: "text" },
        { key: "owner", label: "Responsable", type: "text" },
        { key: "responseTimeDays", label: "Tiempo de respuesta (días)", type: "number", step: "1" },
      ]}
      getModel={getContingencyModel}
      saveModel={saveContingencyModel}
      sampleModel={getContingencySampleModel}
      buildRows={buildContingencyCsv}
      summary={(model, settings) => {
        const s = calculateContingency(model);
        return [
          { label: "Puntaje de riesgo", value: s.riskScore.toFixed(2) },
          {
            label: "Fondo de emergencia objetivo",
            value: formatAmountByDisplayMode(s.emergencyFundTarget, settings),
          },
          { label: "Meses de cobertura real", value: formatNullable(s.coverageMonths) },
        ];
      }}
    />
  );
}
