import { describe, expect, it } from "vitest";

import { formatAmountByDisplayMode, toUsd } from "@/lib/currency";
import type { AppSettings } from "@/lib/domain";

const baseSettings: AppSettings = {
  schemaVersion: 2,
  baseCurrency: { code: "MXN", symbol: "$" },
  currencyDisplayMode: "base",
  fxRateToUsd: 20,
  businessModel: "other",
};

describe("currency display mode", () => {
  it("formats amount in base currency when mode is base", () => {
    const result = formatAmountByDisplayMode(2000, baseSettings);
    expect(result).toContain("$");
    expect(result).not.toContain("USD");
  });

  it("formats amount in USD when mode is usd", () => {
    const result = formatAmountByDisplayMode(2000, {
      ...baseSettings,
      currencyDisplayMode: "usd",
    });
    expect(result).toContain("USD");
    expect(toUsd(2000, 20)).toBe(100);
  });

  it("returns 0 USD conversion when fx rate is invalid", () => {
    const result = formatAmountByDisplayMode(2000, {
      ...baseSettings,
      currencyDisplayMode: "usd",
      fxRateToUsd: 0,
    });

    expect(toUsd(2000, 0)).toBe(0);
    expect(result).toContain("USD");
  });
});
