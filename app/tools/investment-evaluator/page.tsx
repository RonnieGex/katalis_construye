"use client";

import { AdvancedToolPage } from "@/components/advanced-tool-page";
import { calculateInvestmentEvaluator } from "@/lib/calculations/advanced/investment-evaluator";
import { buildInvestmentEvaluatorCsv } from "@/lib/csv/builders";
import { formatAmountByDisplayMode } from "@/lib/currency";
import type { InvestmentEvaluatorModel } from "@/lib/domain";
import { getInvestmentEvaluatorSampleModel } from "@/lib/guidance/sample-data";
import { getInvestmentEvaluatorModel, saveInvestmentEvaluatorModel } from "@/lib/repo";

function formatNullable(value: number | null, suffix = ""): string {
  return value === null ? "N/A" : `${value.toFixed(2)}${suffix}`;
}

export default function InvestmentEvaluatorPage() {
  return (
    <AdvancedToolPage<InvestmentEvaluatorModel>
      toolId="investment-evaluator"
      title="Evaluador de Inversiones"
      description="Analiza ROI, payback, NPV e IRR con tasa de descuento editable."
      exportPrefix="investment-evaluator"
      fields={[
        { key: "investmentId", label: "ID inversión", type: "text" },
        { key: "initialCost", label: "Inversión inicial", type: "number", step: "0.01" },
        { key: "annualBenefit", label: "Beneficio anual", type: "number", step: "0.01" },
        { key: "discountRatePct", label: "Tasa descuento (%)", type: "number", step: "0.01" },
        { key: "years", label: "Anos", type: "number", step: "1" },
        { key: "scenario", label: "Escenario", type: "text" },
      ]}
      getModel={getInvestmentEvaluatorModel}
      saveModel={saveInvestmentEvaluatorModel}
      sampleModel={getInvestmentEvaluatorSampleModel}
      buildRows={buildInvestmentEvaluatorCsv}
      summary={(model, settings) => {
        const s = calculateInvestmentEvaluator(model);
        return [
          { label: "ROI", value: formatNullable(s.roi, "%") },
          { label: "Payback (años)", value: formatNullable(s.payback) },
          { label: "NPV", value: formatAmountByDisplayMode(s.npv, settings) },
          { label: "IRR", value: formatNullable(s.irr, "%") },
        ];
      }}
    />
  );
}
