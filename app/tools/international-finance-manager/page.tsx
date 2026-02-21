"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateInternationalFinance } from "@/lib/calculations/advanced/international-finance-manager";
import { buildInternationalFinanceCsv } from "@/lib/csv/builders";
import { formatAmountByDisplayMode } from "@/lib/currency";
import type { InternationalFinanceModel } from "@/lib/domain";
import { getInternationalFinanceSampleModel } from "@/lib/guidance/sample-data";
import { getInternationalFinanceModel, saveInternationalFinanceModel } from "@/lib/repo";

export default function InternationalFinanceManagerPage() {
  return (
    <AdvancedToolPage<InternationalFinanceModel>
      toolId="international-finance-manager"
      title="Gestor de Finanzas Internacionales"
      description="Mide impacto FX, diferencia hedged/unhedged y precio recomendado con buffer."
      exportPrefix="international-finance"
      fields={[
        { key: "currencyCode", label: "Moneda extranjera", type: "text" },
        { key: "foreignAmount", label: "Exposicion (monto)", type: "number", step: "0.01" },
        { key: "plannedRate", label: "Tipo de cambio plan", type: "number", step: "0.0001" },
        { key: "actualRate", label: "Tipo de cambio real", type: "number", step: "0.0001" },
        { key: "hedgedResult", label: "Resultado con cobertura", type: "number", step: "0.01" },
        { key: "unhedgedResult", label: "Resultado sin cobertura", type: "number", step: "0.01" },
        { key: "basePrice", label: "Precio base", type: "number", step: "0.01" },
        { key: "fxRiskBufferPct", label: "Buffer FX (%)", type: "number", step: "0.01" },
      ]}
      getModel={getInternationalFinanceModel}
      saveModel={saveInternationalFinanceModel}
      sampleModel={getInternationalFinanceSampleModel}
      buildRows={buildInternationalFinanceCsv}
      summary={(model, settings) => {
        const s = calculateInternationalFinance(model);
        return [
          { label: "Monto convertido", value: formatAmountByDisplayMode(s.convertedAmount, settings) },
          { label: "Impacto FX", value: formatAmountByDisplayMode(s.fxImpact, settings) },
          { label: "Delta hedging", value: formatAmountByDisplayMode(s.hedgedDelta, settings) },
          { label: "Precio recomendado", value: formatAmountByDisplayMode(s.recommendedPrice, settings) },
        ];
      }}
    />
  );
}
