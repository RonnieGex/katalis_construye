import { describe, expect, it } from "vitest";

import { formatAmountByDisplayMode } from "@/lib/currency";
import type { AppSettings } from "@/lib/domain";

const baseSettings: AppSettings = {
  schemaVersion: 2,
  baseCurrency: { code: "MXN", symbol: "$" },
  currencyDisplayMode: "base",
  fxRateToUsd: 20,
  businessModel: "other",
};

describe("currency display mode", () => {
  it("formats amount in base currency", () => {
    const result = formatAmountByDisplayMode(2000, baseSettings);
    expect(result).toContain("$");
    expect(result).not.toContain("USD");
  });

  it("ignores legacy usd mode and keeps base currency formatting", () => {
    const result = formatAmountByDisplayMode(2000, {
      ...baseSettings,
      currencyDisplayMode: "usd",
    });
    expect(result).toContain("$");
    expect(result).not.toContain("USD");
  });

  it("keeps base currency formatting even with invalid fx data", () => {
    const result = formatAmountByDisplayMode(2000, {
      ...baseSettings,
      currencyDisplayMode: "usd",
      fxRateToUsd: 0,
    });

    expect(result).toContain("$");
    expect(result).not.toContain("USD");
  });
});
