import fs from "node:fs";
import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const srcPath = path.resolve(__dirname, "src");
const appVersion = fs.readFileSync(path.resolve(__dirname, "VERSION"), "utf8").trim();
const appLicense = "Apache-2.0";

function clientLogPlugin() {
  return {
    name: "pypnm-webui-client-log",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use("/__client-log", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }

        const chunks: Buffer[] = [];
        req.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        req.on("end", () => {
          try {
            const raw = Buffer.concat(chunks).toString("utf8");
            const payload = JSON.parse(raw) as {
              timestamp?: string;
              level?: string;
              message?: string;
              context?: unknown;
            };
            const logsDir = path.resolve(__dirname, "logs");
            const logPath = path.join(logsDir, "console.log");
            fs.mkdirSync(logsDir, { recursive: true });
            const line = JSON.stringify({
              timestamp: payload.timestamp ?? new Date().toISOString(),
              level: payload.level ?? "INFO",
              message: payload.message ?? "",
              context: payload.context ?? null,
            });
            fs.appendFileSync(logPath, `${line}\n`, "utf8");
            res.statusCode = 204;
            res.end();
          } catch {
            res.statusCode = 400;
            res.end("Invalid log payload");
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), clientLogPlugin()],
  resolve: {
    alias: {
      "@": srcPath,
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
    __APP_LICENSE__: JSON.stringify(appLicense),
  },
  test: {
    alias: {
      "@": srcPath,
    },
  },
});
