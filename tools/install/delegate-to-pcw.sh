#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=""
PCW_DIR=""
PCW_REPO="https://github.com/PyPNMApps/PyPNM-CMTS-WebUI.git"
PCW_REF=""
PROFILE="pypnm-webui"
DO_PULL=1
EXTRA_ARGS=()

log() {
  printf '[install] %s\n' "$1"
}

fail() {
  printf '[install][error] %s\n' "$1" >&2
  exit 1
}

usage() {
  cat <<'EOF'
Usage:
  delegate-to-pcw.sh --root-dir <path> [options] [-- <extra-pcw-install-args>]

Options:
  --with-pypnm-webui
  --with-pypnm-cmts-webui
  --pcw-dir <path>
  --pcw-repo <url>
  --pcw-ref <ref>
  --no-pull
  --help, -h
EOF
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --root-dir)
        shift
        ROOT_DIR="${1:-}"
        ;;
      --with-pypnm-webui)
        PROFILE="pypnm-webui"
        ;;
      --with-pypnm-cmts-webui)
        PROFILE="pypnm-cmts-webui"
        ;;
      --pcw-dir)
        shift
        PCW_DIR="${1:-}"
        ;;
      --pcw-repo)
        shift
        PCW_REPO="${1:-}"
        ;;
      --pcw-ref)
        shift
        PCW_REF="${1:-}"
        ;;
      --no-pull)
        DO_PULL=0
        ;;
      --help|-h)
        usage
        exit 0
        ;;
      --)
        shift
        while [[ $# -gt 0 ]]; do
          EXTRA_ARGS+=("$1")
          shift
        done
        break
        ;;
      *)
        EXTRA_ARGS+=("$1")
        ;;
    esac
    shift
  done
}

ensure_prereqs() {
  command -v git >/dev/null 2>&1 || fail "git is required."
  [[ "${ROOT_DIR}" != "" ]] || fail "--root-dir is required."
  if [[ "${PCW_DIR}" == "" ]]; then
    PCW_DIR="$(cd "${ROOT_DIR}/.." && pwd)/PyPNM-CMTS-WebUI"
  fi
}

sync_pcw_repo() {
  if [[ -d "${PCW_DIR}/.git" ]]; then
    log "Using existing unified repo at ${PCW_DIR}"
    if [[ "${DO_PULL}" -eq 1 ]]; then
      log "Updating unified repo from origin"
      git -C "${PCW_DIR}" fetch --tags origin
      if [[ "${PCW_REF}" == "" ]]; then
        git -C "${PCW_DIR}" pull --ff-only
      fi
    fi
  else
    log "Cloning unified repo to ${PCW_DIR}"
    git clone "${PCW_REPO}" "${PCW_DIR}"
  fi

  if [[ "${PCW_REF}" != "" ]]; then
    log "Checking out unified repo ref ${PCW_REF}"
    git -C "${PCW_DIR}" fetch --tags origin
    git -C "${PCW_DIR}" checkout "${PCW_REF}"
  fi
}

run_pcw_install() {
  local profile_flag=""
  case "${PROFILE}" in
    pypnm-webui)
      profile_flag="--with-pypnm-webui"
      ;;
    pypnm-cmts-webui)
      profile_flag="--with-pypnm-cmts-webui"
      ;;
    *)
      fail "Unsupported profile: ${PROFILE}"
      ;;
  esac

  if [[ "${PYPNM_WEBUI_WRAPPER_TEST:-}" == "1" ]]; then
    log "Wrapper test mode enabled; not executing downstream install."
    log "Would run: ${PCW_DIR}/install.sh ${profile_flag} ${EXTRA_ARGS[*]}"
    return 0
  fi

  [[ -x "${PCW_DIR}/install.sh" ]] || fail "Unified install.sh not found in ${PCW_DIR}"
  log "Delegating install to unified repo (${PROFILE})"
  "${PCW_DIR}/install.sh" "${profile_flag}" "${EXTRA_ARGS[@]}"
}

main() {
  parse_args "$@"
  ensure_prereqs
  if [[ "${PYPNM_WEBUI_WRAPPER_TEST:-}" == "1" ]]; then
    run_pcw_install
    return 0
  fi
  sync_pcw_repo
  run_pcw_install
}

main "$@"
