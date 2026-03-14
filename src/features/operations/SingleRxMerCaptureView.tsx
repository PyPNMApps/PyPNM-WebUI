import { DeviceInfoTable } from "@/features/analysis/components/DeviceInfoTable";
import { LineAnalysisChart } from "@/features/analysis/components/LineAnalysisChart";
import { ModulationCountsChart } from "@/features/operations/ModulationCountsChart";
import type { ChartSeries, DeviceInfo } from "@/features/analysis/types";
import type {
  SingleRxMerAnalysisEntry,
  SingleRxMerCaptureResponse,
  SingleRxMerSystemDescription,
} from "@/types/api";

function toDeviceInfo(system: SingleRxMerSystemDescription | undefined, macAddress: string | undefined): DeviceInfo {
  return {
    macAddress: macAddress ?? "n/a",
    MODEL: system?.MODEL ?? "n/a",
    VENDOR: system?.VENDOR ?? "n/a",
    SW_REV: system?.SW_REV ?? "n/a",
    HW_REV: system?.HW_REV ?? "n/a",
    BOOTR: system?.BOOTR ?? "n/a",
  };
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / (values.length || 1);
}

function summarize(values: number[]) {
  return {
    avg: average(values),
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function toSeries(channel: SingleRxMerAnalysisEntry, color: string, label?: string): ChartSeries {
  const magnitude = channel.carrier_values?.magnitude ?? [];
  const frequency = channel.carrier_values?.frequency ?? [];

  return {
    label: label ?? `Channel ${channel.channel_id ?? "n/a"}`,
    color,
    points: magnitude.map((value, index) => ({
      x: (frequency[index] ?? 0) / 1_000_000,
      y: value,
    })),
  };
}

function formatCaptureTime(epochSeconds: number | undefined): string {
  if (!epochSeconds) {
    return "n/a";
  }

  return new Date(epochSeconds * 1000).toISOString().replace("T", " ").replace(".000Z", " UTC");
}

function findFallbackCaptureTime(analysis: SingleRxMerAnalysisEntry[]): number | undefined {
  return analysis.find((entry) => typeof entry.pnm_header?.capture_time === "number")?.pnm_header?.capture_time;
}

const palette = ["#79a9ff", "#58d0a7", "#ff7a6b", "#f1c75b"] as const;

export function SingleRxMerCaptureView({ response }: { response: SingleRxMerCaptureResponse }) {
  const analysis = response.data?.analysis ?? [];

  if (!analysis.length) {
    return <p className="panel-copy">No RxMER capture data available yet.</p>;
  }

  const primary = analysis[0];
  const fallbackCaptureTime = findFallbackCaptureTime(analysis);
  const deviceInfo = toDeviceInfo(
    primary?.device_details?.system_description ?? response.system_description,
    primary?.mac_address ?? response.mac_address,
  );
  const combinedSeries = analysis.map((channel, index) => toSeries(channel, palette[index % palette.length]));
  return (
    <div className="operations-visual-stack">
      <div className="status-chip-row">
        <span className="analysis-chip">
          <b>Channels</b> {analysis.length}
        </span>
      </div>

      <DeviceInfoTable deviceInfo={deviceInfo} />

      <LineAnalysisChart title="All Channels" subtitle="" yLabel="RxMER (dB)" series={combinedSeries} />

      <div className="analysis-channels-grid">
        {analysis.map((channel, index) => {
          const magnitude = channel.carrier_values?.magnitude ?? [];
          const stats = summarize(magnitude);
          const bits = channel.modulation_statistics?.bits_per_symbol ?? [];

          return (
            <article key={channel.channel_id ?? index} className="analysis-channel-card">
              <div className="analysis-channel-top">
                <h3 className="analysis-channel-title">Channel {channel.channel_id ?? "n/a"}</h3>
                <div className="analysis-channel-meta-line">
                  <span>
                    {channel.carrier_values?.frequency?.length
                      ? `${Math.round((channel.carrier_values.frequency[0] ?? 0) / 1_000_000)} - ${Math.round((channel.carrier_values.frequency[channel.carrier_values.frequency.length - 1] ?? 0) / 1_000_000)} MHz`
                      : "Frequency range unavailable"}
                  </span>
                  <span>{formatCaptureTime(channel.pnm_header?.capture_time ?? fallbackCaptureTime)}</span>
                </div>
              </div>

              <div className="analysis-channel-body">
                <div className="analysis-small-metrics">
                  <div className="analysis-small-metric">
                    <div className="analysis-small-k">Avg RxMER</div>
                    <div className="analysis-small-v">{stats.avg.toFixed(2)} dB</div>
                  </div>
                  <div className="analysis-small-metric">
                    <div className="analysis-small-k">Min / Max</div>
                    <div className="analysis-small-v">
                      {stats.min.toFixed(2)} / {stats.max.toFixed(2)} dB
                    </div>
                  </div>
                  <div className="analysis-small-metric">
                    <div className="analysis-small-k">Bits / Symbol Avg</div>
                    <div className="analysis-small-v">{bits.length ? average(bits).toFixed(2) : "n/a"}</div>
                  </div>
                </div>

                <LineAnalysisChart
                  title={`RxMER and Regression (Channel ${channel.channel_id ?? "n/a"})`}
                  subtitle=""
                  yLabel="RxMER (dB)"
                  series={[
                    toSeries(channel, palette[index % palette.length], "RxMER"),
                    {
                      label: "Regression",
                      color: "#ff7a6b",
                      points: (channel.regression?.slope ?? []).map((value, pointIndex) => ({
                        x: ((channel.carrier_values?.frequency ?? [])[pointIndex] ?? 0) / 1_000_000,
                        y: value,
                      })),
                    },
                  ]}
                />

                <ModulationCountsChart
                  title={`Supported Modulation Counts (Channel ${channel.channel_id ?? "n/a"})`}
                  counts={channel.modulation_statistics?.supported_modulation_counts}
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
