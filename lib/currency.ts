import type { AppSettings } from "@/lib/domain";

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

export function formatAmountByDisplayMode(
  amount: number,
  settings: AppSettings,
  locale = "es-MX",
): string {
  return formatCurrency(amount, settings.baseCurrency.code, locale);
}

export function getDisplayCurrencyLabel(settings: AppSettings): string {
  return settings.baseCurrency.code;
}

// Legacy alias kept while remaining callers migrate.
export function formatAmountWithOptionalUsd(
  amount: number,
  settings: AppSettings,
  locale = "es-MX",
): string {
  return formatAmountByDisplayMode(amount, settings, locale);
}
