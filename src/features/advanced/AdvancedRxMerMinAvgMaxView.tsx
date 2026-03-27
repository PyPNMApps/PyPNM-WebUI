import { useState } from "react";

import { Panel } from "@/components/common/Panel";
import { DeviceInfoTable } from "@/components/common/DeviceInfoTable";
import { SeriesVisibilityChips } from "@/components/common/SeriesVisibilityChips";
import { SpectrumSelectionActions } from "@/components/common/SpectrumSelectionActions";
import { LineAnalysisChart } from "@/features/analysis/components/LineAnalysisChart";
import type { ChartSeries } from "@/features/analysis/types";
import { buildExportBaseName } from "@/lib/export/naming";
import { toDeviceInfo } from "@/lib/pypnm/deviceInfo";
import type { SpectrumSelectionRange } from "@/lib/spectrumPower";
import type { AdvancedMultiRxMerAnalysisResponse } from "@/types/api";

function buildMinAvgMaxSeries(channel: {
  frequency: number[];
  min: number[];
  avg: number[];
  max: number[];
}): ChartSeries[] {
  const frequencies = channel.frequency ?? [];
  return [
    {
      label: "Min",
      color: "#ef4444",
      points: frequencies.slice(0, channel.min.length).map((frequency, index) => ({ x: frequency / 1_000_000, y: channel.min[index] ?? 0 })),
    },
    {
      label: "Avg",
      color: "#79a9ff",
      points: frequencies.slice(0, channel.avg.length).map((frequency, index) => ({ x: frequency / 1_000_000, y: channel.avg[index] ?? 0 })),
    },
    {
      label: "Max",
      color: "#58d0a7",
      points: frequencies.slice(0, channel.max.length).map((frequency, index) => ({ x: frequency / 1_000_000, y: channel.max[index] ?? 0 })),
    },
  ];
}

function RxMerMinAvgMaxChannelPanel({
  channelId,
  channel,
  macAddress,
}: {
  channelId: string;
  channel: {
    frequency: number[];
    min: number[];
    avg: number[];
    max: number[];
  };
  macAddress: string | undefined;
}) {
  const [seriesVisibility, setSeriesVisibility] = useState<Record<string, boolean>>({});
  const [selection, setSelection] = useState<SpectrumSelectionRange | null>(null);
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null);
  const allSeries = buildMinAvgMaxSeries(channel);
  const visibleSeries = allSeries.filter((item) => seriesVisibility[item.label] !== false);

  return (
    <Panel title={`Channel ${channelId}`}>
      <SeriesVisibilityChips
        series={allSeries}
        visibility={seriesVisibility}
        onToggle={(label) => {
          setSeriesVisibility((current) => ({ ...current, [label]: current[label] === false }));
        }}
      />
      <LineAnalysisChart
        title={`Min / Avg / Max · Channel ${channelId}`}
        subtitle="Per-subcarrier RxMER summary"
        yLabel="dB"
        series={visibleSeries}
        xDomain={zoomDomain ?? undefined}
        showLegend={false}
        enableRangeSelection
        selection={selection}
        onSelectionChange={setSelection}
        selectionActions={(
          <SpectrumSelectionActions
            selection={selection}
            hasZoomDomain={zoomDomain !== null}
            showIntegratedPower={false}
            onApplyZoom={(domain) => setZoomDomain(domain)}
            onResetZoom={() => setZoomDomain(null)}
          />
        )}
        exportBaseName={buildExportBaseName(
          macAddress,
          undefined,
          `advanced-rxmer-min-avg-max-channel-${channelId}`,
        )}
      />
    </Panel>
  );
}

export function AdvancedRxMerMinAvgMaxView({
  response,
}: {
  response: AdvancedMultiRxMerAnalysisResponse;
}) {
  const channels = Object.entries(response.data ?? {});
  const macAddress = response.device?.mac_address ?? response.mac_address;
  const [allChannelsSelection, setAllChannelsSelection] = useState<SpectrumSelectionRange | null>(null);
  const [allChannelsZoomDomain, setAllChannelsZoomDomain] = useState<[number, number] | null>(null);

  return (
    <>
      <DeviceInfoTable
        deviceInfo={toDeviceInfo(
          response.device?.system_description ?? response.system_description,
          macAddress,
        )}
      />
      <Panel title="All Channels · Avg Aligned by Frequency">
        <LineAnalysisChart
          title="All Channels Aligned by Frequency"
          subtitle={`Channels: ${channels.length}`}
          yLabel="dB"
          series={channels.map(([channelId, channel], index) => ({
            label: `Channel ${channelId}`,
            color: ["#79a9ff", "#58d0a7", "#f59e0b", "#ef4444", "#a78bfa"][index % 5],
            points: (channel as { frequency: number[]; avg: number[] }).frequency
              .slice(0, (channel as { frequency: number[]; avg: number[] }).avg.length)
              .map((frequency, pointIndex) => ({
                x: frequency / 1_000_000,
                y: (channel as { frequency: number[]; avg: number[] }).avg[pointIndex] ?? 0,
              })),
          }))}
          xDomain={allChannelsZoomDomain ?? undefined}
          showLegend={false}
          enableRangeSelection
          selection={allChannelsSelection}
          onSelectionChange={setAllChannelsSelection}
          selectionActions={(
            <SpectrumSelectionActions
              selection={allChannelsSelection}
              hasZoomDomain={allChannelsZoomDomain !== null}
              showIntegratedPower={false}
              onApplyZoom={(domain) => setAllChannelsZoomDomain(domain)}
              onResetZoom={() => setAllChannelsZoomDomain(null)}
            />
          )}
          exportBaseName={buildExportBaseName(
            macAddress,
            undefined,
            "advanced-rxmer-min-avg-max-all-channels",
          )}
        />
      </Panel>
      <div className="if31-ds-ofdm-channel-grid">
        {channels.map(([channelId, channel]) => (
          <RxMerMinAvgMaxChannelPanel
            key={channelId}
            channelId={channelId}
            channel={channel as { frequency: number[]; min: number[]; avg: number[]; max: number[] }}
            macAddress={macAddress}
          />
        ))}
      </div>
    </>
  );
}
