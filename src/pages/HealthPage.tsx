import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { useHealth } from "@/features/health/useHealth";

export function HealthPage() {
  const health = useHealth();

  return (
    <>
      <PageHeader title="Health" subtitle="Verify connectivity and view backend service metadata." />
      <Panel title="PyPNM Health Check">
        {health.isLoading && <p>Loading health status...</p>}
        {health.isError && <p>{(health.error as Error).message}</p>}
        {health.data && (
          <div className="kv">
            <strong>Status</strong>
            <span>{String(health.data.status ?? "unknown")}</span>
            <strong>Message</strong>
            <span>{health.data.message ?? "n/a"}</span>
            <strong>Service</strong>
            <span>{health.data.output?.service ?? "n/a"}</span>
            <strong>Version</strong>
            <span>{health.data.output?.version ?? "n/a"}</span>
            <strong>Timestamp</strong>
            <span className="mono">{health.data.timestamp ?? "n/a"}</span>
          </div>
        )}
      </Panel>
    </>
  );
}
