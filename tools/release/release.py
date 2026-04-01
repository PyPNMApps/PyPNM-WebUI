#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path


def parse_args(argv: list[str]) -> tuple[argparse.Namespace, list[str]]:
    parser = argparse.ArgumentParser(
        description="PyPNM-WebUI release helper. Defaults to PW-local checks.",
        add_help=True,
    )
    parser.add_argument(
        "--delegate-unified",
        action="store_true",
        help="Delegate release execution to unified PyPNM-CMTS-WebUI release.py.",
    )
    parser.add_argument(
        "--pcw-dir",
        default="../PyPNM-CMTS-WebUI",
        help="Unified repo path used only with --delegate-unified.",
    )
    parser.add_argument(
        "--pcw-ref",
        default="",
        help="Optional git ref to checkout before unified delegation.",
    )
    parser.add_argument(
        "--no-push",
        action="store_true",
        help="Skip git push in PW-local release mode.",
    )
    args, passthrough = parser.parse_known_args(argv)
    return args, passthrough


def run_local_pw_release(repo_root: Path, passthrough: list[str], *, no_push: bool) -> int:
    if passthrough:
        print(
            f"[release][error] Unsupported PW-local args: {' '.join(passthrough)}",
            file=sys.stderr,
        )
        print(
            "[release][hint] Use --delegate-unified to pass through args to unified release.py.",
            file=sys.stderr,
        )
        return 1

    print(f"[release] Running PW-local release checks in {repo_root}")
    subprocess.run(["bash", "-n", "install.sh", "uninstall.sh", "tools/install/delegate-to-pcw.sh"], cwd=repo_root, check=True)
    subprocess.run(["mkdocs", "build", "--strict"], cwd=repo_root, check=True)
    if no_push:
        print("[release] --no-push set; skipping git push.")
    else:
        branch = (
            subprocess.check_output(
                ["git", "-C", str(repo_root), "rev-parse", "--abbrev-ref", "HEAD"],
                text=True,
            )
            .strip()
        )
        print(f"[release] Pushing {branch} to remote...")
        subprocess.run(["git", "-C", str(repo_root), "push"], check=True)
        print(f"[release] Push complete for {branch}.")
    print("[release] PW-local checks complete.")
    return 0


def run_unified_delegate(
    repo_root: Path,
    pcw_dir: Path,
    pcw_ref: str,
    passthrough: list[str],
) -> int:
    delegate = pcw_dir / "tools" / "release" / "release.py"
    if not delegate.exists():
        print(f"[release][error] Unified release script not found: {delegate}", file=sys.stderr)
        print(
            "[release][hint] Run ./install.sh first or pass --pcw-dir to a valid unified checkout.",
            file=sys.stderr,
        )
        return 1

    if pcw_ref:
        subprocess.run(["git", "-C", str(pcw_dir), "fetch", "--tags", "origin"], check=True)
        subprocess.run(["git", "-C", str(pcw_dir), "checkout", pcw_ref], check=True)

    cmd = [sys.executable, str(delegate), *passthrough]
    env = os.environ.copy()
    env.setdefault("PYPNM_WRAPPER_CALLER_REPO", str(repo_root))
    print(f"[release] Delegating to unified release tool: {' '.join(cmd)}")
    return subprocess.call(cmd, cwd=str(pcw_dir), env=env)


def main(argv: list[str]) -> int:
    args, passthrough = parse_args(argv)
    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parent.parent

    if args.delegate_unified:
        pcw_dir = (repo_root / args.pcw_dir).resolve()
        return run_unified_delegate(repo_root, pcw_dir, args.pcw_ref, passthrough)

    return run_local_pw_release(repo_root, passthrough, no_push=args.no_push)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
