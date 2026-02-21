import { describe, expect, it } from "vitest";

import {
  getResultGuide,
  resolveToolGuideSpec,
} from "@/lib/guidance/tool-guidance";

describe("result interpretation mapping", () => {
  it("returns configured result guide for core tools", () => {
    const spec = resolveToolGuideSpec({
      toolId: "cashflow",
      fieldKeys: ["startingBalance", "inflows", "outflows"],
      resultKeys: ["projectedEndingBalance", "actualEndingBalance"],
    });

    const guide = getResultGuide(spec, "projectedEndingBalance");
    expect(guide).not.toBeNull();
    expect(guide?.nextAction.length).toBeGreaterThan(0);
  });

  it("falls back to generated guide for advanced tools", () => {
    const spec = resolveToolGuideSpec({
      toolId: "valuation-calculator",
      fieldKeys: ["annualSales", "salesMultiple", "annualEbitda"],
      resultKeys: ["dcfValue"],
    });

    const guide = getResultGuide(spec, "dcfValue");
    expect(guide).not.toBeNull();
    expect(guide?.meaning.length).toBeGreaterThan(0);
  });
});
