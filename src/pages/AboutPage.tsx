import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { ThinkingIndicator } from "@/components/common/ThinkingIndicator";
import { REPO_URL, fetchLatestGitHubTag } from "@/services/repoMetadataService";

function VersionValue({ value }: { value: string }) {
  return <span className="mono">{value}</span>;
}

export function AboutPage() {
  const latestVersionQuery = useQuery({
    queryKey: ["github", "latest-tag"],
    queryFn: fetchLatestGitHubTag,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      <PageHeader
        title="About"
        subtitle="PyPNM WebUI is a browser client for PyPNM operations, file inspection, and signal-analysis visuals."
      />
      <div className="grid two about-grid">
        <Panel title="Project">
          <p className="panel-copy">
            Use PyPNM WebUI to connect to one or more PyPNM agents, run supported operations, inspect stored PNM files,
            and render capture data with purpose-built visuals.
          </p>
          <a className="button-link" href={REPO_URL} target="_blank" rel="noreferrer">
            Open Repository
          </a>
        </Panel>
        <Panel title="Version">
          <div className="settings-definition-list">
            <div className="settings-definition-row">
              <div className="settings-definition-key">Current Loaded Version</div>
              <div><VersionValue value={__APP_VERSION__} /></div>
            </div>
            <div className="settings-definition-row">
              <div className="settings-definition-key">License</div>
              <div><VersionValue value={__APP_LICENSE__} /></div>
            </div>
            <div className="settings-definition-row">
              <div className="settings-definition-key">Latest GitHub Repo Version</div>
              <div>
                {latestVersionQuery.isPending ? (
                  <ThinkingIndicator label="Checking GitHub version..." compact />
                ) : latestVersionQuery.isError ? (
                  <span>Unavailable</span>
                ) : (
                  <VersionValue value={latestVersionQuery.data ?? "No tags found"} />
                )}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
