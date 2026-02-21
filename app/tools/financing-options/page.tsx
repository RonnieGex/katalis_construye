"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateFinancingOptions } from "@/lib/calculations/advanced/financing-options";
import { buildFinancingOptionsCsv } from "@/lib/csv/builders";
import { formatAmountByDisplayMode } from "@/lib/currency";
import type { FinancingOptionsModel } from "@/lib/domain";
import { getFinancingOptionsSampleModel } from "@/lib/guidance/sample-data";
import { getFinancingOptionsModel, saveFinancingOptionsModel } from "@/lib/repo";

export default function FinancingOptionsPage() {
  return (
    <AdvancedToolPage<FinancingOptionsModel>
      toolId="financing-options"
      title="Evaluador de Financiamiento"
      description="Compara deuda, equity o mix con costo efectivo total, dilucion y score ponderado."
      exportPrefix="financing-options"
      fields={[
        {
          key: "optionType",
          label: "Tipo de opcion",
          type: "select",
          options: [
            { label: "Deuda", value: "debt" },
            { label: "Equity", value: "equity" },
            { label: "Mixto", value: "mixed" },
          ],
        },
        { key: "principal", label: "Principal", type: "number", step: "0.01" },
        { key: "annualRatePct", label: "Tasa anual (%)", type: "number", step: "0.01" },
        { key: "termMonths", label: "Plazo (meses)", type: "number", step: "1" },
        { key: "fees", label: "Comisiones", type: "number", step: "0.01" },
        { key: "otherCosts", label: "Otros costos", type: "number", step: "0.01" },
        { key: "equityOfferedPct", label: "Equity cedido (%)", type: "number", step: "0.01" },
        { key: "controlScore", label: "Score control (0-100)", type: "number", step: "1" },
        { key: "riskScore", label: "Score riesgo (0-100)", type: "number", step: "1" },
        { key: "flexibilityScore", label: "Score flexibilidad (0-100)", type: "number", step: "1" },
      ]}
      getModel={getFinancingOptionsModel}
      saveModel={saveFinancingOptionsModel}
      sampleModel={getFinancingOptionsSampleModel}
      buildRows={buildFinancingOptionsCsv}
      summary={(model, settings) => {
        const s = calculateFinancingOptions(model);
        return [
          { label: "Pago mensual estimado", value: formatAmountByDisplayMode(s.monthlyPayment, settings) },
          { label: "Pagos totales", value: formatAmountByDisplayMode(s.totalPayments, settings) },
          { label: "Costo efectivo (%)", value: `${s.effectiveDebtCostPct.toFixed(2)}%` },
          { label: "Costo financiero total", value: formatAmountByDisplayMode(s.totalFinancingCost, settings) },
          { label: "Impacto de dilucion", value: `${s.dilutionImpact.toFixed(2)}%` },
          { label: "Score de opcion", value: s.optionScore.toFixed(2) },
        ];
      }}
    />
  );
}
