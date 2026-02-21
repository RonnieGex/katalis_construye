import { describe, expect, it } from "vitest";

import { TOOL_IDS } from "@/lib/domain";
import {
  getFieldGuide,
  getDefaultStepId,
  resolveToolGuideSpec,
} from "@/lib/guidance/tool-guidance";

describe("tool guidance coverage", () => {
  it("builds a decision-ready guide for every tool", () => {
    for (const toolId of TOOL_IDS) {
      const spec = resolveToolGuideSpec({
        toolId,
        fieldKeys: ["fieldA", "fieldB", "fieldC"],
        resultKeys: ["resultA", "resultB"],
      });

      expect(spec.toolId).toBe(toolId);
      expect(spec.purpose.length).toBeGreaterThan(0);
      expect(spec.steps.length).toBeGreaterThanOrEqual(3);
      expect(spec.results.length).toBeGreaterThan(0);
      expect(getDefaultStepId(spec)).toBe(spec.steps[0].id);
    }
  });

  it("uses explicit concept guidance for EBIT", () => {
    const spec = resolveToolGuideSpec({
      toolId: "debt-manager",
      fieldKeys: ["ebit", "interestExpense", "totalDebt"],
      resultKeys: ["ratio de deuda"],
    });

    const ebitGuide = getFieldGuide(spec, "ebit");
    expect(ebitGuide).not.toBeNull();
    expect(ebitGuide?.whatIsIt.toLowerCase()).toContain("ganancia operativa");
    expect(ebitGuide?.howToFill.toLowerCase()).not.toContain("estimacion optimista");
  });

  it("uses field label in spanish when key is technical", () => {
    const spec = resolveToolGuideSpec({
      toolId: "unit-economics",
      fieldKeys: ["price"],
      resultKeys: ["economia unitaria"],
      fieldLabels: { price: "Precio" },
    });

    const priceGuide = getFieldGuide(spec, "price");
    expect(priceGuide).not.toBeNull();
    expect(priceGuide?.whatIsIt.toLowerCase()).toContain("precio");
    expect(priceGuide?.whatIsIt.toLowerCase()).not.toContain("price");
  });
});
