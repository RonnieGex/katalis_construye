#!/usr/bin/env python
"""Extract formulas from .xlsm workbooks into JSON fixtures.

Usage:
  python scripts/extract_excel_formulas.py "C:/path/to/folder" "./tests/fixtures/excel-formulas.json"
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import openpyxl


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: python scripts/extract_excel_formulas.py <xlsm_folder> <output_json>")
        return 1

    source = Path(sys.argv[1])
    target = Path(sys.argv[2])

    rows = []
    for book in sorted(source.glob("*.xlsm")):
        wb = openpyxl.load_workbook(book, data_only=False, keep_vba=True)
        for ws in wb.worksheets:
            for row in ws.iter_rows():
                for cell in row:
                    value = cell.value
                    if isinstance(value, str) and value.startswith("="):
                        rows.append(
                            {
                                "workbook": book.name,
                                "sheet": ws.title,
                                "cell": cell.coordinate,
                                "formula": value,
                            }
                        )

    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Extracted {len(rows)} formulas to {target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())