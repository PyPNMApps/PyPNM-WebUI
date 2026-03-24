import { DeviceInfoTable } from "@/components/common/DeviceInfoTable";
import { Panel } from "@/components/common/Panel";
import { LineAnalysisChart } from "@/features/analysis/components/LineAnalysisChart";
import { CHART_SERIES_PALETTE, CHART_SERIES_PALETTE_SIZE } from "@/lib/constants";
import { buildExportBaseName } from "@/lib/export/naming";
import { toDeviceInfo } from "@/lib/pypnm/deviceInfo";
import type { ChartSeries } from "@/features/analysis/types";
import type { AdvancedMultiChanEstAnalysisResponse, AdvancedMultiChanEstGroupDelayResult } from "@/types/api";

function buildSeries(channel: AdvancedMultiChanEstGroupDelayResult): ChartSeries[] {
  return [
    {
      label: `Channel ${channel.channel_id}`,
      color: "#79a9ff",
      points: (channel.frequency ?? []).slice(0, (channel.group_delay_us ?? []).length).map((value, index) => ({
        x: value / 1_000_000,
        y: channel.group_delay_us[index] ?? 0,
      })),
    },
  ];
}

function buildAlignedSeries(results: AdvancedMultiChanEstGroupDelayResult[]): ChartSeries[] {
  return results.map((channel, index) => ({
    label: `Channel ${channel.channel_id ?? index}`,
    color: CHART_SERIES_PALETTE[index % CHART_SERIES_PALETTE_SIZE],
    points: (channel.frequency ?? []).slice(0, (channel.group_delay_us ?? []).length).map((value, pointIndex) => ({
      x: value / 1_000_000,
      y: channel.group_delay_us[pointIndex] ?? 0,
    })),
  }));
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
