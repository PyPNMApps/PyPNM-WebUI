import { DeviceInfoTable } from "@/components/common/DeviceInfoTable";
import { Panel } from "@/components/common/Panel";
import { LineAnalysisChart } from "@/features/analysis/components/LineAnalysisChart";
import { CHART_SERIES_PALETTE, CHART_SERIES_PALETTE_SIZE } from "@/lib/constants";
import { buildExportBaseName } from "@/lib/export/naming";
import { toDeviceInfo } from "@/lib/pypnm/deviceInfo";
import type { ChartSeries } from "@/features/analysis/types";
import type { AdvancedMultiChanEstAnalysisResponse, AdvancedMultiChanEstGroupDelayResult } from "@/types/api";

export function normalizeGroupDelayUs(values: number[]): number[] {
  const numericValues = values
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  const maxAbs = numericValues.reduce((currentMax, value) => Math.max(currentMax, Math.abs(value)), 0);
  const scale = maxAbs > 0 && maxAbs < 1e-3 ? 1_000_000 : 1;

  return values.map((value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue * scale : 0;
  });
}

function buildSeries(channel: AdvancedMultiChanEstGroupDelayResult): ChartSeries[] {
  const normalizedGroupDelay = normalizeGroupDelayUs(channel.group_delay_us ?? []);
  return [
    {
      label: `Channel ${channel.channel_id}`,
      color: "#79a9ff",
      points: (channel.frequency ?? []).slice(0, normalizedGroupDelay.length).map((value, index) => ({
        x: value / 1_000_000,
        y: normalizedGroupDelay[index] ?? 0,
      })),
    },
  ];
}

function buildAlignedSeries(results: AdvancedMultiChanEstGroupDelayResult[]): ChartSeries[] {
  return results.map((channel, index) => {
    const normalizedGroupDelay = normalizeGroupDelayUs(channel.group_delay_us ?? []);
    return {
      label: `Channel ${channel.channel_id ?? index}`,
      color: CHART_SERIES_PALETTE[index % CHART_SERIES_PALETTE_SIZE],
      points: (channel.frequency ?? []).slice(0, normalizedGroupDelay.length).map((value, pointIndex) => ({
        x: value / 1_000_000,
        y: normalizedGroupDelay[pointIndex] ?? 0,
      })),
    };
  });
}

export function AdvancedChannelEstGroupDelayView({ response }: { response: AdvancedMultiChanEstAnalysisResponse }) {
  const results = (response.data?.results ?? []) as AdvancedMultiChanEstGroupDelayResult[];
  const macAddress = response.device?.mac_address ?? response.mac_address;
  const deviceInfo = toDeviceInfo(
    response.device?.system_description ?? response.system_description,
    response.device?.mac_address ?? response.mac_address,
  );

  return (
    <div className="operations-visual-stack">
      <DeviceInfoTable deviceInfo={deviceInfo} />
      <Panel title="All Channels · Group Delay Aligned by Frequency">
        <LineAnalysisChart
          title="All Channels Aligned by Frequency"
          subtitle={`Channels: ${results.length}`}
          yLabel="Group Delay (us)"
          series={buildAlignedSeries(results)}
          exportBaseName={buildExportBaseName(macAddress, undefined, "advanced-channel-estimation-group-delay-all-channels")}
        />
      </Panel>
      <div className="if31-ds-ofdm-channel-grid">
        {results.map((channel) => (
          <Panel key={channel.channel_id} title={`Channel ${channel.channel_id}`}>
            <LineAnalysisChart
              title="Group Delay"
              subtitle="Per-subcarrier group delay"
              yLabel="Group Delay (us)"
              series={buildSeries(channel)}
              exportBaseName={buildExportBaseName(macAddress, undefined, `advanced-channel-estimation-group-delay-channel-${channel.channel_id}`)}
            />
          </Panel>
        ))}
      </div>
    </div>
  );
}
