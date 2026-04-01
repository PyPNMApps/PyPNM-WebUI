#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

COMMIT_MSG="Update"
DO_PUSH=0
SKIP_CHECKS=0

usage() {
  cat <<'EOF'
Stage and commit the current Git repository.

Usage:
  git-save.sh [--commit-msg "Message"] [--push] [--skip-checks]

Options:
  --commit-msg  Commit message prefix (default: "Update").
  --push        Push the current branch after commit.
  --skip-checks Skip wrapper quality checks.
  -h, --help    Show this help.
  -v, --version Show script version.
EOF
}

version() {
  echo "git-save.sh 1.0.0"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --commit-msg)
      shift
      COMMIT_MSG="${1:-}"
      ;;
    --push)
      DO_PUSH=1
      ;;
    --skip-checks)
      SKIP_CHECKS=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    -v|--version)
      version
      exit 0
      ;;
    *)
      echo "ERROR: Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
  shift
done

cd "${REPO_ROOT}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[fail] Not inside a git repository." >&2
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "========================================"
echo "Git Save"
echo "Branch: ${BRANCH}"
echo "Changes:"
git status --short
echo "========================================"

if [[ "${SKIP_CHECKS}" -ne 1 ]]; then
  echo "Running quality checks..."

  echo "[check] Shell syntax..."
  bash -n install.sh uninstall.sh tools/install/delegate-to-pcw.sh tools/git/git-save.sh
  echo "[pass]  Shell syntax"

  echo "[check] mkdocs build --strict..."
  if command -v mkdocs >/dev/null 2>&1; then
    mkdocs build --strict >/dev/null
  else
    python3 -m pip install -q -r requirements-docs.txt
    mkdocs build --strict >/dev/null
  fi
  echo "[pass]  mkdocs build --strict"
fi

if git diff --quiet && git diff --cached --quiet; then
  echo "[pass] No changes to commit."
  exit 0
fi

git add -A
git commit -m "${COMMIT_MSG}"
echo "[pass] Commit created."

if [[ "${DO_PUSH}" -eq 1 ]]; then
  git push
  echo "[pass] Changes pushed."
fi
