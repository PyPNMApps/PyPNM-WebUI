#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HELPER="${ROOT_DIR}/tools/install/delegate-to-pcw.sh"

usage() {
  cat <<'EOF'
PyPNM-WebUI Wrapper Installer

This repository is a wrapper that delegates installation to the unified
PyPNM-CMTS-WebUI repository.

Usage:
  ./install.sh [options] [-- <extra-pcw-install-args>]

Options:
  --with-pypnm-webui        Install unified repo in PW compatibility profile.
                            (Default when no profile flag is provided.)
  --with-pypnm-cmts-webui   Install unified repo in PCW profile.
  --pcw-dir <path>          Existing or target checkout directory for
                            PyPNM-CMTS-WebUI.
                            (Default: ../PyPNM-CMTS-WebUI)
  --pcw-repo <url>          Git URL used when cloning unified repo.
  --pcw-ref <ref>           Optional branch/tag/SHA to checkout in unified repo.
  --no-pull                 Do not pull latest changes when unified repo exists.
  -h, --help                Show this help.

Examples:
  ./install.sh
  ./install.sh --with-pypnm-webui
  ./install.sh --with-pypnm-cmts-webui
  ./install.sh --pcw-dir ../PyPNM-CMTS-WebUI --with-pypnm-webui
  ./install.sh --with-pypnm-webui -- --with-pypnm-docsis
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ ! -x "${HELPER}" ]]; then
  echo "[install][error] Missing helper script: ${HELPER}" >&2
  exit 1
fi

exec "${HELPER}" --root-dir "${ROOT_DIR}" "$@"
