"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateDebtManager } from "@/lib/calculations/advanced/debt-manager";
import { buildDebtManagerCsv } from "@/lib/csv/builders";
import { formatAmountByDisplayMode } from "@/lib/currency";
import type { DebtManagerModel } from "@/lib/domain";
import { getDebtManagerSampleModel } from "@/lib/guidance/sample-data";
import { getDebtManagerModel, saveDebtManagerModel } from "@/lib/repo";

function formatNullable(value: number | null, digits = 2, suffix = ""): string {
  return value === null ? "N/A" : `${value.toFixed(digits)}${suffix}`;
}

export default function DebtManagerPage() {
  return (
    <AdvancedToolPage<DebtManagerModel>
      toolId="debt-manager"
      title="Administrador de Deuda"
      description="Monitorea ratio de deuda, cobertura de intereses y estrategia avalanche/snowball."
      exportPrefix="debt-manager"
      fields={[
        { key: "totalDebt", label: "Deuda total", type: "number", step: "0.01" },
        { key: "totalAssets", label: "Activos totales", type: "number", step: "0.01" },
        { key: "ebit", label: "EBIT", type: "number", step: "0.01" },
        { key: "interestExpense", label: "Gasto por intereses", type: "number", step: "0.01" },
        { key: "loanAmount", label: "Monto prestamo", type: "number", step: "0.01" },
        { key: "fees", label: "Comisiones", type: "number", step: "0.01" },
        { key: "otherCosts", label: "Otros costos", type: "number", step: "0.01" },
        { key: "primaryBalance", label: "Saldo deuda primaria", type: "number", step: "0.01" },
        { key: "primaryRatePct", label: "Tasa primaria (%)", type: "number", step: "0.01" },
        { key: "secondaryBalance", label: "Saldo deuda secundaria", type: "number", step: "0.01" },
        { key: "secondaryRatePct", label: "Tasa secundaria (%)", type: "number", step: "0.01" },
        { key: "oldTotalCost", label: "Costo total actual", type: "number", step: "0.01" },
        { key: "newTotalCost", label: "Costo total refinanciado", type: "number", step: "0.01" },
      ]}
      getModel={getDebtManagerModel}
      saveModel={saveDebtManagerModel}
      sampleModel={getDebtManagerSampleModel}
      buildRows={buildDebtManagerCsv}
      summary={(model, settings) => {
        const s = calculateDebtManager(model);
        return [
          { label: "Ratio de deuda", value: formatNullable(s.debtRatio, 2, "%") },
          { label: "Cobertura de intereses", value: formatNullable(s.interestCoverage) },
          { label: "Costo efectivo deuda", value: formatNullable(s.effectiveDebtCost, 2, "%") },
          { label: "Prioridad avalanche", value: s.avalancheOrder.join(" > ") },
          { label: "Prioridad snowball", value: s.snowballOrder.join(" > ") },
          { label: "Ahorro por refinanciar", value: formatAmountByDisplayMode(s.refinanceDelta, settings) },
        ];
      }}
    />
  );
}
