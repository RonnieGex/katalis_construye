import { describe, expect, it } from "vitest";

import {
  clearSampleOnly,
  isSampleOnlyDataset,
  shouldSeedSample,
} from "@/lib/guidance/sample-lifecycle";

describe("sample lifecycle", () => {
  it("seeds sample data only when tool has no data and state is not blocked", () => {
    expect(shouldSeedSample(undefined, false)).toBe(true);
    expect(shouldSeedSample("active", false)).toBe(true);
    expect(shouldSeedSample("dismissed", false)).toBe(false);
    expect(shouldSeedSample("consumed", false)).toBe(false);
    expect(shouldSeedSample(undefined, true)).toBe(false);
  });

  it("clears only sample rows preserving user rows", () => {
    const rows = [
      { id: 1, seedSource: "sample" as const, amount: 10 },
      { id: 2, seedSource: "user" as const, amount: 50 },
      { id: 3, amount: 70 },
    ];

    const result = clearSampleOnly(rows);
    expect(result).toEqual([
      { id: 2, seedSource: "user", amount: 50 },
      { id: 3, amount: 70 },
    ]);
  });

  it("detects sample-only datasets", () => {
    expect(isSampleOnlyDataset([{ seedSource: "sample" }, { seedSource: "sample" }])).toBe(true);
    expect(isSampleOnlyDataset([{ seedSource: "sample" }, { seedSource: "user" }])).toBe(false);
    expect(isSampleOnlyDataset([])).toBe(false);
  });
});