import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { env } from "@/lib/env";

export function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Environment-derived client configuration for this UI instance." />
      <Panel title="Runtime Config">
        <div className="kv">
          <strong>API Base URL</strong>
          <span className="mono">{env.apiBaseUrl}</span>
          <strong>Timeout (ms)</strong>
          <span>{env.requestTimeoutMs}</span>
        </div>
      </Panel>
    </>
  );
}
