import { DeviceInfoTable } from "@/components/common/DeviceInfoTable";
import { Panel } from "@/components/common/Panel";
import { LineAnalysisChart } from "@/features/analysis/components/LineAnalysisChart";
import { toDeviceInfo } from "@/lib/pypnm/deviceInfo";
import type { ChartSeries } from "@/features/analysis/types";
import type { AdvancedMultiRxMerAnalysisResponse, AdvancedMultiRxMerOfdmProfileChannel } from "@/types/api";

function buildChannelSeries(channel: AdvancedMultiRxMerOfdmProfileChannel): ChartSeries[] {
  const frequency = channel.frequency ?? [];
  const series: ChartSeries[] = [
    {
      label: "Avg MER",
      color: "#79a9ff",
      points: frequency.slice(0, channel.avg_mer.length).map((value, index) => ({ x: value / 1_000_000, y: channel.avg_mer[index] ?? 0 })),
    },
    {
      label: "Shannon Limit",
      color: "#58d0a7",
      points: frequency.slice(0, channel.mer_shannon_limits.length).map((value, index) => ({ x: value / 1_000_000, y: channel.mer_shannon_limits[index] ?? 0 })),
    },
  ];

  const profileColors = ["#ef4444", "#f59e0b", "#a78bfa", "#22c55e", "#e879f9"];
  (channel.profiles ?? []).forEach((profile, index) => {
    const profileId = Number((profile as { profile_id?: number }).profile_id ?? index);
    const values = ((profile as { profile_min_mer?: number[] }).profile_min_mer ?? []);
    series.push({
      label: `Profile ${profileId}`,
      color: profileColors[index % profileColors.length],
      points: frequency.slice(0, values.length).map((value, pointIndex) => ({ x: value / 1_000_000, y: values[pointIndex] ?? 0 })),
    });
  });

  return series;
}

function formatCaptureTime(epoch: unknown): string {
  const value = Number(epoch);
  if (!Number.isFinite(value)) return "n/a";
  return new Date(value * 1000).toISOString().replace("T", " ").replace(".000Z", " UTC");
}

export function AdvancedRxMerProfilePerformanceView({ response }: { response: AdvancedMultiRxMerAnalysisResponse }) {
  const channels = Object.entries(response.data ?? {}) as Array<[string, AdvancedMultiRxMerOfdmProfileChannel]>;
  const deviceInfo = toDeviceInfo(
    response.device?.system_description ?? response.system_description,
    response.device?.mac_address ?? response.mac_address,
  );

  return (
    <div className="operations-visual-stack">
      <DeviceInfoTable deviceInfo={deviceInfo} />
      {channels.map(([channelId, channel]) => {
        const profiles = channel.profiles ?? [];
        return (
          <Panel key={channelId} title={`Channel ${channelId} · OFDM Profile Performance 1`}>
            <LineAnalysisChart
              title={`Avg MER vs Profiles · Channel ${channelId}`}
              subtitle={`Profiles: ${profiles.length}`}
              yLabel="MER (dB)"
              series={buildChannelSeries(channel)}
            />
            <div className="table-scroll">
              <table className="channel-metrics-table">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Capture Time</th>
                    <th>Capacity Δ Min</th>
                    <th>Capacity Δ Avg</th>
                    <th>Capacity Δ Max</th>
                    <th>Total CW</th>
                    <th>Corrected</th>
                    <th>Uncorrectable</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile, index) => {
                    const entry = profile as {
                      capture_time?: number;
                      profile_id?: number;
                      capacity_delta?: number[];
                      fec_summary?: { summary?: Array<{ summary?: { total_codewords?: number; corrected?: number; uncorrectable?: number } }> };
                    };
                    const capacity = entry.capacity_delta ?? [];
                    const summary = entry.fec_summary?.summary?.[0]?.summary;
                    return (
                      <tr key={index}>
                        <td className="mono">{entry.profile_id ?? index}</td>
                        <td className="mono">{formatCaptureTime(entry.capture_time)}</td>
                        <td className="mono">{capacity.length ? Math.min(...capacity).toFixed(2) : "n/a"}</td>
                        <td className="mono">{capacity.length ? (capacity.reduce((sum, value) => sum + value, 0) / capacity.length).toFixed(2) : "n/a"}</td>
                        <td className="mono">{capacity.length ? Math.max(...capacity).toFixed(2) : "n/a"}</td>
                        <td className="mono">{summary?.total_codewords?.toLocaleString?.() ?? summary?.total_codewords ?? "n/a"}</td>
                        <td className="mono">{summary?.corrected?.toLocaleString?.() ?? summary?.corrected ?? "n/a"}</td>
                        <td className="mono">{summary?.uncorrectable?.toLocaleString?.() ?? summary?.uncorrectable ?? "n/a"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
