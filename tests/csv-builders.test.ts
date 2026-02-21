import { describe, expect, it } from "vitest";

import {
  buildBudgetCsv,
  buildCashFlowCsv,
  buildCostsCsv,
} from "@/lib/csv/builders";

describe("buildCashFlowCsv", () => {
  it("flattens inflow and outflow lines using the expected columns", () => {
    const result = buildCashFlowCsv([
      {
        month: "2026-01",
        startingBalance: 1000,
        inflows: [{ name: "Sales", projected: 500, actual: 450 }],
        outflows: [{ name: "Rent", projected: 300, actual: 320 }],
      },
    ]);

    expect(result.headers).toEqual([
      "month",
      "starting_balance",
      "line_type",
      "line_name",
      "projected",
      "actual",
    ]);
    expect(result.rows).toEqual([
      ["2026-01", 1000, "inflow", "Sales", 500, 450],
      ["2026-01", 1000, "outflow", "Rent", 300, 320],
    ]);
  });
});

describe("buildCostsCsv", () => {
  it("maps cost entries preserving column order and values", () => {
    const result = buildCostsCsv([
      {
        id: 7,
        date: "2026-02-19",
        description: "Marketing",
        amount: 250,
        type: "expense",
        category: "ads",
        notes: "campaign",
      },
    ]);

    expect(result.headers).toEqual([
      "id",
      "date",
      "description",
      "amount",
      "type",
      "category",
      "notes",
    ]);
    expect(result.rows).toEqual([
      [7, "2026-02-19", "Marketing", 250, "expense", "ads", "campaign"],
    ]);
  });
});

describe("buildBudgetCsv", () => {
  it("exports 12 months per line including variance amount and percent", () => {
    const result = buildBudgetCsv({
      year: 2026,
      incomeLines: [
        {
          name: "Sales",
          plannedByMonth: [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          actualByMonth: [120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      expenseLines: [
        {
          name: "Ops",
          plannedByMonth: [80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          actualByMonth: [70, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    });

    expect(result.headers).toEqual([
      "year",
      "section",
      "line_name",
      "month_index",
      "month_label",
      "planned",
      "actual",
      "variance_amount",
      "variance_pct",
    ]);
    expect(result.rows).toHaveLength(24);
    expect(result.rows[0]).toEqual([
      2026,
      "income",
      "Sales",
      1,
      "Ene",
      100,
      120,
      20,
      20,
    ]);
    expect(result.rows[13]).toEqual([
      2026,
      "expense",
      "Ops",
      2,
      "Feb",
      0,
      10,
      10,
      null,
    ]);
  });
});
