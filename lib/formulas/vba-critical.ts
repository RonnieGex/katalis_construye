export interface VbaCriticalRule {
  workbook: string;
  moduleHint: string;
  behavior: string;
  tsImplementationRef: string;
}

export const VBA_CRITICAL_RULES: VbaCriticalRule[] = [
  {
    workbook: "Modelo Financiero Cafetería.xlsm",
    moduleHint: "IRR/TIR helpers",
    behavior: "Calculo de TIR sobre serie de flujo descontado",
    tsImplementationRef: "web/lib/calculations/advanced/investment-evaluator.ts::computeIrr",
  },
  {
    workbook: "LCR LTV & COCA cálculo.xlsm",
    moduleHint: "LTV/CAC scenario recalculation",
    behavior: "Recalculo de LTV, CAC y ratio en escenarios de crecimiento",
    tsImplementationRef:
      "web/lib/calculations/advanced/unit-economics.ts::calculateUnitEconomics",
  },
  {
    workbook: "Finanzas para Startups S1 y S2.xlsm",
    moduleHint: "Debt strategy helpers",
    behavior: "Priorizacion de pago por tasa y por saldo",
    tsImplementationRef: "web/lib/calculations/advanced/debt-manager.ts::calculateDebtManager",
  },
];