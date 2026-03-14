#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NVM_VERSION="v0.40.3"
NODE_MAJOR="22"
PYTHON_BIN="${PYTHON_BIN:-python3}"

log() {
  printf '[install] %s\n' "$1"
}

fail() {
  printf '[install][error] %s\n' "$1" >&2
  exit 1
}

if ! command -v curl >/dev/null 2>&1; then
  fail "curl is required but not found. Install curl and re-run."
fi

if ! command -v "${PYTHON_BIN}" >/dev/null 2>&1; then
  fail "${PYTHON_BIN} is required but not found. Install Python 3 and re-run."
fi

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

cd "$ROOT_DIR"

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

log "Installing npm dependencies"
npm install

log "Registering pypnm-webui CLI"
npm link >/dev/null

if [ ! -d .venv ]; then
  log "Creating Python virtual environment (.venv)"
  "${PYTHON_BIN}" -m venv .venv
else
  log "Keeping existing Python virtual environment (.venv)"
fi

log "Installing Python release-tool dependencies"
.venv/bin/python -m pip install --upgrade pip >/dev/null
.venv/bin/python -m pip install -r tools/release/requirements.txt >/dev/null

log "Install complete"
log "Start dev server with: pypnm-webui serve"
log "Run release workflow with: .venv/bin/python ./tools/release/release.py --help"
