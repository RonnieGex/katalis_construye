import type { CsvCell, CsvExportOptions } from "@/lib/csv/types";

const DEFAULT_CSV_OPTIONS: CsvExportOptions = {
  delimiter: ",",
  includeBom: true,
  lineBreak: "\r\n",
};

function stringifyCell(value: CsvCell): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return value;
}

function escapeCell(raw: string, delimiter: string): string {
  const escaped = raw.replace(/"/g, '""');
  const mustQuote =
    escaped.includes(delimiter) ||
    escaped.includes('"') ||
    escaped.includes("\n") ||
    escaped.includes("\r");

  return mustQuote ? `"${escaped}"` : escaped;
}

function createCsvLine(cells: CsvCell[], delimiter: string): string {
  return cells
    .map((cell) => escapeCell(stringifyCell(cell), delimiter))
    .join(delimiter);
}

export function buildCsv(
  headers: string[],
  rows: CsvCell[][],
  options?: Partial<CsvExportOptions>,
): string {
  const resolved = { ...DEFAULT_CSV_OPTIONS, ...options };
  const allLines = [createCsvLine(headers, resolved.delimiter)];

  for (const row of rows) {
    allLines.push(createCsvLine(row, resolved.delimiter));
  }

  const csvText = allLines.join(resolved.lineBreak);
  return resolved.includeBom ? `\uFEFF${csvText}` : csvText;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function createCsvFilename(prefix: string, date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = pad2(date.getUTCMonth() + 1);
  const day = pad2(date.getUTCDate());
  const hour = pad2(date.getUTCHours());
  const minute = pad2(date.getUTCMinutes());
  return `${prefix}-${year}${month}${day}-${hour}${minute}.csv`;
}

export function downloadCsv(filename: string, csvContent: string): void {
  if (typeof window === "undefined") {
    throw new Error("CSV download is only available in the browser.");
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
