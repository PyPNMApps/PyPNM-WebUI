#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

PACKAGE_JSON = Path("package.json")
PACKAGE_LOCK = Path("package-lock.json")
SEMVER_RE = re.compile(r"^(\d+)\.(\d+)\.(\d+)(?:-rc(\d+))?$")


def _read_json(path: Path) -> dict:
    if not path.is_file():
        print(f"ERROR: Missing file: {path}", file=sys.stderr)
        sys.exit(1)
    return json.loads(path.read_text(encoding="utf-8"))


def _write_json(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def _parse(version: str) -> tuple[int, int, int, int | None]:
    match = SEMVER_RE.fullmatch(version)
    if not match:
        print(
            f"ERROR: Invalid version '{version}'. Expected MAJOR.MINOR.PATCH or MAJOR.MINOR.PATCH-rcN.",
            file=sys.stderr,
        )
        sys.exit(1)
    major, minor, patch, rc = match.groups()
    return int(major), int(minor), int(patch), (int(rc) if rc is not None else None)


def _format(major: int, minor: int, patch: int, rc: int | None) -> str:
    base = f"{major}.{minor}.{patch}"
    return f"{base}-rc{rc}" if rc is not None else base


def _compute_next(current: str, mode: str) -> str:
    major, minor, patch, rc = _parse(current)

    if mode == "major":
        return _format(major + 1, 0, 0, None)
    if mode == "minor":
        return _format(major, minor + 1, 0, None)
    if mode == "patch":
        return _format(major, minor, patch + 1, None)
    if mode == "rc":
        if rc is None:
            return _format(major, minor, patch, 1)
        return _format(major, minor, patch, rc + 1)

    print(f"ERROR: Unsupported --next mode '{mode}'.", file=sys.stderr)
    sys.exit(1)


def _set_version(new_version: str) -> tuple[str, str]:
    _parse(new_version)

    pkg = _read_json(PACKAGE_JSON)
    lock = _read_json(PACKAGE_LOCK)

    current = pkg.get("version", "")
    if not isinstance(current, str) or not current:
        print("ERROR: package.json missing version", file=sys.stderr)
        sys.exit(1)

    pkg["version"] = new_version

    if isinstance(lock.get("version"), str):
        lock["version"] = new_version

    packages = lock.get("packages")
    if isinstance(packages, dict) and isinstance(packages.get(""), dict):
        root_pkg = packages[""]
        if isinstance(root_pkg.get("version"), str):
            root_pkg["version"] = new_version

    _write_json(PACKAGE_JSON, pkg)
    _write_json(PACKAGE_LOCK, lock)
    return current, new_version


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Inspect or update version in package.json and package-lock.json. "
            "Version format: MAJOR.MINOR.PATCH or MAJOR.MINOR.PATCH-rcN."
        )
    )
    parser.add_argument("version", nargs="?", help="Explicit version to set")
    parser.add_argument("--current", action="store_true", help="Show current version and exit")
    parser.add_argument("--next", choices=["major", "minor", "patch", "rc"], help="Compute and apply next version")
    args = parser.parse_args()

    if args.current and (args.version or args.next):
        print("ERROR: --current cannot be combined with version or --next.", file=sys.stderr)
        return 1

    pkg = _read_json(PACKAGE_JSON)
    current = pkg.get("version", "")
    if not isinstance(current, str) or not current:
        print("ERROR: package.json missing version", file=sys.stderr)
        return 1

    _parse(current)

    if args.current:
        print(f"Current version: {current}")
        return 0

    if args.version and args.next:
        print("ERROR: explicit version and --next cannot be combined.", file=sys.stderr)
        return 1

    if args.next:
        target = _compute_next(current, args.next)
        old, new = _set_version(target)
        print(f"Updated version: {old} -> {new}")
        return 0

    if args.version:
        old, new = _set_version(args.version)
        if old == new:
            print(f"No change: version already {old}")
            return 0
        print(f"Updated version: {old} -> {new}")
        return 0

    print("ERROR: specify one of --current, --next, or explicit version.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
