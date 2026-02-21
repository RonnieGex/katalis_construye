"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateFinancialStrategy } from "@/lib/calculations/advanced/financial-strategy-planner";
import { buildFinancialStrategyCsv } from "@/lib/csv/builders";
import { formatAmountByDisplayMode } from "@/lib/currency";
import type { FinancialStrategyModel } from "@/lib/domain";
import { getFinancialStrategySampleModel } from "@/lib/guidance/sample-data";
import { getFinancialStrategyModel, saveFinancialStrategyModel } from "@/lib/repo";

export default function FinancialStrategyPlannerPage() {
  return (
    <AdvancedToolPage<FinancialStrategyModel>
      toolId="financial-strategy-planner"
      title="Planificador de Estrategia Financiera"
      description="Proyecta 5 anos de crecimiento, utilidad, reinversion y restricciones de mix de capital."
      exportPrefix="financial-strategy"
      fields={[
        { key: "revenue0", label: "Ventas base ano 0", type: "number", step: "0.01" },
        { key: "growthRatePct", label: "Crecimiento anual (%)", type: "number", step: "0.01" },
        { key: "targetNetMarginPct", label: "Margen neto objetivo (%)", type: "number", step: "0.01" },
        { key: "reinvestPct", label: "Reinversion (%)", type: "number", step: "0.01" },
        { key: "dividendPct", label: "Dividendos (%)", type: "number", step: "0.01" },
        { key: "debtPct", label: "Deuda (%)", type: "number", step: "0.01" },
        { key: "equityPct", label: "Equity (%)", type: "number", step: "0.01" },
        { key: "maxDebtPct", label: "Maximo deuda (%)", type: "number", step: "0.01" },
        { key: "horizonYears", label: "Horizonte (anos)", type: "number", step: "1" },
      ]}
      getModel={getFinancialStrategyModel}
      saveModel={saveFinancialStrategyModel}
      sampleModel={getFinancialStrategySampleModel}
      buildRows={buildFinancialStrategyCsv}
      summary={(model, settings) => {
        const s = calculateFinancialStrategy(model);
        const last = s.rows.at(-1);
        return [
          { label: "Deuda <= maximo", value: s.debtMixConstraint ? "OK" : "Alerta" },
          {
            label: "Ventas ultimo ano",
            value: last ? formatAmountByDisplayMode(last.revenue, settings) : "N/A",
          },
          {
            label: "Utilidad neta ultimo ano",
            value: last ? formatAmountByDisplayMode(last.netIncome, settings) : "N/A",
          },
          {
            label: "Reinversion ultimo ano",
            value: last ? formatAmountByDisplayMode(last.reinvestment, settings) : "N/A",
          },
          {
            label: "Dividendos ultimo ano",
            value: last ? formatAmountByDisplayMode(last.dividends, settings) : "N/A",
          },
        ];
      }}
    />
  );
}
