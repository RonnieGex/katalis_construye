import { describe, expect, it } from "vitest";

import {
  getLayerProgress,
  getLearningStepForChapter,
  getLearningStepsByLayer,
  getNextStepForChapter,
  LEARNING_LAYERS,
} from "@/lib/learn";

describe("learn path layers", () => {
  it("defines three ordered layers", () => {
    expect(LEARNING_LAYERS.map((layer) => layer.id)).toEqual(["base", "intermediate", "advanced"]);
  });

  it("returns setup and chapter steps for base layer", () => {
    const steps = getLearningStepsByLayer("base");
    expect(steps[0]?.id).toBe("setup");
    expect(steps.some((step) => step.chapterSlug === "capitulo6_internacional")).toBe(true);
  });

  it("maps chapter to step and next step", () => {
    const step = getLearningStepForChapter("capitulo10_internacional");
    const next = getNextStepForChapter("capitulo10_internacional");
    expect(step?.layerId).toBe("intermediate");
    expect(next?.chapterSlug).toBe("capitulo11_internacional");
  });

  it("computes layer progress by completed chapter slugs", () => {
    const progress = getLayerProgress([
      "capitulo1_internacional",
      "capitulo2_internacional",
      "capitulo7_internacional",
    ]);
    expect(progress.base.completed).toBe(2);
    expect(progress.intermediate.completed).toBe(1);
    expect(progress.advanced.completed).toBe(0);
  });
});
