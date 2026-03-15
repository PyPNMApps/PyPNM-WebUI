import fs from "node:fs";
import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const srcPath = path.resolve(__dirname, "src");
const appVersion = fs.readFileSync(path.resolve(__dirname, "VERSION"), "utf8").trim();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": srcPath,
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  test: {
    alias: {
      "@": srcPath,
    },
  },
});
