import { describe, expect, it } from "vitest";

import { parseLatestGitHubTag } from "../src/services/repoMetadataService";

describe("parseLatestGitHubTag", () => {
  it("returns the first tag name", () => {
    expect(parseLatestGitHubTag([{ name: "v0.1.9.0" }, { name: "v0.1.8.0" }])).toBe("v0.1.9.0");
  });

  it("returns null for empty or invalid payloads", () => {
    expect(parseLatestGitHubTag([])).toBeNull();
    expect(parseLatestGitHubTag({})).toBeNull();
    expect(parseLatestGitHubTag([{ nope: "x" }])).toBeNull();
  });
});
