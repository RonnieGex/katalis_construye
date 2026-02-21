import currencyCodes from "currency-codes";

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  label: string;
}

const PRIORITY_CODES = ["MXN", "USD", "EUR", "COP", "ARS", "CLP", "PEN"];

function inferCurrencySymbol(code: string): string {
  try {
    const parts = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).formatToParts(0);
    const symbol = parts.find((part) => part.type === "currency")?.value?.trim();
    if (!symbol || symbol.toUpperCase() === code.toUpperCase()) {
      return code.toUpperCase();
    }
    return symbol;
  } catch {
    return code.toUpperCase();
  }
}

function createCurrencyOptions(): CurrencyOption[] {
  const uniqueByCode = new Map<string, CurrencyOption>();

  for (const item of currencyCodes.data) {
    const code = item.code.toUpperCase();
    if (uniqueByCode.has(code)) {
      continue;
    }
    const name = item.currency.trim();
    const symbol = inferCurrencySymbol(code);
    uniqueByCode.set(code, {
      code,
      name,
      symbol,
      label: `${code} - ${name}`,
    });
  }

  const all = Array.from(uniqueByCode.values()).sort((a, b) =>
    a.code.localeCompare(b.code),
  );

  const priority = PRIORITY_CODES.map((code) => uniqueByCode.get(code)).filter(
    (option): option is CurrencyOption => Boolean(option),
  );
  const prioritySet = new Set(priority.map((option) => option.code));
  const rest = all.filter((option) => !prioritySet.has(option.code));

  return [...priority, ...rest];
}

export const CURRENCY_OPTIONS: CurrencyOption[] = createCurrencyOptions();

export function resolveCurrencyFromCode(code: string): {
  code: string;
  symbol: string;
  name: string;
} {
  const normalized = code.trim().toUpperCase();
  const found = CURRENCY_OPTIONS.find((option) => option.code === normalized);
  if (found) {
    return { code: found.code, symbol: found.symbol, name: found.name };
  }
  return {
    code: normalized || "USD",
    symbol: inferCurrencySymbol(normalized || "USD"),
    name: normalized || "USD",
  };
}
