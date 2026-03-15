import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

import { parse, stringify } from "yaml";

const DEFAULT_CONFIG = {
  version: 1,
  defaults: {
    selected_instance: "default",
    poll_interval_ms: 5000,
    request_timeout_ms: 30000,
    health_path: "/health",
  },
  instances: [
    {
      id: "default",
      label: "Default",
      base_url: "http://127.0.0.1:8080",
      enabled: true,
      tags: ["env"],
      capabilities: ["health", "analysis"],
      polling: {
        enabled: true,
        interval_ms: 5000,
      },
      request_defaults: {
        cable_modem: {
          mac_address: "",
          ip_address: "",
        },
        tftp: {
          ipv4: "",
          ipv6: "",
        },
        capture: {
          channel_ids: [],
        },
        snmp: {
          rw_community: "private",
        },
      },
    },
  ],
};

function interactiveAllowed() {
  if (process.env.CI || process.env.GITHUB_ACTIONS) {
    return false;
  }
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

function repoRootFromModule(metaUrl) {
  return path.resolve(path.dirname(fileURLToPath(metaUrl)), "../..");
}

function configPathFromRepoRoot(repoRoot) {
  return path.join(repoRoot, "public", "config", "pypnm-instances.local.yaml");
}

function templateConfigPathFromRepoRoot(repoRoot) {
  return path.join(repoRoot, "public", "config", "pypnm-instances.yaml");
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

export function normalizeChannelIds(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => Number.isInteger(item));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "" || trimmed === "0") {
      return [];
    }
    return trimmed
      .split(",")
      .map((item) => Number.parseInt(item.trim(), 10))
      .filter((item) => Number.isInteger(item) && item >= 0);
  }
  return [];
}

function channelIdsToPromptValue(value) {
  const normalized = normalizeChannelIds(value);
  return normalized.length === 0 ? "0" : normalized.join(",");
}

function normalizeInstance(instance, defaults) {
  return {
    id: typeof instance?.id === "string" && instance.id.trim() !== "" ? instance.id.trim() : "default",
    label: typeof instance?.label === "string" && instance.label.trim() !== "" ? instance.label.trim() : "Default",
    base_url:
      typeof instance?.base_url === "string" && instance.base_url.trim() !== ""
        ? instance.base_url.trim()
        : "http://127.0.0.1:8080",
    enabled: instance?.enabled ?? true,
    tags: Array.isArray(instance?.tags) ? instance.tags.filter((item) => typeof item === "string") : [],
    capabilities: Array.isArray(instance?.capabilities)
      ? instance.capabilities.filter((item) => typeof item === "string")
      : ["health", "analysis"],
    polling: {
      enabled: instance?.polling?.enabled ?? true,
      interval_ms: Number.isInteger(instance?.polling?.interval_ms)
        ? instance.polling.interval_ms
        : defaults.poll_interval_ms,
    },
    request_defaults: {
      cable_modem: {
        mac_address: instance?.request_defaults?.cable_modem?.mac_address ?? "",
        ip_address: instance?.request_defaults?.cable_modem?.ip_address ?? "",
      },
      tftp: {
        ipv4: instance?.request_defaults?.tftp?.ipv4 ?? "",
        ipv6: instance?.request_defaults?.tftp?.ipv6 ?? "",
      },
      capture: {
        channel_ids: normalizeChannelIds(instance?.request_defaults?.capture?.channel_ids),
      },
      snmp: {
        rw_community: instance?.request_defaults?.snmp?.rw_community ?? "private",
      },
    },
  };
}

export function normalizeConfig(raw) {
  const base = cloneValue(DEFAULT_CONFIG);
  const defaults = {
    selected_instance:
      typeof raw?.defaults?.selected_instance === "string" && raw.defaults.selected_instance.trim() !== ""
        ? raw.defaults.selected_instance.trim()
        : base.defaults.selected_instance,
    poll_interval_ms:
      Number.isInteger(raw?.defaults?.poll_interval_ms) && raw.defaults.poll_interval_ms > 0
        ? raw.defaults.poll_interval_ms
        : base.defaults.poll_interval_ms,
    request_timeout_ms:
      Number.isInteger(raw?.defaults?.request_timeout_ms) && raw.defaults.request_timeout_ms > 0
        ? raw.defaults.request_timeout_ms
        : base.defaults.request_timeout_ms,
    health_path:
      typeof raw?.defaults?.health_path === "string" && raw.defaults.health_path.trim() !== ""
        ? raw.defaults.health_path.trim()
        : base.defaults.health_path,
  };

  const instances = Array.isArray(raw?.instances) && raw.instances.length > 0
    ? raw.instances.map((instance) => normalizeInstance(instance, defaults))
    : base.instances.map((instance) => normalizeInstance(instance, defaults));

  if (!instances.some((instance) => instance.id === defaults.selected_instance)) {
    defaults.selected_instance = instances[0].id;
  }

  return {
    version: Number.isInteger(raw?.version) && raw.version > 0 ? raw.version : 1,
    defaults,
    instances,
  };
}

function loadConfig(configPath, fallbackPath) {
  if (!fs.existsSync(configPath)) {
    if (fallbackPath && fs.existsSync(fallbackPath)) {
      const fallbackRaw = parse(fs.readFileSync(fallbackPath, "utf8")) ?? {};
      return normalizeConfig(fallbackRaw);
    }
    return cloneValue(DEFAULT_CONFIG);
  }
  const raw = parse(fs.readFileSync(configPath, "utf8")) ?? {};
  return normalizeConfig(raw);
}

function backupPathFor(configPath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${configPath}.${timestamp}.bak`;
}

export function saveConfig(configPath, config) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  const nextContent = stringify(config, { indent: 2 });
  if (fs.existsSync(configPath)) {
    const currentContent = fs.readFileSync(configPath, "utf8");
    if (currentContent !== nextContent) {
      fs.copyFileSync(configPath, backupPathFor(configPath));
    }
  }
  fs.writeFileSync(configPath, nextContent, "utf8");
}

function printConfig(configPath, config) {
  process.stdout.write(`\nConfig Path: ${configPath}\n`);
  process.stdout.write(`${stringify(config, { indent: 2 })}\n`);
}

function slugifyId(value) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "agent";
}

async function promptLine(rl, label, current = "") {
  const suffix = current !== "" ? ` [${current}]` : "";
  const answer = (await rl.question(`${label}${suffix}: `)).trim();
  return answer === "" ? current : answer;
}

async function promptNumber(rl, label, current) {
  while (true) {
    const answer = (await rl.question(`${label} [${current}]: `)).trim();
    if (answer === "") {
      return current;
    }
    const parsed = Number.parseInt(answer, 10);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
    process.stdout.write("Enter a positive integer.\n");
  }
}

async function promptBoolean(rl, label, current) {
  while (true) {
    const currentLabel = current ? "y" : "n";
    const answer = (await rl.question(`${label} [${currentLabel}] (y/n): `)).trim().toLowerCase();
    if (answer === "") {
      return current;
    }
    if (["y", "yes", "true", "1"].includes(answer)) {
      return true;
    }
    if (["n", "no", "false", "0"].includes(answer)) {
      return false;
    }
    process.stdout.write("Enter y or n.\n");
  }
}

async function promptCsv(rl, label, currentValues) {
  const current = currentValues.join(",");
  const answer = (await rl.question(`${label}${current !== "" ? ` [${current}]` : ""}: `)).trim();
  if (answer === "") {
    return currentValues;
  }
  return answer
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

export async function promptSelectedInstance(rl, instances, currentInstanceId) {
  process.stdout.write("\nAvailable selected_instance values:\n");
  instances.forEach((instance, index) => {
    process.stdout.write(`${index + 1}) ${instance.id} | ${instance.label}\n`);
  });

  const currentIndex = Math.max(
    1,
    instances.findIndex((instance) => instance.id === currentInstanceId) + 1,
  );

  while (true) {
    const answer = (await rl.question(`Selected instance [${currentIndex}]: `)).trim();
    if (answer === "") {
      return instances[currentIndex - 1]?.id ?? currentInstanceId;
    }

    const numericSelection = Number.parseInt(answer, 10);
    if (Number.isInteger(numericSelection) && numericSelection >= 1 && numericSelection <= instances.length) {
      return instances[numericSelection - 1].id;
    }

    const directMatch = instances.find((instance) => instance.id === answer);
    if (directMatch) {
      return directMatch.id;
    }

    process.stdout.write("Enter a listed number or a valid instance id.\n");
  }
}

async function editRuntimeDefaults(rl, config) {
  process.stdout.write("\nRuntime Defaults\n================\n");
  config.defaults.poll_interval_ms = await promptNumber(rl, "Default poll interval ms", config.defaults.poll_interval_ms);
  config.defaults.request_timeout_ms = await promptNumber(rl, "Request timeout ms", config.defaults.request_timeout_ms);
  config.defaults.health_path = await promptLine(rl, "Health path", config.defaults.health_path);
  config.defaults.selected_instance = await promptSelectedInstance(rl, config.instances, config.defaults.selected_instance);
}

async function addAgent(rl, config) {
  process.stdout.write("\nAdd PyPNM Agent\n===============\n");
  const label = await promptLine(rl, "Agent label", "");
  const id = await promptLine(rl, "Agent id", slugifyId(label));
  const baseUrl = await promptLine(rl, "Base URL", "http://127.0.0.1:8080");
  const enabled = await promptBoolean(rl, "Enabled", true);
  const tags = await promptCsv(rl, "Tags (comma-separated)", []);
  const capabilities = await promptCsv(rl, "Capabilities (comma-separated)", ["health", "analysis"]);
  const pollingEnabled = await promptBoolean(rl, "Polling enabled", true);
  const pollingInterval = await promptNumber(rl, "Polling interval ms", config.defaults.poll_interval_ms);
  const cableModemMac = await promptLine(rl, "Default cable modem MAC", "");
  const cableModemIp = await promptLine(rl, "Default cable modem IP", "");
  const tftpIpv4 = await promptLine(rl, "Default TFTP IPv4", "");
  const tftpIpv6 = await promptLine(rl, "Default TFTP IPv6", "");
  const channelIds = await promptLine(rl, "Default channel ids (0 means all)", "0");
  const snmpRwCommunity = await promptLine(rl, "Default SNMP RW community", "private");

  const existingIndex = config.instances.findIndex((instance) => instance.id === id);
  const agent = {
    id,
    label: label || id,
    base_url: baseUrl,
    enabled,
    tags,
    capabilities,
    polling: {
      enabled: pollingEnabled,
      interval_ms: pollingInterval,
    },
    request_defaults: {
      cable_modem: {
        mac_address: cableModemMac,
        ip_address: cableModemIp,
      },
      tftp: {
        ipv4: tftpIpv4,
        ipv6: tftpIpv6,
      },
      capture: {
        channel_ids: normalizeChannelIds(channelIds),
      },
      snmp: {
        rw_community: snmpRwCommunity,
      },
    },
  };

  if (existingIndex >= 0) {
    config.instances[existingIndex] = agent;
  } else {
    config.instances.push(agent);
  }

  if (!config.defaults.selected_instance) {
    config.defaults.selected_instance = agent.id;
  }
}

async function editAgent(rl, config) {
  if (config.instances.length === 0) {
    process.stdout.write("No agents configured.\n");
    return;
  }

  process.stdout.write("\nConfigured Agents\n=================\n");
  config.instances.forEach((instance, index) => {
    process.stdout.write(`${index + 1}) ${instance.id} | ${instance.label} | ${instance.base_url}\n`);
  });

  const answer = (await rl.question("Select agent number: ")).trim();
  const index = Number.parseInt(answer, 10) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= config.instances.length) {
    process.stdout.write("Invalid selection.\n");
    return;
  }

  const instance = config.instances[index];
  const priorId = instance.id;
  instance.label = await promptLine(rl, "Agent label", instance.label);
  instance.id = await promptLine(rl, "Agent id", instance.id);
  instance.base_url = await promptLine(rl, "Base URL", instance.base_url);
  instance.enabled = await promptBoolean(rl, "Enabled", instance.enabled);
  instance.tags = await promptCsv(rl, "Tags (comma-separated)", instance.tags);
  instance.capabilities = await promptCsv(rl, "Capabilities (comma-separated)", instance.capabilities);
  instance.polling.enabled = await promptBoolean(rl, "Polling enabled", instance.polling.enabled);
  instance.polling.interval_ms = await promptNumber(rl, "Polling interval ms", instance.polling.interval_ms);
  instance.request_defaults.cable_modem.mac_address = await promptLine(
    rl,
    "Default cable modem MAC",
    instance.request_defaults.cable_modem.mac_address,
  );
  instance.request_defaults.cable_modem.ip_address = await promptLine(
    rl,
    "Default cable modem IP",
    instance.request_defaults.cable_modem.ip_address,
  );
  instance.request_defaults.tftp.ipv4 = await promptLine(
    rl,
    "Default TFTP IPv4",
    instance.request_defaults.tftp.ipv4,
  );
  instance.request_defaults.tftp.ipv6 = await promptLine(
    rl,
    "Default TFTP IPv6",
    instance.request_defaults.tftp.ipv6,
  );
  const channelIds = await promptLine(
    rl,
    "Default channel ids (0 means all)",
    channelIdsToPromptValue(instance.request_defaults.capture.channel_ids),
  );
  instance.request_defaults.capture.channel_ids = normalizeChannelIds(channelIds);
  instance.request_defaults.snmp.rw_community = await promptLine(
    rl,
    "Default SNMP RW community",
    instance.request_defaults.snmp.rw_community,
  );

  if (config.defaults.selected_instance === priorId) {
    config.defaults.selected_instance = instance.id;
  }
}

async function deleteAgent(rl, config) {
  if (config.instances.length <= 1) {
    process.stdout.write("At least one agent must remain configured.\n");
    return;
  }

  process.stdout.write("\nConfigured Agents\n=================\n");
  config.instances.forEach((instance, index) => {
    process.stdout.write(`${index + 1}) ${instance.id} | ${instance.label}\n`);
  });

  const answer = (await rl.question("Delete agent number: ")).trim();
  const index = Number.parseInt(answer, 10) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= config.instances.length) {
    process.stdout.write("Invalid selection.\n");
    return;
  }

  const [removed] = config.instances.splice(index, 1);
  if (config.defaults.selected_instance === removed.id) {
    config.defaults.selected_instance = config.instances[0]?.id ?? DEFAULT_CONFIG.defaults.selected_instance;
  }
}

async function manageAgents(rl, config, configPath) {
  while (true) {
    process.stdout.write(
      [
        "\nPyPNM Agents",
        "============",
        "1) Add agent",
        "2) Edit agent",
        "3) Delete agent",
        "p) Print current YAML",
        "b) Back",
      ].join("\n") + "\n",
    );

    const choice = (await rl.question("Enter selection: ")).trim().toLowerCase();
    if (choice === "" || choice === "b" || choice === "back") {
      return;
    }
    if (choice === "1") {
      await addAgent(rl, config);
      saveConfig(configPath, config);
      process.stdout.write(`Saved ${configPath}\n`);
      continue;
    }
    if (choice === "2") {
      await editAgent(rl, config);
      saveConfig(configPath, config);
      process.stdout.write(`Saved ${configPath}\n`);
      continue;
    }
    if (choice === "3") {
      await deleteAgent(rl, config);
      saveConfig(configPath, config);
      process.stdout.write(`Saved ${configPath}\n`);
      continue;
    }
    if (choice === "p") {
      printConfig("public/config/pypnm-instances.local.yaml", config);
      continue;
    }
    process.stdout.write("Invalid selection.\n");
  }
}

export async function runConfigMenu(metaUrl) {
  if (!interactiveAllowed()) {
    process.stdout.write("Config menu requires an interactive terminal; skipping.\n");
    return 0;
  }

  const repoRoot = repoRootFromModule(metaUrl);
  const configPath = configPathFromRepoRoot(repoRoot);
  const templatePath = templateConfigPathFromRepoRoot(repoRoot);
  const config = loadConfig(configPath, templatePath);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    while (true) {
      process.stdout.write(
        [
          "\nPyPNM-WebUI Config Menu",
          "=======================",
          "1) Edit runtime defaults",
          "2) Manage PyPNM agents",
          "p) Print current pypnm-instances.local.yaml",
          "q) Quit",
        ].join("\n") + "\n",
      );

      const choice = (await rl.question("Enter selection: ")).trim().toLowerCase();

      if (choice === "" || choice === "q" || choice === "quit" || choice === "x") {
        process.stdout.write("Exiting config menu.\n");
        return 0;
      }
      if (choice === "1") {
        await editRuntimeDefaults(rl, config);
        saveConfig(configPath, config);
        process.stdout.write(`Saved ${configPath}\n`);
        continue;
      }
      if (choice === "2") {
        await manageAgents(rl, config, configPath);
        continue;
      }
      if (choice === "p") {
        printConfig(configPath, config);
        continue;
      }
      process.stdout.write("Invalid selection.\n");
    }
  } finally {
    rl.close();
  }
}
