"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateUnitEconomics } from "@/lib/calculations/advanced/unit-economics";
import { buildUnitEconomicsCsv } from "@/lib/csv/builders";
import { formatAmountByDisplayMode } from "@/lib/currency";
import type { UnitEconomicsModel } from "@/lib/domain";
import { getUnitEconomicsSampleModel } from "@/lib/guidance/sample-data";
import { getUnitEconomicsModel, saveUnitEconomicsModel } from "@/lib/repo";

function formatNullable(value: number | null, digits = 2): string {
  return value === null ? "N/A" : value.toFixed(digits);
}

export default function UnitEconomicsPage() {
  return (
    <AdvancedToolPage<UnitEconomicsModel>
      toolId="unit-economics"
      title="Economia Unitaria"
      description="Valida margen de contribución, COCA, LTV y recuperación de adquisición por cliente."
      exportPrefix="unit-economics"
      fields={[
        { key: "price", label: "Precio", type: "number", step: "0.01" },
        { key: "variableCost", label: "Costo variable", type: "number", step: "0.01" },
        { key: "marketingSales", label: "Gasto marketing+ventas", type: "number", step: "0.01" },
        { key: "newCustomers", label: "Nuevos clientes", type: "number", step: "1" },
        { key: "avgTicket", label: "Ticket promedio", type: "number", step: "0.01" },
        { key: "purchaseFrequency", label: "Frecuencia de compra", type: "number", step: "0.01" },
        { key: "retentionPeriod", label: "Período de retención", type: "number", step: "1" },
        { key: "discountRatePct", label: "Tasa de descuento (%)", type: "number", step: "0.01" },
      ]}
      getModel={getUnitEconomicsModel}
      saveModel={saveUnitEconomicsModel}
      sampleModel={getUnitEconomicsSampleModel}
      buildRows={buildUnitEconomicsCsv}
      summary={(model, settings) => {
        const s = calculateUnitEconomics(model);
        return [
          { label: "Margen de contribución", value: formatAmountByDisplayMode(s.contributionMargin, settings) },
          { label: "COCA", value: formatNullable(s.coca) },
          { label: "Economia unitaria", value: formatNullable(s.unitEconomics) },
          { label: "LTV", value: formatAmountByDisplayMode(s.ltv, settings) },
          { label: "LTV/COCA", value: formatNullable(s.ltvCoca) },
          { label: "Payback (meses)", value: formatNullable(s.paybackMonths) },
        ];
      }}
    />
  );
}
