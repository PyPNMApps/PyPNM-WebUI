import { DeviceInfoTable } from "@/components/common/DeviceInfoTable";
import { Panel } from "@/components/common/Panel";
import { toDeviceInfo } from "@/lib/pypnm/deviceInfo";
import type { AdvancedMultiRxMerAnalysisResponse, AdvancedMultiRxMerHeatMapChannel } from "@/types/api";

function epochToUtcLabel(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "n/a";
  return new Date(value * 1000).toISOString().replace("T", " ").replace(".000Z", " UTC");
}

function colorForValue(value: number, min: number, max: number): string {
  const range = max - min || 1;
  const ratio = Math.max(0, Math.min(1, (value - min) / range));
  const hue = 120 * ratio;
  const light = 16 + ratio * 44;
  return `hsl(${hue} 88% ${light.toFixed(1)}%)`;
}

function HeatMapGrid({ channel }: { channel: AdvancedMultiRxMerHeatMapChannel }) {
  const rows = channel.values ?? [];
  const flatValues = rows.flat().filter((value) => typeof value === "number" && Number.isFinite(value));
  const min = flatValues.length ? Math.min(...flatValues) : 0;
  const max = flatValues.length ? Math.max(...flatValues) : 1;

  return (
    <div className="advanced-heatmap-shell">
      <div className="advanced-heatmap-grid" style={{ gridTemplateColumns: `repeat(${Math.min(channel.frequency.length, 120)}, minmax(0, 1fr))` }}>
        {rows.flatMap((row, rowIndex) =>
          row.slice(0, Math.min(channel.frequency.length, 120)).map((value, columnIndex) => (
            <span
              key={`${rowIndex}-${columnIndex}`}
              className="advanced-heatmap-cell"
              style={{ background: colorForValue(Number(value), min, max) }}
              title={`Capture ${rowIndex + 1} · Bin ${columnIndex + 1} · ${Number(value).toFixed(2)} dB`}
            />
          )),
        )}
      </div>
      <div className="status-chip-row">
        <span className="analysis-chip"><b>Captures</b> {rows.length}</span>
        <span className="analysis-chip"><b>Subcarriers</b> {channel.frequency.length}</span>
        <span className="analysis-chip"><b>Range</b> {min.toFixed(2)} to {max.toFixed(2)} dB</span>
      </div>
    </div>
  );
}

export function AdvancedRxMerHeatMapView({ response }: { response: AdvancedMultiRxMerAnalysisResponse }) {
  const channels = Object.entries(response.data ?? {}) as Array<[string, AdvancedMultiRxMerHeatMapChannel]>;
  const deviceInfo = toDeviceInfo(
    response.device?.system_description ?? response.system_description,
    response.device?.mac_address ?? response.mac_address,
  );

  return (
    <div className="operations-visual-stack">
      <DeviceInfoTable deviceInfo={deviceInfo} />
      {channels.map(([channelId, channel]) => (
        <Panel key={channelId} title={`Channel ${channelId} · RxMER Heat Map`}>
          <div className="status-chip-row">
            <span className="analysis-chip"><b>Start</b> {epochToUtcLabel(channel.timestamps?.[0])}</span>
            <span className="analysis-chip"><b>End</b> {epochToUtcLabel(channel.timestamps?.[channel.timestamps.length - 1])}</span>
          </div>
          <HeatMapGrid channel={channel} />
        </Panel>
      ))}
    </div>
  );
}
