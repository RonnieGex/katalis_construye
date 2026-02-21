"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateValuation } from "@/lib/calculations/advanced/valuation-calculator";
import { buildValuationCsv } from "@/lib/csv/builders";
import { formatAmountByDisplayMode } from "@/lib/currency";
import type { ValuationModel } from "@/lib/domain";
import { getValuationSampleModel } from "@/lib/guidance/sample-data";
import { getValuationModel, saveValuationModel } from "@/lib/repo";

export default function ValuationCalculatorPage() {
  return (
    <AdvancedToolPage<ValuationModel>
      toolId="valuation-calculator"
      title="Calculadora de Valoracion"
      description="Valora negocio por multiples (ventas/EBITDA/utilidad), valor libro y DCF."
      exportPrefix="valuation-calculator"
      fields={[
        { key: "annualSales", label: "Ventas anuales", type: "number", step: "0.01" },
        { key: "salesMultiple", label: "Multiple ventas", type: "number", step: "0.01" },
        { key: "annualEbitda", label: "EBITDA anual", type: "number", step: "0.01" },
        { key: "ebitdaMultiple", label: "Multiple EBITDA", type: "number", step: "0.01" },
        { key: "annualNetIncome", label: "Utilidad neta anual", type: "number", step: "0.01" },
        { key: "netIncomeMultiple", label: "Multiple utilidad neta", type: "number", step: "0.01" },
        { key: "totalAssets", label: "Activos totales", type: "number", step: "0.01" },
        { key: "totalLiabilities", label: "Pasivos totales", type: "number", step: "0.01" },
        { key: "discountRatePct", label: "Tasa descuento (%)", type: "number", step: "0.01" },
        { key: "freeCashFlow", label: "Flujo libre", type: "number", step: "0.01" },
        { key: "terminalValue", label: "Valor terminal", type: "number", step: "0.01" },
        { key: "years", label: "Anos DCF", type: "number", step: "1" },
      ]}
      getModel={getValuationModel}
      saveModel={saveValuationModel}
      sampleModel={getValuationSampleModel}
      buildRows={buildValuationCsv}
      summary={(model, settings) => {
        const s = calculateValuation(model);
        return [
          { label: "Valor por ventas", value: formatAmountByDisplayMode(s.valueSalesMultiple, settings) },
          { label: "Valor por EBITDA", value: formatAmountByDisplayMode(s.valueEbitdaMultiple, settings) },
          {
            label: "Valor por utilidad neta",
            value: formatAmountByDisplayMode(s.valueNetIncomeMultiple, settings),
          },
          { label: "Valor libro", value: formatAmountByDisplayMode(s.bookValue, settings) },
          { label: "Valor DCF", value: formatAmountByDisplayMode(s.dcfValue, settings) },
        ];
      }}
    />
  );
}
