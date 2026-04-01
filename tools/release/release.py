#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path


def parse_args(argv: list[str]) -> tuple[argparse.Namespace, list[str]]:
    parser = argparse.ArgumentParser(
        description="PyPNM-WebUI wrapper release entrypoint. Delegates to unified repo release tool.",
        add_help=True,
    )
    parser.add_argument(
        "--pcw-dir",
        default="../PyPNM-CMTS-WebUI",
        help="Path to unified PyPNM-CMTS-WebUI checkout (default: ../PyPNM-CMTS-WebUI).",
    )
    parser.add_argument(
        "--pcw-ref",
        default="",
        help="Optional git ref to checkout in unified repo before release delegation.",
    )
    args, passthrough = parser.parse_known_args(argv)
    return args, passthrough


def main(argv: list[str]) -> int:
    args, passthrough = parse_args(argv)

    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parent.parent
    pcw_dir = (repo_root / args.pcw_dir).resolve()
    delegate = pcw_dir / "tools" / "release" / "release.py"

    if not delegate.exists():
        print(
            f"[release][error] Unified release script not found: {delegate}",
            file=sys.stderr,
        )
        print(
            "[release][hint] Run ./install.sh first or pass --pcw-dir to a valid unified checkout.",
            file=sys.stderr,
        )
        return 1

    if args.pcw_ref:
        subprocess.run(["git", "-C", str(pcw_dir), "fetch", "--tags", "origin"], check=True)
        subprocess.run(["git", "-C", str(pcw_dir), "checkout", args.pcw_ref], check=True)

    cmd = [sys.executable, str(delegate), *passthrough]
    env = os.environ.copy()
    env.setdefault("PYPNM_WRAPPER_CALLER_REPO", str(repo_root))

    print(f"[release] Delegating to unified release tool: {' '.join(cmd)}")
    return subprocess.call(cmd, cwd=str(pcw_dir), env=env)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
