"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateResilience } from "@/lib/calculations/advanced/resilience-evaluator";
import { buildResilienceCsv } from "@/lib/csv/builders";
import { formatAmountByDisplayMode } from "@/lib/currency";
import type { ResilienceModel } from "@/lib/domain";
import { getResilienceSampleModel } from "@/lib/guidance/sample-data";
import { getResilienceModel, saveResilienceModel } from "@/lib/repo";

function formatNullable(value: number | null): string {
  return value === null ? "N/A" : value.toFixed(2);
}

export default function ResilienceEvaluatorPage() {
  return (
    <AdvancedToolPage<ResilienceModel>
      toolId="resilience-evaluator"
      title="Evaluador de Resiliencia"
      description="Mide reserva objetivo, runway, score de resiliencia y estrés por caída de ventas."
      exportPrefix="resilience-evaluator"
      fields={[
        { key: "availableCash", label: "Caja disponible", type: "number", step: "0.01" },
        { key: "monthlyBurn", label: "Burn mensual", type: "number", step: "0.01" },
        { key: "monthlyOperatingExpense", label: "Gasto operativo mensual", type: "number", step: "0.01" },
        { key: "targetMonths", label: "Meses objetivo", type: "number", step: "1" },
        { key: "liquidityScore", label: "Score liquidez", type: "number", step: "1" },
        { key: "debtScore", label: "Score deuda", type: "number", step: "1" },
        { key: "diversificationScore", label: "Score diversificacion", type: "number", step: "1" },
        { key: "contingencyReadinessScore", label: "Score contingencia", type: "number", step: "1" },
        { key: "salesDropPct", label: "Caida ventas (%)", type: "number", step: "0.01" },
      ]}
      getModel={getResilienceModel}
      saveModel={saveResilienceModel}
      sampleModel={getResilienceSampleModel}
      buildRows={buildResilienceCsv}
      summary={(model, settings) => {
        const s = calculateResilience(model);
        return [
          { label: "Reserva objetivo", value: formatAmountByDisplayMode(s.reserveTarget, settings) },
          { label: "Runway (meses)", value: formatNullable(s.runwayMonths) },
          { label: "Score resiliencia", value: s.resilienceScore.toFixed(2) },
          { label: "Impacto de crisis", value: formatAmountByDisplayMode(s.crisisImpact, settings) },
        ];
      }}
    />
  );
}
