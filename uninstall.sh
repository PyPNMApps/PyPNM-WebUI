#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PCW_DIR_DEFAULT="$(cd "${ROOT_DIR}/.." && pwd)/PyPNM-CMTS-WebUI"
PCW_DIR="${PCW_DIR_DEFAULT}"
PASS_THROUGH_ARGS=()

usage() {
  cat <<'EOF'
PyPNM-WebUI Wrapper Uninstall

Delegates uninstall to unified PyPNM-CMTS-WebUI.

Usage:
  ./uninstall.sh [options]

Options:
  --pcw-dir <path>     Unified repo path (default: ../PyPNM-CMTS-WebUI)
  --help, -h           Show this help.

All other flags are forwarded to unified repo uninstall.sh.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pcw-dir)
      shift
      PCW_DIR="${1:-}"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      PASS_THROUGH_ARGS+=("$1")
      ;;
  esac
  shift
done

if [[ ! -x "${PCW_DIR}/uninstall.sh" ]]; then
  echo "[uninstall][error] Unified uninstall script not found: ${PCW_DIR}/uninstall.sh" >&2
  echo "[uninstall][hint] Install unified repo first with ./install.sh" >&2
  exit 1
fi

exec "${PCW_DIR}/uninstall.sh" "${PASS_THROUGH_ARGS[@]}"
