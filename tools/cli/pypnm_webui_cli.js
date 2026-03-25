import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import packageJson from "../../package.json" with { type: "json" };
import {
  configPathFromRepoRoot,
  ensureLocalRuntimeConfig,
  runConfigMenu,
  templateConfigPathFromRepoRoot,
} from "../config-menu/config_menu.js";

const SUCCESS_EXIT_CODE = 0;
const EXIT_CODE_USAGE = 2;
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 4173;
const DEFAULT_LOG_LEVEL = "info";
const VALID_LOG_LEVELS = new Set(["silent", "error", "warn", "info"]);

function repoRootFromModule(metaUrl) {
  const cliDir = path.dirname(fileURLToPath(metaUrl));
  return path.resolve(cliDir, "../..");
}

function readCliVersion(metaUrl) {
  const repoRoot = repoRootFromModule(metaUrl);
  const versionPath = path.join(repoRoot, "VERSION");
  try {
    const version = fs.readFileSync(versionPath, "utf8").trim();
    if (version) {
      return version;
    }
  } catch {
    // fall through to package.json version
  }
  return packageJson.version;
}

function printRootHelp() {
  process.stdout.write(
    [
      "PyPNM-WebUI CLI for local development and preview workflows.",
      "",
      "Usage:",
      "  pypnm-webui <command> [options]",
      "",
      "Commands:",
      "  serve        Start the Vite development server.",
      "  config-menu  Launch the interactive pypnm-instances.yaml editor.",
      "  start-local-stack  Start local pypnm-docsis and WebUI together.",
      "  kill-pypnm-webui  List or stop running local PyPNM-WebUI processes.",
      "",
      "Options:",
      "  -h, --help   Show this help.",
      "  -v, --version Show version and exit.",
      "",
      "Examples:",
      "  pypnm-webui serve",
      "  pypnm-webui serve --host 0.0.0.0 --port 4173",
      "  pypnm-webui serve --open",
      "  pypnm-webui config-menu",
      "  pypnm-webui start-local-stack",
      "",
      'Use "pypnm-webui <command> --help" for command-specific options.',
      "",
    ].join("\n"),
  );
}

function printServeHelp() {
  process.stdout.write(
    [
      "Start the PyPNM-WebUI Vite development server.",
      "",
      "Usage:",
      "  pypnm-webui serve [options]",
      "",
      "Options:",
      `  --host <host>        Host to bind (default: ${DEFAULT_HOST})`,
      `  --port <port>        Port to bind (default: ${DEFAULT_PORT})`,
      "  --open               Open the browser on startup.",
      "  --strict-port        Exit if the port is already in use.",
      `  --log-level <level>  Vite log level: ${Array.from(VALID_LOG_LEVELS).join(", ")} (default: ${DEFAULT_LOG_LEVEL})`,
      "  --mode <mode>        Vite mode override.",
      "  --base <path>        Public base path override.",
      "  -h, --help           Show this help.",
      "",
      "Examples:",
      "  pypnm-webui serve",
      "  pypnm-webui serve --host 0.0.0.0 --port 4173",
      "  pypnm-webui serve --strict-port --log-level warn",
      "",
    ].join("\n"),
  );
}

function printConfigMenuHelp() {
  process.stdout.write(
    [
      "Launch the interactive pypnm-instances.yaml configuration menu.",
      "",
      "Usage:",
      "  pypnm-webui config-menu",
      "",
      "Behavior:",
      "  - edits public/config/pypnm-instances.local.yaml",
      "  - manages PyPNM agent entries",
      "  - edits per-agent request defaults like MAC, IP, TFTP, and SNMP RW community",
      "  - saves after each edit",
      "  - creates a timestamped backup before overwriting prior config content",
      "",
    ].join("\n"),
  );
}

function printStartLocalStackHelp() {
  process.stdout.write(
    [
      "Start local pypnm-docsis and PyPNM-WebUI together.",
      "",
      "Usage:",
      "  pypnm-webui start-local-stack [options]",
      "",
      "Options:",
      "  --api-host <host>     Bind host for both backend and WebUI (default: 0.0.0.0)",
      "  --api-port <port>     Backend bind port (default: 8000)",
      "  --webui-host <host>   Deprecated alias for --api-host.",
      "  --webui-port <port>   WebUI bind port (default: 4173)",
      "  --reload-api          Enable PyPNM auto-reload.",
      "",
    ].join("\n"),
  );
}

function printKillWebUiHelp() {
  process.stdout.write(
    [
      "List or stop local PyPNM-WebUI processes for this repo.",
      "",
      "Usage:",
      "  pypnm-webui kill-pypnm-webui --list",
      "  pypnm-webui kill-pypnm-webui --kill [INDEX_OR_PID]",
      "  pypnm-webui kill-pypnm-webui --kill-all",
      "",
      "Behavior:",
      "  - matches running PyPNM-WebUI / Vite processes for this repo only",
      "  - --kill with no argument shows numbered entries and prompts for a selection",
      "  - --kill accepts either a list index or an exact PID",
      "",
    ].join("\n"),
  );
}

function failUsage(message) {
  process.stderr.write(`ERROR: ${message}\n`);
  return EXIT_CODE_USAGE;
}

function parseServeArgs(args) {
  const options = {
    host: DEFAULT_HOST,
    port: DEFAULT_PORT,
    open: false,
    strictPort: false,
    logLevel: DEFAULT_LOG_LEVEL,
    mode: "",
    base: "",
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "-h" || arg === "--help") {
      printServeHelp();
      return { exitCode: SUCCESS_EXIT_CODE };
    }

    if (arg === "--open") {
      options.open = true;
      continue;
    }

    if (arg === "--strict-port") {
      options.strictPort = true;
      continue;
    }

    if (arg === "--host" || arg === "--port" || arg === "--log-level" || arg === "--mode" || arg === "--base") {
      const next = args[index + 1];
      if (!next || next.startsWith("-")) {
        return { exitCode: failUsage(`Missing value for ${arg}`) };
      }

      if (arg === "--host") {
        options.host = next;
      } else if (arg === "--port") {
        const parsedPort = Number.parseInt(next, 10);
        if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
          return { exitCode: failUsage(`Invalid port: ${next}`) };
        }
        options.port = parsedPort;
      } else if (arg === "--log-level") {
        if (!VALID_LOG_LEVELS.has(next)) {
          return { exitCode: failUsage(`Invalid log level: ${next}`) };
        }
        options.logLevel = next;
      } else if (arg === "--mode") {
        options.mode = next;
      } else if (arg === "--base") {
        options.base = next;
      }

      index += 1;
      continue;
    }

    return { exitCode: failUsage(`Unknown serve argument: ${arg}`) };
  }

  return { options };
}

function buildViteServeArgs(options) {
  const args = [
    "--host",
    options.host,
    "--port",
    String(options.port),
    "--logLevel",
    options.logLevel,
  ];

  if (options.open) {
    args.push("--open");
  }
  if (options.strictPort) {
    args.push("--strictPort");
  }
  if (options.mode) {
    args.push("--mode", options.mode);
  }
  if (options.base) {
    args.push("--base", options.base);
  }

  return args;
}

function runServe(options, metaUrl) {
  const repoRoot = repoRootFromModule(metaUrl);
  const runtimeConfigResult = ensureLocalRuntimeConfig(
    configPathFromRepoRoot(repoRoot),
    templateConfigPathFromRepoRoot(repoRoot),
  );
  if (runtimeConfigResult.generated) {
    process.stdout.write(
      "INFO: No runtime YAML config file was found. Generated public/config/pypnm-instances.local.yaml\n",
    );
  }
  const viteBin = path.join(repoRoot, "node_modules", "vite", "bin", "vite.js");
  const viteArgs = buildViteServeArgs(options);
  const child = spawn(process.execPath, [viteBin, ...viteArgs], {
    cwd: repoRoot,
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });

  child.on("error", (error) => {
    process.stderr.write(`ERROR: Failed to start Vite: ${error.message}\n`);
    process.exit(1);
  });

  return SUCCESS_EXIT_CODE;
}

function runMaintenanceScript(metaUrl, relativeScriptPath, scriptArgs) {
  const repoRoot = repoRootFromModule(metaUrl);
  const scriptPath = path.join(repoRoot, relativeScriptPath);
  const child = spawn("bash", [scriptPath, ...scriptArgs], {
    cwd: repoRoot,
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });

  child.on("error", (error) => {
    process.stderr.write(`ERROR: Failed to run maintenance script: ${error.message}\n`);
    process.exit(1);
  });

  return SUCCESS_EXIT_CODE;
}

export async function runCli(args, metaUrl) {
  if (args.length === 0 || args[0] === "-h" || args[0] === "--help") {
    printRootHelp();
    return SUCCESS_EXIT_CODE;
  }

  if (args[0] === "-v" || args[0] === "--version") {
    process.stdout.write(`${readCliVersion(metaUrl)}\n`);
    return SUCCESS_EXIT_CODE;
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  if (command === "serve") {
    const parsed = parseServeArgs(commandArgs);
    if ("exitCode" in parsed) {
      return parsed.exitCode;
    }
    runServe(parsed.options, metaUrl);
    return null;
  }

  if (command === "config-menu") {
    if (commandArgs.includes("-h") || commandArgs.includes("--help")) {
      printConfigMenuHelp();
      return SUCCESS_EXIT_CODE;
    }
    return runConfigMenu(metaUrl);
  }

  if (command === "kill-pypnm-webui") {
    if (commandArgs.includes("-h") || commandArgs.includes("--help")) {
      printKillWebUiHelp();
      return SUCCESS_EXIT_CODE;
    }
    runMaintenanceScript(metaUrl, "tools/maintenance/kill-pypnm-webui.sh", commandArgs);
    return null;
  }

  if (command === "start-local-stack") {
    if (commandArgs.includes("-h") || commandArgs.includes("--help")) {
      printStartLocalStackHelp();
      return SUCCESS_EXIT_CODE;
    }
    runMaintenanceScript(metaUrl, "tools/install/start-local-stack.sh", commandArgs);
    return null;
  }

  return failUsage(`Unknown command: ${command}`);
}
