#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path


def _read_version(path: Path) -> str:
    data = json.loads(path.read_text(encoding="utf-8"))
    value = data.get("version")
    return value if isinstance(value, str) else ""


def main() -> int:
    package_json = Path("package.json")
    package_lock = Path("package-lock.json")

    if not package_json.is_file():
        print("ERROR: package.json missing")
        return 1
    if not package_lock.is_file():
        print("ERROR: package-lock.json missing")
        return 1

    pkg_version = _read_version(package_json)
    lock_version = _read_version(package_lock)

    if not pkg_version or not lock_version:
        print("ERROR: missing version in package.json or package-lock.json")
        return 1

    print(f"package.json: {pkg_version}")
    print(f"package-lock.json: {lock_version}")

    if pkg_version != lock_version:
        print("Version mismatch detected.")
        return 2

    print("Version match confirmed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
