import { useInstanceConfig } from "@/app/useInstanceConfig";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { useQueries } from "@tanstack/react-query";

import { getHealth } from "@/services/healthService";

export function HealthPage() {
  const { config, instances, selectedInstance } = useInstanceConfig();
  const healthQueries = useQueries({
    queries: instances.map((instance) => ({
      queryKey: ["health", instance.id],
      queryFn: () => getHealth(instance.baseUrl, config?.defaults.healthPath ?? "/health"),
      enabled: Boolean(config),
      refetchInterval: instance.polling.enabled ? instance.polling.intervalMs : false,
    })),
  });

  const rows = instances.map((instance, index) => {
    const query = healthQueries[index];
    const data = query.data;

    return {
      instance,
      isSelected: instance.id === selectedInstance?.id,
      status: query.isLoading ? "loading" : String(data?.status ?? "unknown"),
      message: query.isError ? (query.error as Error).message : data?.message ?? "n/a",
      service: data?.output?.service ?? "n/a",
      version: data?.output?.version ?? "n/a",
      timestamp: data?.timestamp ?? "n/a",
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
                <th>Timestamp</th>
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
                  <td className="mono">{row.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
