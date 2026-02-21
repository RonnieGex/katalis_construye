import { describe, expect, it } from "vitest";

import {
  buildFinancingOptionsCsv,
  buildResilienceCsv,
  buildUnitEconomicsCsv,
  buildValuationCsv,
} from "@/lib/csv/builders";
import {
  DEFAULT_FINANCING_OPTIONS,
  DEFAULT_RESILIENCE,
  DEFAULT_UNIT_ECONOMICS,
  DEFAULT_VALUATION,
} from "@/lib/defaults";

describe("advanced csv builders", () => {
  it("builds unit economics csv with expected columns", () => {
    const result = buildUnitEconomicsCsv(DEFAULT_UNIT_ECONOMICS);
    expect(result.headers).toEqual([
      "period",
      "price",
      "variable_cost",
      "contribution_margin",
      "coca",
      "ltv",
      "ltv_coca",
      "payback_months",
    ]);
    expect(result.rows.length).toBe(12);
  });

  it("builds financing options csv row", () => {
    const result = buildFinancingOptionsCsv(DEFAULT_FINANCING_OPTIONS);
    expect(result.headers[0]).toBe("option_type");
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0][0]).toBe("debt");
  });

  it("builds valuation and resilience csv outputs", () => {
    const valuation = buildValuationCsv(DEFAULT_VALUATION);
    const resilience = buildResilienceCsv(DEFAULT_RESILIENCE);

    expect(valuation.rows).toHaveLength(5);
    expect(valuation.rows[0][0]).toBe("sales_multiple");
    expect(resilience.rows[0][0]).toBe("liquidity");
    expect(resilience.headers).toContain("runway_months");
  });
});
