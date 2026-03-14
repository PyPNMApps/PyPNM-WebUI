import { useInstanceConfig } from "@/app/useInstanceConfig";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { env } from "@/lib/env";

export function SettingsPage() {
  const { config, instances, selectedInstance } = useInstanceConfig();

  return (
    <>
      <PageHeader title="Settings" subtitle="Environment-derived client configuration for this UI instance." />
      <Panel title="Runtime Config">
        <div className="kv">
          <strong>Env Fallback Base URL</strong>
          <span className="mono">{env.apiBaseUrl}</span>
          <strong>Timeout (ms)</strong>
          <span>{env.requestTimeoutMs}</span>
          <strong>Selected Instance</strong>
          <span>{selectedInstance?.label ?? "n/a"}</span>
          <strong>Selected Base URL</strong>
          <span className="mono">{selectedInstance?.baseUrl ?? "n/a"}</span>
          <strong>Configured Instances</strong>
          <span>{instances.length}</span>
          <strong>Config Health Path</strong>
          <span className="mono">{config?.defaults.healthPath ?? "n/a"}</span>
        </div>
      </Panel>
    </>
  );
}
