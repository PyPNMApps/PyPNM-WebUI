#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, "..", "..");
const PREVIEW_PORT = Number(process.env.UI_PREVIEW_PORT ?? "4173");
const PREVIEW_HOST = process.env.UI_PREVIEW_HOST ?? "127.0.0.1";
const PREVIEW_BASE_URL = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`;
const OUTPUT_DIR = join(ROOT_DIR, "docs", "images", "ui-previews");
const DOC_PREVIEW_DIR = join(ROOT_DIR, "docs", "user", "ui-previews");

const ROUTES = [
  { title: "Single Capture · RxMER", path: "/single-capture/rxmer", slug: "single-capture-rxmer", section: "single-capture" },
  { title: "Single Capture · Channel Estimation", path: "/single-capture/channel-est-coeff", slug: "single-capture-channel-estimation", section: "single-capture" },
  { title: "Single Capture · OFDMA PreEqualization", path: "/single-capture/us-ofdma-pre-equalization", slug: "single-capture-us-ofdma-pre-equalization", section: "single-capture" },
  { title: "Single Capture · Spectrum Analyzer", path: "/single-capture/spectrum-friendly", slug: "single-capture-spectrum-friendly", section: "single-capture" },
  { title: "Advanced · RxMER", path: "/advanced/rxmer", slug: "advanced-rxmer", section: "advanced" },
  { title: "Advanced · Channel Estimation", path: "/advanced/channel-estimation", slug: "advanced-channel-estimation", section: "advanced" },
  { title: "Advanced · OFDMA PreEq", path: "/advanced/ofdma-pre-eq", slug: "advanced-ofdma-pre-eq", section: "advanced" },
  { title: "Files", path: "/files", slug: "files", section: "platform" },
  { title: "Health", path: "/health", slug: "health", section: "platform" },
  { title: "Settings", path: "/settings", slug: "settings", section: "platform" },
  { title: "About", path: "/about", slug: "about", section: "platform" },
];

function log(message) {
  process.stdout.write(`[docs-ui-previews] ${message}\n`);
}

function fail(message) {
  process.stderr.write(`[docs-ui-previews][error] ${message}\n`);
  process.exit(1);
}

async function waitForServerReady(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok || response.status === 404) {
        return;
      }
    } catch {
      // Server still starting.
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function startPreviewServer() {
  const preview = spawn(
    "npm",
    ["run", "preview", "--", "--host", PREVIEW_HOST, "--port", String(PREVIEW_PORT), "--strictPort"],
    {
      cwd: ROOT_DIR,
      env: process.env,
      stdio: "inherit",
    },
  );
  return preview;
}

function renderOverviewPage() {
  return [
    "# UI Preview Gallery",
    "",
    "Auto-generated screenshots for key WebUI routes.",
    "",
    `Base URL captured: \`${PREVIEW_BASE_URL}\``,
    "",
    "To regenerate:",
    "",
    "`npm run docs:capture-ui-previews`",
    "",
    "## Sections",
    "",
    "- [Single Capture](single-capture.md)",
    "- [Advanced](advanced.md)",
    "- [Platform](platform.md)",
    "",
  ].join("\n");
}

function renderSectionPage(title, captures) {
  const lines = [
    `# ${title}`,
    "",
    `Base URL captured: \`${PREVIEW_BASE_URL}\``,
    "",
  ];

  captures.forEach((capture) => {
    lines.push(`## ${capture.title}`);
    lines.push("");
    lines.push(`Route: \`${capture.path}\``);
    lines.push("");
    lines.push(`![${capture.title}](../../images/ui-previews/${capture.fileName})`);
    lines.push("");
  });

  return lines.join("\n");
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(DOC_PREVIEW_DIR, { recursive: true });

  const preview = startPreviewServer();
  let browser;
  try {
    log(`Waiting for preview server at ${PREVIEW_BASE_URL}`);
    await waitForServerReady(`${PREVIEW_BASE_URL}/`);

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1720, height: 980 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    const captures = [];
    for (const route of ROUTES) {
      const targetUrl = `${PREVIEW_BASE_URL}${route.path}`;
      log(`Capturing ${targetUrl}`);
      await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 60_000 });
      await page.waitForTimeout(600);
      await page.evaluate(() => window.scrollTo(0, 0));
      const fileName = `${route.slug}.png`;
      const filePath = join(OUTPUT_DIR, fileName);
      await page.screenshot({ path: filePath, fullPage: false });
      captures.push({ ...route, fileName });
    }

    const overviewPath = join(DOC_PREVIEW_DIR, "index.md");
    const singleCapturePath = join(DOC_PREVIEW_DIR, "single-capture.md");
    const advancedPath = join(DOC_PREVIEW_DIR, "advanced.md");
    const platformPath = join(DOC_PREVIEW_DIR, "platform.md");

    writeFileSync(overviewPath, renderOverviewPage(), "utf-8");
    writeFileSync(singleCapturePath, renderSectionPage("Single Capture UI Previews", captures.filter((item) => item.section === "single-capture")), "utf-8");
    writeFileSync(advancedPath, renderSectionPage("Advanced UI Previews", captures.filter((item) => item.section === "advanced")), "utf-8");
    writeFileSync(platformPath, renderSectionPage("Platform UI Previews", captures.filter((item) => item.section === "platform")), "utf-8");

    log(`Wrote ${overviewPath}`);
    log(`Wrote ${singleCapturePath}`);
    log(`Wrote ${advancedPath}`);
    log(`Wrote ${platformPath}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("Executable doesn't exist")) {
      fail("Playwright browser is missing. Run: npx playwright install chromium");
    }
    fail(message);
  } finally {
    if (browser) {
      await browser.close();
    }
    if (preview && !preview.killed) {
      preview.kill("SIGTERM");
    }
  }
}

main();
