// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import packageJson from "../package.json";
import { AboutPage } from "@/pages/AboutPage";

vi.mock("@/services/repoMetadataService", () => ({
  REPO_URL: "https://github.com/PyPNMApps/PyPNM-WebUI",
  fetchLatestGitHubTag: vi.fn().mockResolvedValue("v0.2.12"),
}));

describe("AboutPage", () => {
  it("shows the loaded package version", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AboutPage />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Current Loaded Version")).toBeTruthy();
    expect(screen.getByText(packageJson.version)).toBeTruthy();
    expect(screen.getByText("Build Version Notation")).toBeTruthy();
  });
});
