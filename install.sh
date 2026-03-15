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

detect_package_manager() {
  if command -v apt-get >/dev/null 2>&1; then
    printf 'apt-get'
    return
  fi
  if command -v dnf >/dev/null 2>&1; then
    printf 'dnf'
    return
  fi
  if command -v yum >/dev/null 2>&1; then
    printf 'yum'
    return
  fi
  if command -v zypper >/dev/null 2>&1; then
    printf 'zypper'
    return
  fi
  if command -v apk >/dev/null 2>&1; then
    printf 'apk'
    return
  fi
  if command -v brew >/dev/null 2>&1; then
    printf 'brew'
    return
  fi
  printf 'none'
}

PACKAGE_MANAGER="$(detect_package_manager)"

update_package_index() {
  case "$PACKAGE_MANAGER" in
    apt-get)
      sudo apt-get update
      ;;
    dnf)
      sudo dnf makecache
      ;;
    yum)
      sudo yum makecache
      ;;
    zypper)
      sudo zypper refresh
      ;;
    apk)
      sudo apk update
      ;;
    brew)
      brew update
      ;;
    none)
      ;;
  esac
}

install_packages() {
  if [ "$#" -eq 0 ]; then
    return
  fi

  case "$PACKAGE_MANAGER" in
    apt-get)
      sudo apt-get install -y "$@"
      ;;
    dnf)
      sudo dnf install -y "$@"
      ;;
    yum)
      sudo yum install -y "$@"
      ;;
    zypper)
      sudo zypper install -y "$@"
      ;;
    apk)
      sudo apk add --no-cache "$@"
      ;;
    brew)
      brew install "$@"
      ;;
    none)
      fail "Missing required packages and no supported package manager was found."
      ;;
  esac
}

ensure_base_prerequisites() {
  local need_update=0
  local packages=()

  if ! command -v git >/dev/null 2>&1; then
    case "$PACKAGE_MANAGER" in
      apt-get|dnf|yum|zypper|apk|brew)
        packages+=("git")
        need_update=1
        ;;
      none)
        fail "git is required but not found. Install git and re-run."
        ;;
    esac
  fi

  if ! command -v curl >/dev/null 2>&1; then
    case "$PACKAGE_MANAGER" in
      apt-get|dnf|yum|zypper|apk|brew)
        packages+=("curl")
        need_update=1
        ;;
      none)
        fail "curl is required but not found. Install curl and re-run."
        ;;
    esac
  fi

  if ! command -v "${PYTHON_BIN}" >/dev/null 2>&1; then
    case "$PACKAGE_MANAGER" in
      apt-get|apk)
        packages+=("python3")
        need_update=1
        ;;
      dnf|yum|zypper|brew)
        packages+=("python3")
        need_update=1
        ;;
      none)
        fail "${PYTHON_BIN} is required but not found. Install Python 3 and re-run."
        ;;
    esac
  fi

  if [ "$need_update" -eq 1 ]; then
    log "Installing base prerequisites via ${PACKAGE_MANAGER}"
    update_package_index
    install_packages "${packages[@]}"
  fi
}

ensure_python_venv_support() {
  local packages=()

  if "${PYTHON_BIN}" -m venv --help >/dev/null 2>&1; then
    return
  fi

  case "$PACKAGE_MANAGER" in
    apt-get)
      packages=("python3-venv")
      ;;
    dnf|yum)
      packages=("python3")
      ;;
    zypper)
      packages=("python3-virtualenv")
      ;;
    apk)
      packages=("python3")
      ;;
    brew)
      return
      ;;
    none)
      fail "Python venv support is required but could not be auto-installed."
      ;;
  esac

  if [ "${#packages[@]}" -gt 0 ]; then
    log "Installing Python venv support via ${PACKAGE_MANAGER}"
    update_package_index
    install_packages "${packages[@]}"
  fi
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
  log "Installing Python documentation dependencies"
  .venv/bin/python -m pip install -r requirements-docs.txt >/dev/null
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
  ensure_base_prerequisites
  ensure_command git "git is required but not found. Install git and re-run."
  ensure_command curl "curl is required but not found. Install curl and re-run."
  ensure_command "${PYTHON_BIN}" "${PYTHON_BIN} is required but not found. Install Python 3 and re-run."
  ensure_python_venv_support

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
