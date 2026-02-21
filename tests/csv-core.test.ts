import { describe, expect, it } from "vitest";

import { buildCsv, createCsvFilename } from "@/lib/csv/core";

describe("buildCsv", () => {
  it("serializes rows with RFC4180 escaping, BOM, and CRLF line breaks", () => {
    const csv = buildCsv(
      ["name", "notes"],
      [
        ['hello, "world"', "line1\nline2"],
        [1, true],
      ],
    );

    expect(csv).toBe(
      '\uFEFFname,notes\r\n"hello, ""world""","line1\nline2"\r\n1,true',
    );
  });

  it("allows disabling BOM and stringifies nullish values as empty cells", () => {
    const csv = buildCsv(["a", "b", "c"], [[null, undefined, "ok"]], {
      includeBom: false,
    });

    expect(csv).toBe("a,b,c\r\n,,ok");
  });
});

describe("createCsvFilename", () => {
  it("generates deterministic file name with YYYYMMDD-HHmm suffix", () => {
    const date = new Date("2026-02-19T14:48:00.000Z");
    const fileName = createCsvFilename("cash-flow-all-months", date);

    expect(fileName).toBe("cash-flow-all-months-20260219-1448.csv");
  });
});
