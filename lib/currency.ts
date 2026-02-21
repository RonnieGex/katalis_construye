import type { AppSettings } from "@/lib/domain";

export function toUsd(baseAmount: number, fxRateToUsd: number): number {
  if (fxRateToUsd <= 0) {
    return 0;
  }

  return baseAmount / fxRateToUsd;
}

export function formatCurrency(
  amount: number,
  currencyCode: string,
  locale = "es-MX",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getDisplayCurrencyCode(settings: AppSettings): string {
  return settings.currencyDisplayMode === "usd" ? "USD" : settings.baseCurrency.code;
}

function toDisplayAmount(amount: number, settings: AppSettings): number {
  if (settings.currencyDisplayMode === "usd") {
    return toUsd(amount, settings.fxRateToUsd);
  }
  return amount;
}

export function formatAmountByDisplayMode(
  amount: number,
  settings: AppSettings,
  locale = "es-MX",
): string {
  const displayAmount = toDisplayAmount(amount, settings);
  const currencyCode = getDisplayCurrencyCode(settings);
  return formatCurrency(displayAmount, currencyCode, locale);
}

export function getDisplayCurrencyLabel(settings: AppSettings): string {
  return settings.currencyDisplayMode === "usd" ? "USD" : settings.baseCurrency.code;
}

// Legacy alias kept while remaining callers migrate.
export function formatAmountWithOptionalUsd(
  amount: number,
  settings: AppSettings,
  locale = "es-MX",
): string {
  return formatAmountByDisplayMode(amount, settings, locale);
}