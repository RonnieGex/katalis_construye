#!/usr/bin/env python
"""Extract VBA modules from .xlsm files.
Requires: pip install oletools

Usage:
  python scripts/extract_vba_modules.py "C:/path/to/folder" "./tests/fixtures/vba-modules.json"
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


def extract_with_olevba(workbook: Path) -> list[dict[str, str]]:
    cmd = [sys.executable, "-m", "oletools.olevba", str(workbook)]
    proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if proc.returncode != 0:
        return [{"module": "__error__", "code": proc.stderr.strip() or proc.stdout.strip()}]

    return [{"module": "raw", "code": proc.stdout}]


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: python scripts/extract_vba_modules.py <xlsm_folder> <output_json>")
        return 1

    source = Path(sys.argv[1])
    target = Path(sys.argv[2])

    rows = []
    for book in sorted(source.glob("*.xlsm")):
        modules = extract_with_olevba(book)
        rows.append({"workbook": book.name, "modules": modules})

    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Extracted VBA metadata for {len(rows)} workbooks to {target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())