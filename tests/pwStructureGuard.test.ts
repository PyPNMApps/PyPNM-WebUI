import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walkFiles(dirPath: string): string[] {
  const entries = readdirSync(dirPath, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("pw structure guard", () => {
  it("does not use legacy flat PW import aliases in src", () => {
    const sourceFiles = walkFiles("src");
    const forbiddenPatterns = [
      /from\s+["']@\/pages\//,
      /from\s+["']@\/features\//,
      /from\s+["']@\/services\/advanced\//,
      /from\s+["']@\/services\/captureConnectivityService["']/,
      /from\s+["']@\/services\/endpointsService["']/,
      /from\s+["']@\/services\/pnmFilesService["']/,
      /from\s+["']@\/services\/singleCaptureService["']/,
      /from\s+["']@\/services\/singleRxMerService["']/,
      /from\s+["']@\/services\/advancedRxMerService["']/,
    ];

    const offenders: string[] = [];
    for (const filePath of sourceFiles) {
      if (!statSync(filePath).isFile()) {
        continue;
      }
      const source = readFileSync(filePath, "utf8");
      if (forbiddenPatterns.some((pattern) => pattern.test(source))) {
        offenders.push(filePath);
      }
    }

    expect(offenders).toEqual([]);
  });
});
