import { DeviceInfoTable } from "@/components/common/DeviceInfoTable";
import { Panel } from "@/components/common/Panel";
import { toDeviceInfo } from "@/lib/pypnm/deviceInfo";
import type { If31SystemDiplexerResponse } from "@/types/api";

function asNumber(value: number | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function fmtHzAsMhz(value: number | null): string {
  if (value === null) {
    return "n/a";
  }
  return `${(value / 1e6).toFixed(3)} MHz`;
}

function statusText(status: number | string | undefined): string {
  if (status === 0) {
    return "Success";
  }
  return status === undefined || status === null ? "n/a" : String(status);
}

export function SingleIf31SystemDiplexerView({ response }: { response: If31SystemDiplexerResponse }) {
  const deviceInfo = toDeviceInfo(
    response.device?.system_description ?? response.system_description,
    response.device?.mac_address ?? response.mac_address,
  );
  const diplexer = response.results?.diplexer;
  const diplexerCapability = asNumber(diplexer?.diplexer_capability);
  const cfgBandEdge = asNumber(diplexer?.cfg_band_edge);
  const dsLowerCapability = asNumber(diplexer?.ds_lower_capability);
  const cfgDsLowerBandEdge = asNumber(diplexer?.cfg_ds_lower_band_edge);
  const dsUpperCapability = asNumber(diplexer?.ds_upper_capability);
  const cfgDsUpperBandEdge = asNumber(diplexer?.cfg_ds_upper_band_edge);

  return (
    <div className="operations-visual-stack">
      <DeviceInfoTable deviceInfo={deviceInfo} />

      <div className="status-chip-row">
        <span className="analysis-chip"><b>MAC</b> {deviceInfo.macAddress}</span>
        <span className="analysis-chip"><b>Status</b> {statusText(response.status)}</span>
        <span className="analysis-chip"><b>Diplexer Capability</b> {diplexerCapability ?? "n/a"}</span>
      </div>

      {response.message ? <p className="panel-copy">{response.message}</p> : null}

      <Panel title="System Diplexer Configuration">
        <div className="analysis-summary-grid">
          <div className="analysis-metric-card">
            <div className="analysis-metric-label">Configured Band Edge</div>
            <div className="analysis-metric-value mono">{fmtHzAsMhz(cfgBandEdge)}</div>
          </div>
          <div className="analysis-metric-card">
            <div className="analysis-metric-label">DS Lower Capability</div>
            <div className="analysis-metric-value mono">{dsLowerCapability ?? "n/a"}</div>
          </div>
          <div className="analysis-metric-card">
            <div className="analysis-metric-label">DS Lower Band Edge</div>
            <div className="analysis-metric-value mono">{fmtHzAsMhz(cfgDsLowerBandEdge)}</div>
          </div>
          <div className="analysis-metric-card">
            <div className="analysis-metric-label">DS Upper Capability</div>
            <div className="analysis-metric-value mono">{dsUpperCapability ?? "n/a"}</div>
          </div>
          <div className="analysis-metric-card">
            <div className="analysis-metric-label">DS Upper Band Edge</div>
            <div className="analysis-metric-value mono">{fmtHzAsMhz(cfgDsUpperBandEdge)}</div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
