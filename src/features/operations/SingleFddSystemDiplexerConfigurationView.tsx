import { DeviceInfoTable } from "@/components/common/DeviceInfoTable";
import { Panel } from "@/components/common/Panel";
import { toDeviceInfo } from "@/lib/pypnm/deviceInfo";
import type { FddSystemDiplexerConfigurationResponse } from "@/types/api";

function asNumber(value: number | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function fmtMhz(value: number | null): string {
  if (value === null) {
    return "n/a";
  }
  return value === 0 ? "unconfigured" : `${value} MHz`;
}

function statusText(status: number | string | undefined): string {
  if (status === 0) {
    return "Success";
  }
  return status === undefined || status === null ? "n/a" : String(status);
}

export function SingleFddSystemDiplexerConfigurationView({ response }: { response: FddSystemDiplexerConfigurationResponse }) {
  const deviceInfo = toDeviceInfo(
    response.device?.system_description ?? response.system_description,
    response.device?.mac_address ?? response.mac_address,
  );
  const index = response.results?.index ?? "n/a";
  const dsLower = asNumber(response.results?.entry?.docsFddCmFddSystemCfgStateDiplexerDsLowerBandEdgeCfg);
  const dsUpper = asNumber(response.results?.entry?.docsFddCmFddSystemCfgStateDiplexerDsUpperBandEdgeCfg);
  const usUpper = asNumber(response.results?.entry?.docsFddCmFddSystemCfgStateDiplexerUsUpperBandEdgeCfg);
  const configuredEdges = [dsLower, dsUpper, usUpper].filter((value) => value !== null && value > 0).length;

  return (
    <div className="operations-visual-stack">
      <DeviceInfoTable deviceInfo={deviceInfo} />

      <div className="status-chip-row">
        <span className="analysis-chip"><b>MAC</b> {deviceInfo.macAddress}</span>
        <span className="analysis-chip"><b>Status</b> {statusText(response.status)}</span>
        <span className="analysis-chip"><b>Index</b> {index}</span>
        <span className="analysis-chip"><b>Configured Edges</b> {configuredEdges}/3</span>
      </div>

      {response.message ? <p className="panel-copy">{response.message}</p> : null}

      <Panel title="Active Diplexer Configuration">
        <div className="analysis-summary-grid">
          <div className="analysis-metric-card">
            <div className="analysis-metric-label">US Upper Band Edge</div>
            <div className="analysis-metric-value mono">{fmtMhz(usUpper)}</div>
          </div>
          <div className="analysis-metric-card">
            <div className="analysis-metric-label">DS Lower Band Edge</div>
            <div className="analysis-metric-value mono">{fmtMhz(dsLower)}</div>
          </div>
          <div className="analysis-metric-card">
            <div className="analysis-metric-label">DS Upper Band Edge</div>
            <div className="analysis-metric-value mono">{fmtMhz(dsUpper)}</div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
