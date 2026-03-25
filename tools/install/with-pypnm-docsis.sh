#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=""
PYTHON_BIN="python3"
PYPNM_DOCSIS_PATH=""
PYPNM_DOCSIS_VERSION=""
LOCAL_API_HOST=""
RECONFIGURE_LOCAL_AGENT=0
BACKEND_VENV_PATH=".pypnm-venv"
RUNTIME_TEMPLATE_PATH="public/config/pypnm-instances.yaml"
RUNTIME_LOCAL_PATH="public/config/pypnm-instances.local.yaml"

log() {
  printf '[install][pypnm-docsis] %s\n' "$1"
}

fail() {
  printf '[install][pypnm-docsis][error] %s\n' "$1" >&2
  exit 1
}

print_help() {
  cat <<'EOF'
Usage:
  ./tools/install/with-pypnm-docsis.sh --root-dir <repo-root> [options]

Options:
  --root-dir <path>              PyPNM-WebUI repo root (required).
  --python-bin <python>          Python executable to use (default: python3).
  --pypnm-docsis-path <path>     Install from a local PyPNM checkout.
  --pypnm-docsis-version <ver>   Install a specific pypnm-docsis version from pip.
  --local-api-host <host>        Preselect the local API host without prompting.
  --reconfigure-local-agent      Ignore any previously configured local API host.
  -h, --help                     Show this help.
EOF
}

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --root-dir)
        shift
        ROOT_DIR="${1:-}"
        ;;
      --python-bin)
        shift
        PYTHON_BIN="${1:-}"
        ;;
      --pypnm-docsis-path)
        shift
        PYPNM_DOCSIS_PATH="${1:-}"
        ;;
      --pypnm-docsis-version)
        shift
        PYPNM_DOCSIS_VERSION="${1:-}"
        ;;
      --local-api-host)
        shift
        LOCAL_API_HOST="${1:-}"
        ;;
      --reconfigure-local-agent)
        RECONFIGURE_LOCAL_AGENT=1
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

run_backend_python() {
  env -u PYTHONPATH -u PYTHONHOME "${ROOT_DIR}/${BACKEND_VENV_PATH}/bin/python" -I "$@"
}

ensure_backend_venv() {
  if [ ! -d "${ROOT_DIR}/${BACKEND_VENV_PATH}" ]; then
    log "Creating backend virtual environment (${BACKEND_VENV_PATH})"
    env -u PYTHONPATH -u PYTHONHOME "${PYTHON_BIN}" -I -m venv "${ROOT_DIR}/${BACKEND_VENV_PATH}"
  else
    log "Keeping existing backend virtual environment (${BACKEND_VENV_PATH})"
  fi

  log "Upgrading backend pip tooling"
  run_backend_python -m pip install --upgrade pip setuptools wheel >/dev/null
}

install_pypnm_docsis() {
  if [ -n "${PYPNM_DOCSIS_PATH}" ]; then
    if [ ! -f "${PYPNM_DOCSIS_PATH}/pyproject.toml" ]; then
      fail "Local pypnm-docsis path does not contain pyproject.toml: ${PYPNM_DOCSIS_PATH}"
    fi
    log "Installing pypnm-docsis from local checkout: ${PYPNM_DOCSIS_PATH}"
    run_backend_python -m pip install -e "${PYPNM_DOCSIS_PATH}"
  elif [ -n "${PYPNM_DOCSIS_VERSION}" ]; then
    log "Installing pypnm-docsis==${PYPNM_DOCSIS_VERSION} from pip"
    run_backend_python -m pip install "pypnm-docsis==${PYPNM_DOCSIS_VERSION}"
  else
    log "Installing pypnm-docsis from pip"
    run_backend_python -m pip install pypnm-docsis
  fi

  if ! "${ROOT_DIR}/${BACKEND_VENV_PATH}/bin/pypnm" --version >/dev/null 2>&1; then
    fail "Installed backend does not expose the pypnm CLI."
  fi
}

detect_ipv4_candidates() {
  if command -v ip >/dev/null 2>&1; then
    ip -o -4 addr show up scope global | awk '{print $2, $4}'
    return
  fi

  if command -v hostname >/dev/null 2>&1; then
    hostname -I 2>/dev/null | tr ' ' '\n' | awk 'NF {print "host", $1}'
    return
  fi
}

read_existing_local_host() {
  local existing_path=""
  if [ "${RECONFIGURE_LOCAL_AGENT}" -eq 0 ] && [ -f "${ROOT_DIR}/${RUNTIME_LOCAL_PATH}" ]; then
    existing_path="${ROOT_DIR}/${RUNTIME_LOCAL_PATH}"
  fi

  node --input-type=module <<EOF
import fs from "node:fs";
import { parse } from "yaml";
import { readConfiguredLocalPyPnmHost } from "${ROOT_DIR}/tools/install/local_pypnm_docsis.js";

const configPath = ${existing_path@Q};
if (!configPath || !fs.existsSync(configPath)) {
  process.stdout.write("");
  process.exit(0);
}

const raw = fs.readFileSync(configPath, "utf8");
const config = parse(raw) ?? {};
process.stdout.write(readConfiguredLocalPyPnmHost(config));
EOF
}

resolve_local_api_host() {
  local explicit_host="${LOCAL_API_HOST}"
  local existing_host
  existing_host="$(read_existing_local_host)"
  local interactive="true"
  if [ ! -t 0 ]; then
    interactive="false"
  fi

  local detection_output
  detection_output="$(detect_ipv4_candidates || true)"

  local decision_json
  decision_json="$(node --input-type=module <<EOF
import { choosePreferredLocalHost, parseIpv4Candidates } from "${ROOT_DIR}/tools/install/local_pypnm_docsis.js";

const explicitHost = ${explicit_host@Q};
const existingHost = ${existing_host@Q};
const rawCandidates = ${detection_output@Q};
const isInteractive = ${interactive};

process.stdout.write(JSON.stringify(
  choosePreferredLocalHost({
    explicitHost,
    existingHost,
    candidates: parseIpv4Candidates(rawCandidates),
    isInteractive,
  }),
));
EOF
)"

  local needs_prompt
  needs_prompt="$(node --input-type=module <<EOF
const decision = JSON.parse(${decision_json@Q});
process.stdout.write(decision.needsPrompt ? "1" : "0");
EOF
)"

  if [ "${needs_prompt}" != "1" ]; then
    node --input-type=module <<EOF
const decision = JSON.parse(${decision_json@Q});
process.stdout.write(decision.host);
EOF
    return
  fi

  local choice_lines
  choice_lines="$(node --input-type=module <<EOF
const decision = JSON.parse(${decision_json@Q});
for (let index = 0; index < decision.choices.length; index += 1) {
  const choice = decision.choices[index];
  process.stdout.write(\`\${index + 1}|\\\${choice.host}|\\\${choice.label}|\\\${choice.detail}\\n\`);
}
EOF
)"

  log "Select the local PyPNM API host for WebUI runtime config:"
  while IFS='|' read -r index host label detail; do
    [ -n "${index}" ] || continue
    printf '  %s) %s - %s\n' "${index}" "${label}" "${detail}"
  done <<EOF
${choice_lines}
EOF

  local default_selection="1"
  local selection=""
  read -r -p "Selection [${default_selection}]: " selection || true
  selection="${selection:-${default_selection}}"

  local selected_host=""
  while IFS='|' read -r index host label detail; do
    if [ "${index}" = "${selection}" ]; then
      selected_host="${host}"
      break
    fi
  done <<EOF
${choice_lines}
EOF

  if [ -z "${selected_host}" ]; then
    fail "Invalid local API host selection: ${selection}"
  fi

  printf '%s' "${selected_host}"
}

write_local_runtime_config() {
  local selected_host="$1"

  log "Updating local runtime config for Local PyPNM Agent (${selected_host}:8000)"
  node --input-type=module <<EOF
import fs from "node:fs";
import path from "node:path";
import { parse, stringify } from "yaml";
import { applyLocalPyPnmAgentConfig } from "${ROOT_DIR}/tools/install/local_pypnm_docsis.js";

const templatePath = "${ROOT_DIR}/${RUNTIME_TEMPLATE_PATH}";
const outputPath = "${ROOT_DIR}/${RUNTIME_LOCAL_PATH}";
const localPath = fs.existsSync(outputPath) ? outputPath : "";
const templateConfig = parse(fs.readFileSync(templatePath, "utf8")) ?? {};
const localConfig = localPath ? (parse(fs.readFileSync(localPath, "utf8")) ?? {}) : {};
const merged = applyLocalPyPnmAgentConfig(templateConfig, localConfig, ${selected_host@Q});
const nextContent = stringify(merged, { indent: 2 });

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
if (fs.existsSync(outputPath)) {
  const existingContent = fs.readFileSync(outputPath, "utf8");
  if (existingContent !== nextContent) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.copyFileSync(outputPath, `${outputPath}.${timestamp}.bak`);
  }
}
fs.writeFileSync(outputPath, nextContent, "utf8");
EOF
}

install_local_stack_shim() {
  local user_bin_dir="${HOME}/.local/bin"
  local shim_path="${user_bin_dir}/pypnm-webui-local-stack"

  mkdir -p "${user_bin_dir}"
  printf '%s\n' "#!/usr/bin/env bash" >"${shim_path}"
  printf '%s\n' "exec \"${ROOT_DIR}/tools/install/start-local-stack.sh\" \"\$@\"" >>"${shim_path}"
  chmod +x "${shim_path}"
  log "Installed local-stack helper at ${shim_path}"
}

main() {
  parse_args "$@"

  [ -n "${ROOT_DIR}" ] || fail "--root-dir is required."
  cd "${ROOT_DIR}"

  ensure_backend_venv
  install_pypnm_docsis

  local selected_host
  selected_host="$(resolve_local_api_host)"
  write_local_runtime_config "${selected_host}"
  install_local_stack_shim

  log "Combined local install complete"
  log "Local PyPNM API URL: http://${selected_host}:8000"
  log "Start both services with: pypnm-webui start-local-stack"
}

main "$@"
