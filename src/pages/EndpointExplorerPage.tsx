import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { useEndpoints } from "@/features/endpoint-explorer/useEndpoints";

export function EndpointExplorerPage() {
  const endpoints = useEndpoints();

  return (
    <>
      <PageHeader title="Endpoint Explorer" subtitle="Browse discoverable REST operations from the PyPNM backend." />
      <Panel title="Available Endpoints">
        {endpoints.isLoading && <p>Loading endpoint metadata...</p>}
        {endpoints.isError && <p>{(endpoints.error as Error).message}</p>}
        {endpoints.data && endpoints.data.length === 0 && <p>No endpoint metadata returned.</p>}
        {endpoints.data && endpoints.data.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Path</th>
                <th>Operation ID</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.data.map((endpoint) => (
                <tr key={`${endpoint.method}-${endpoint.path}`}>
                  <td>{endpoint.method}</td>
                  <td className="mono">{endpoint.path}</td>
                  <td>{endpoint.operation_id ?? "n/a"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </>
  );
}
