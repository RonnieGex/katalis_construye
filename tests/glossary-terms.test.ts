import { describe, expect, it } from "vitest";

import {
  expandGlossaryLabel,
  getGlossaryTermByToken,
  listGlossaryTerms,
} from "@/lib/guidance/glossary";

describe("glossary labels", () => {
  it("resolves known acronym tokens", () => {
    expect(getGlossaryTermByToken("ROI")?.displayLabel).toContain("Retorno");
    expect(getGlossaryTermByToken("VAN")?.displayLabel).toBe("VAN (NPV)");
  });

  it("expands acronyms in labels", () => {
    const expanded = expandGlossaryLabel("ROI y EBITDA");
    expect(expanded).toContain("ROI (Retorno sobre inversion)");
    expect(expanded).toContain("EBITDA (Flujo operativo)");
  });

  it("keeps glossary catalog populated", () => {
    expect(listGlossaryTerms().length).toBeGreaterThanOrEqual(10);
  });
});
