#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NVM_VERSION="v0.40.3"
NODE_MAJOR="22"
PYTHON_BIN="${PYTHON_BIN:-python3}"
UPDATE_WEBUI=0
UPDATE_TAG=""
RUNTIME_TEMPLATE_PATH="public/config/pypnm-instances.yaml"
RUNTIME_LOCAL_PATH="public/config/pypnm-instances.local.yaml"

log() {
  printf '[install] %s\n' "$1"
}

fail() {
  printf '[install][error] %s\n' "$1" >&2
  exit 1
}

print_help() {
  cat <<'EOF'
Usage:
  ./install.sh
  ./install.sh --update-webui [tag]

Options:
  --update-webui [tag]  Update this existing checkout to the latest tag or the
                        provided tag, then reinstall dependencies and refresh
                        the local runtime config override.
  -h, --help            Show this help.
EOF
}

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --update-webui)
        UPDATE_WEBUI=1
        if [ "$#" -gt 1 ] && [[ ! "$2" =~ ^- ]]; then
          UPDATE_TAG="$2"
          shift
        fi
        ;;
      -h|--help)
        print_help
        exit 0
        ;;
      *)
        fail "Unknown argument: $1"
        ;;
    esac
    shift
  done
}

ensure_command() {
  local cmd="$1"
  local message="$2"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    fail "$message"
  fi
}

prepare_nvm() {
  if [ ! -d "$HOME/.nvm" ]; then
    log "Installing nvm ${NVM_VERSION}"
    curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh" | bash
  fi

  export NVM_DIR="$HOME/.nvm"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck source=/dev/null
    . "$NVM_DIR/nvm.sh"
  else
    fail "nvm init script not found at $NVM_DIR/nvm.sh"
  fi

  log "Installing Node ${NODE_MAJOR}"
  nvm install "$NODE_MAJOR"
  nvm use "$NODE_MAJOR"
  nvm alias default "$NODE_MAJOR" >/dev/null

  log "Node version: $(node -v)"
  log "npm version: $(npm -v)"
}

ensure_env_file() {
  if [ ! -f .env ]; then
    if [ -f .env.example ]; then
      cp .env.example .env
      log "Created .env from .env.example"
    else
      fail ".env.example not found"
    fi
  else
    log "Keeping existing .env"
  fi
}

ensure_python_venv() {
  if [ ! -d .venv ]; then
    log "Creating Python virtual environment (.venv)"
    "${PYTHON_BIN}" -m venv .venv
  else
    log "Keeping existing Python virtual environment (.venv)"
  fi

  log "Installing Python release-tool dependencies"
  .venv/bin/python -m pip install --upgrade pip >/dev/null
  .venv/bin/python -m pip install -r tools/release/requirements.txt >/dev/null
}

merge_runtime_config_override() {
  local source_path
  if [ -f "$RUNTIME_LOCAL_PATH" ]; then
    source_path="$RUNTIME_LOCAL_PATH"
  else
    source_path="$RUNTIME_TEMPLATE_PATH"
  fi

  log "Refreshing local runtime config override"
  node --input-type=module <<EOF
import { mergeRuntimeConfigFiles } from "./tools/config-menu/runtime_config_merge.js";

mergeRuntimeConfigFiles({
  templatePath: "${RUNTIME_TEMPLATE_PATH}",
  sourcePath: "${source_path}",
  outputPath: "${RUNTIME_LOCAL_PATH}",
});
EOF
}

ensure_git_clean_for_update() {
  local status
  status="$(git status --porcelain --untracked-files=normal)"
  if [ -n "$status" ]; then
    fail "Working tree is not clean. Commit or stash tracked changes before --update-webui."
  fi
}

resolve_update_ref() {
  if [ -n "$UPDATE_TAG" ]; then
    printf '%s' "$UPDATE_TAG"
    return
  fi

  local latest_tag
  latest_tag="$(git tag --sort=-v:refname | head -n1)"
  if [ -z "$latest_tag" ]; then
    fail "No git tags found. Provide one explicitly: ./install.sh --update-webui <tag>"
  fi
  printf '%s' "$latest_tag"
}

run_update_checkout() {
  ensure_command git "git is required for --update-webui."
  ensure_git_clean_for_update

  cd "$ROOT_DIR"
  log "Fetching latest tags from origin"
  git fetch --tags origin

  local target_ref
  target_ref="$(resolve_update_ref)"
  log "Checking out ${target_ref}"
  git checkout --detach "$target_ref"
}

main() {
  parse_args "$@"

  ensure_command curl "curl is required but not found. Install curl and re-run."
  ensure_command "${PYTHON_BIN}" "${PYTHON_BIN} is required but not found. Install Python 3 and re-run."

  cd "$ROOT_DIR"

  if [ "$UPDATE_WEBUI" -eq 1 ]; then
    run_update_checkout
  fi

  prepare_nvm
  ensure_env_file

  log "Installing npm dependencies"
  npm install

  log "Registering pypnm-webui CLI"
  npm link >/dev/null

  ensure_python_venv
  merge_runtime_config_override

  log "Install complete"
  if [ "$UPDATE_WEBUI" -eq 1 ]; then
    log "Update complete"
  fi
  log "Start dev server with: pypnm-webui serve"
  log "Edit runtime config with: pypnm-webui config-menu"
  log "Run release workflow with: .venv/bin/python ./tools/release/release.py --help"
}

main "$@"
