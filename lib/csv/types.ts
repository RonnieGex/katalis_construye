export type CsvCell = string | number | boolean | null | undefined;

export interface CsvExportOptions {
  delimiter: string;
  includeBom: boolean;
  lineBreak: string;
}

export interface CsvRows {
  headers: string[];
  rows: CsvCell[][];
}

export interface CashFlowCsvRow {
  month: string;
  starting_balance: number;
  line_type: "inflow" | "outflow";
  line_name: string;
  projected: number;
  actual: number | null;
}

export interface CostsCsvRow {
  id: number | null;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  notes: string;
}

export interface BudgetCsvRow {
  year: number;
  section: "income" | "expense";
  line_name: string;
  month_index: number;
  month_label: string;
  planned: number;
  actual: number;
  variance_amount: number;
  variance_pct: number | null;
}

export interface GenericMetricCsvRow {
  metric: string;
  value: number | string | null;
}
