import { useQueries } from "@tanstack/react-query";

import { useInstanceConfig } from "@/app/useInstanceConfig";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { classifyHealthError, getHealth } from "@/services/healthService";

const MAX_HEALTH_TIMEOUT_MS = 4000;

function formatUptime(seconds: number | undefined): string {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) {
    return "n/a";
  }

  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || parts.length) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length) parts.push(`${minutes}m`);
  parts.push(`${remainingSeconds}s`);

  return parts.join(" ");
}

function formatBytes(bytes: number | undefined): string {
  if (typeof bytes !== "number" || !Number.isFinite(bytes)) {
    return "n/a";
  }
  return bytes.toLocaleString();
}

export function HealthPage() {
  const { config, instances, selectedInstance } = useInstanceConfig();
  const healthTimeoutMs = Math.min(config?.defaults.requestTimeoutMs ?? MAX_HEALTH_TIMEOUT_MS, MAX_HEALTH_TIMEOUT_MS);

  const healthQueries = useQueries({
    queries: instances.map((instance) => ({
      queryKey: ["health", instance.id],
      queryFn: () => getHealth(instance.baseUrl, config?.defaults.healthPath ?? "/health", healthTimeoutMs),
      enabled: Boolean(config),
      refetchInterval: instance.polling.enabled ? instance.polling.intervalMs : false,
      retry: false,
    })),
  });

  const rows = instances.map((instance, index) => {
    const query = healthQueries[index];
    const data = query.data;
    const errorState = query.isError ? classifyHealthError(query.error as Error) : null;

    return {
      instance,
      isSelected: instance.id == selectedInstance?.id,
      status: query.isPending ? "loading" : errorState?.status ?? String(data?.status ?? "unknown"),
      message: errorState?.message ?? data?.message ?? "n/a",
      service: data?.service?.name ?? "n/a",
      version: data?.service?.version ?? "n/a",
      uptime: formatUptime(data?.uptime?.uptime),
      dataPath: data?.data?.path ?? "n/a",
      dataSize: formatBytes(data?.data?.size_bytes),
    };
  });

  return (
    <>
      <PageHeader title="Health" subtitle="Verify connectivity and view backend service metadata." />
      <Panel title="PyPNM Health Check">
        <div className="panel-copy">
          Agents: {instances.length || 0}
          {selectedInstance ? ` · Selected ${selectedInstance.label}` : ""}
          {config ? ` · Path ${config.defaults.healthPath}` : ""}
          {` · Reachability timeout ${healthTimeoutMs} ms`}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Status</th>
                <th>Message</th>
                <th>Service</th>
                <th>Version</th>
                <th>Uptime</th>
                <th>Data Path</th>
                <th>Data Size</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.instance.id} className={row.isSelected ? "health-row-selected" : undefined}>
                  <td>
                    <div>{row.instance.label}</div>
                    <div className="health-agent-meta mono">{row.instance.baseUrl}</div>
                  </td>
                  <td>{row.status}</td>
                  <td>{row.message}</td>
                  <td>{row.service}</td>
                  <td>{row.version}</td>
                  <td className="mono">{row.uptime}</td>
                  <td className="mono">{row.dataPath}</td>
                  <td className="mono">{row.dataSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
