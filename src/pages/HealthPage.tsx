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
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const precision = unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
}

function formatEpoch(epochSeconds: number | undefined): string {
  if (typeof epochSeconds !== "number" || !Number.isFinite(epochSeconds)) {
    return "n/a";
  }

  return new Date(epochSeconds * 1000).toLocaleString();
}

function getDirectoryEntries(directories: Record<string, number> | undefined): Array<[string, number]> {
  if (!directories) {
    return [];
  }

  return Object.entries(directories).sort((left, right) => right[1] - left[1]);
}

function formatMemorySummary(
  rssBytes: number | undefined,
  availableBytes: number | undefined,
  totalBytes: number | undefined,
): string {
  return `${formatBytes(rssBytes)} / ${formatBytes(availableBytes)} / ${formatBytes(totalBytes)}`;
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
      starttime: formatEpoch(data?.uptime?.starttime),
      memory: formatMemorySummary(
        data?.memory?.rss_bytes,
        data?.memory?.available_bytes,
        data?.memory?.total_bytes,
      ),
      dataSize: formatBytes(data?.data?.size_bytes),
      dataDirectories: getDirectoryEntries(data?.data?.directories),
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
                <th title="Configured PyPNM instance label and base URL.">Agent</th>
                <th title="Latest health status returned by the backend.">Status</th>
                <th title="Health message or transport error summary.">Message</th>
                <th title="Backend service name reported by /health.">Service</th>
                <th title="Running backend version reported by /health.">Version</th>
                <th title="Backend process start time converted from epoch seconds.">Start Time</th>
                <th title="Elapsed backend uptime since the reported start time.">Uptime</th>
                <th
                  className="health-memory-heading"
                  title="Process resident memory, then host available memory, then host total memory."
                >
                  Memory
                </th>
                <th title="Total size of the backend .data directory.">Data Size</th>
                <th title="First-level .data directories and their current sizes.">.data Directories</th>
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
                  <td className="mono">{row.starttime}</td>
                  <td className="mono">{row.uptime}</td>
                  <td className="mono health-memory-cell">{row.memory}</td>
                  <td className="mono">{row.dataSize}</td>
                  <td>
                    {row.dataDirectories.length === 0 ? (
                      <span className="mono">n/a</span>
                    ) : (
                      <details className="health-popup">
                        <summary className="health-popup-trigger mono">
                          View ({row.dataDirectories.length})
                        </summary>
                        <div className="health-popup-card">
                          {row.dataDirectories.map(([name, size]) => (
                            <div key={`${row.instance.id}-${name}`} className="health-popup-row mono">
                              <span>{name}</span>
                              <span>{formatBytes(size)}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
