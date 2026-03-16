import { NavLink, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useInstanceConfig } from "@/app/useInstanceConfig";
import { FieldLabel } from "@/components/common/FieldLabel";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { ThinkingIndicator } from "@/components/common/ThinkingIndicator";
import { requestFieldHints } from "@/features/operations/requestFieldHints";
import { useCommonRequestFormDefaults } from "@/features/operations/useRequestFormDefaults";
import { useAdvancedOperationMachine } from "@/features/advanced/useAdvancedOperationMachine";
import { AdvancedRxMerEchoDetectionView } from "@/features/advanced/AdvancedRxMerEchoDetectionView";
import { AdvancedRxMerHeatMapView } from "@/features/advanced/AdvancedRxMerHeatMapView";
import { AdvancedRxMerProfilePerformanceView } from "@/features/advanced/AdvancedRxMerProfilePerformanceView";
import { AdvancedChannelEstMinAvgMaxView } from "@/features/advanced/AdvancedChannelEstMinAvgMaxView";
import { AdvancedChannelEstGroupDelayView } from "@/features/advanced/AdvancedChannelEstGroupDelayView";
import { AdvancedChannelEstLteDetectionView } from "@/features/advanced/AdvancedChannelEstLteDetectionView";
import { AdvancedChannelEstEchoDetectionView } from "@/features/advanced/AdvancedChannelEstEchoDetectionView";
import { AdvancedOfdmaPreEqMinAvgMaxView } from "@/features/advanced/AdvancedOfdmaPreEqMinAvgMaxView";
import { AdvancedOfdmaPreEqGroupDelayView } from "@/features/advanced/AdvancedOfdmaPreEqGroupDelayView";
import { AdvancedOfdmaPreEqEchoDetectionView } from "@/features/advanced/AdvancedOfdmaPreEqEchoDetectionView";
import { parseChannelIds } from "@/lib/channelIds";
import { toDeviceInfo } from "@/lib/pypnm/deviceInfo";
import {
  analyzeAdvancedRxMer,
  getAdvancedRxMerResultsZipUrl,
  getAdvancedRxMerStatus,
  startAdvancedRxMer,
  stopAdvancedRxMer,
} from "@/services/advanced/advancedRxMerService";
import {
  analyzeAdvancedChannelEstimation,
  getAdvancedChannelEstimationResultsZipUrl,
  getAdvancedChannelEstimationStatus,
  startAdvancedChannelEstimation,
  stopAdvancedChannelEstimation,
} from "@/services/advanced/advancedChannelEstimationService";
import {
  analyzeAdvancedOfdmaPreEq,
  getAdvancedOfdmaPreEqResultsZipUrl,
  getAdvancedOfdmaPreEqStatus,
  startAdvancedOfdmaPreEq,
  stopAdvancedOfdmaPreEq,
} from "@/services/advanced/advancedOfdmaPreEqService";
import type {
  AdvancedMultiChanEstAnalysisRequest,
  AdvancedMultiChanEstAnalysisResponse,
  AdvancedMultiChanEstRequest,
  AdvancedMultiChanEstStartResponse,
  AdvancedMultiChanEstStatusResponse,
  AdvancedMultiRxMerAnalysisRequest,
  AdvancedMultiRxMerAnalysisResponse,
  AdvancedMultiRxMerRequest,
  AdvancedMultiRxMerStartResponse,
  AdvancedMultiRxMerStatusResponse,
  AdvancedMultiUsOfdmaPreEqAnalysisRequest,
  AdvancedMultiUsOfdmaPreEqAnalysisResponse,
  AdvancedMultiUsOfdmaPreEqRequest,
  AdvancedMultiUsOfdmaPreEqStartResponse,
  AdvancedMultiUsOfdmaPreEqStatusResponse,
} from "@/types/api";
import { DeviceInfoTable } from "@/components/common/DeviceInfoTable";
import { LineAnalysisChart } from "@/features/analysis/components/LineAnalysisChart";
import type { ChartSeries } from "@/features/analysis/types";

const advancedRoutes = [
  { to: "/advanced/rxmer", label: "RxMER" },
  { to: "/advanced/channel-estimation", label: "Channel Estimation" },
  { to: "/advanced/ofdma-pre-eq", label: "OFDMA PreEq" },
];

const analysisOptions = [
  { value: "min-avg-max", label: "Min / Avg / Max" },
  { value: "rxmer-heat-map", label: "Heat Map" },
  { value: "echo-reflection-1", label: "Echo Detection 1" },
  { value: "ofdm-profile-performance-1", label: "OFDM Profile Performance 1" },
] as const;

type AdvancedAnalysisType = (typeof analysisOptions)[number]["value"];

const channelEstimationAnalysisOptions = [
  { value: "min-avg-max", label: "Min / Avg / Max" },
  { value: "group-delay", label: "Group Delay" },
  { value: "lte-detection-phase-slope", label: "LTE Detection Phase Slope" },
  { value: "echo-detection-ifft", label: "Echo Detection IFFT" },
] as const;

type AdvancedChannelEstimationAnalysisType = (typeof channelEstimationAnalysisOptions)[number]["value"];

const ofdmaPreEqAnalysisOptions = [
  { value: "min-avg-max", label: "Min / Avg / Max" },
  { value: "group-delay", label: "Group Delay" },
  { value: "echo-detection-ifft", label: "Echo Detection IFFT" },
] as const;

type AdvancedOfdmaPreEqAnalysisType = (typeof ofdmaPreEqAnalysisOptions)[number]["value"];

interface AdvancedRxMerFormValues {
  macAddress: string;
  ipAddress: string;
  tftpIpv4: string;
  tftpIpv6: string;
  channelIds: string;
  community: string;
  measurementDuration: number;
  sampleInterval: number;
  measureMode: number;
}

interface AdvancedAnalysisFormValues {
  analysisType: AdvancedAnalysisType;
}

interface AdvancedChannelEstimationFormValues {
  macAddress: string;
  ipAddress: string;
  tftpIpv4: string;
  tftpIpv6: string;
  channelIds: string;
  community: string;
  measurementDuration: number;
  sampleInterval: number;
}

interface AdvancedChannelEstimationAnalysisFormValues {
  analysisType: AdvancedChannelEstimationAnalysisType;
}

interface AdvancedOfdmaPreEqFormValues {
  macAddress: string;
  ipAddress: string;
  tftpIpv4: string;
  tftpIpv6: string;
  channelIds: string;
  community: string;
  measurementDuration: number;
  sampleInterval: number;
}

interface AdvancedOfdmaPreEqAnalysisFormValues {
  analysisType: AdvancedOfdmaPreEqAnalysisType;
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function buildAdvancedJsonFilename(analysisType: string, operationId: string) {
  return `advanced-rxmer-${analysisType}-${operationId}.json`;
}

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

function AdvancedRxMerAnalysisView({
  analysisType,
  response,
}: {
  analysisType: AdvancedAnalysisType;
  response: AdvancedMultiRxMerAnalysisResponse;
}) {
  const channels = Object.entries(response.data ?? {});

  if (!channels.length) {
    return <p className="panel-copy">No analysis data available yet.</p>;
  }

  return (
    <div className="operations-visual-stack">
      <div className="status-chip-row">
        <span className="analysis-chip"><b>Analysis</b> {analysisOptions.find((option) => option.value === analysisType)?.label ?? analysisType}</span>
        <span className="analysis-chip"><b>Channels</b> {channels.length}</span>
      </div>
      {analysisType === "min-avg-max" ? (
        <>
          <DeviceInfoTable
            deviceInfo={toDeviceInfo(
              response.device?.system_description ?? response.system_description,
              response.device?.mac_address ?? response.mac_address,
            )}
          />
          <div className="if31-ds-ofdm-channel-grid">
            {channels.map(([channelId, channel]) => (
              <Panel key={channelId} title={`Channel ${channelId}`}>
                <LineAnalysisChart
                  title={`Min / Avg / Max · Channel ${channelId}`}
                  subtitle="Per-subcarrier RxMER summary"
                  yLabel="dB"
                  series={buildMinAvgMaxSeries(channel as { frequency: number[]; min: number[]; avg: number[]; max: number[] })}
                />
              </Panel>
            ))}
          </div>
        </>
      ) : analysisType === "rxmer-heat-map" ? (
        <AdvancedRxMerHeatMapView response={response} />
      ) : analysisType === "echo-reflection-1" ? (
        <AdvancedRxMerEchoDetectionView response={response} />
      ) : analysisType === "ofdm-profile-performance-1" ? (
        <AdvancedRxMerProfilePerformanceView response={response} />
      ) : (
        <>
          <DeviceInfoTable
            deviceInfo={toDeviceInfo(
              response.device?.system_description ?? response.system_description,
              response.device?.mac_address ?? response.mac_address,
            )}
          />
          <Panel title="Analysis JSON">
            <pre className="advanced-json-block">{JSON.stringify(response.data, null, 2)}</pre>
          </Panel>
        </>
      )}
    </div>
  );
}

function AdvancedRxMerWorkbench() {
  const { selectedInstance } = useInstanceConfig();
  const requestDefaults = useCommonRequestFormDefaults();
  const requestForm = useForm<AdvancedRxMerFormValues>({
    defaultValues: {
      macAddress: requestDefaults.macAddress,
      ipAddress: requestDefaults.ipAddress,
      tftpIpv4: requestDefaults.tftpIpv4,
      tftpIpv6: requestDefaults.tftpIpv6,
      channelIds: requestDefaults.channelIds,
      community: requestDefaults.community,
      measurementDuration: 30,
      sampleInterval: 1,
      measureMode: 1,
    },
  });
  const analysisForm = useForm<AdvancedAnalysisFormValues>({ defaultValues: { analysisType: "min-avg-max" } });
  const analysisType = analysisForm.watch("analysisType");
  const [analysisResponse, setAnalysisResponse] = useState<AdvancedMultiRxMerAnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [manualOperationId, setManualOperationId] = useState("");

  useEffect(() => {
    requestForm.reset((current) => ({
      ...current,
      macAddress: requestDefaults.macAddress,
      ipAddress: requestDefaults.ipAddress,
      tftpIpv4: requestDefaults.tftpIpv4,
      tftpIpv6: requestDefaults.tftpIpv6,
      channelIds: requestDefaults.channelIds,
      community: requestDefaults.community,
    }));
  }, [requestDefaults, requestForm]);

  const machine = useAdvancedOperationMachine<AdvancedMultiRxMerStartResponse, AdvancedMultiRxMerStatusResponse>({
    parseStart: (response) => ({ groupId: response.group_id, operationId: response.operation_id, message: response.message }),
    parseStatus: (response) => ({
      operationId: response.operation.operation_id,
      state: response.operation.state,
      collected: response.operation.collected,
      timeRemaining: response.operation.time_remaining,
      message: response.operation.message ?? response.message,
    }),
    startOperation: async () => {
      const values = requestForm.getValues();
      const payload: AdvancedMultiRxMerRequest = {
        cable_modem: {
          mac_address: values.macAddress,
          ip_address: values.ipAddress,
          pnm_parameters: {
            tftp: { ipv4: values.tftpIpv4, ipv6: values.tftpIpv6 },
            capture: { channel_ids: parseChannelIds(values.channelIds) },
          },
          snmp: { snmpV2C: { community: values.community } },
        },
        capture: {
          parameters: {
            measurement_duration: Number(values.measurementDuration),
            sample_interval: Number(values.sampleInterval),
          },
        },
        measure: { mode: Number(values.measureMode) },
      };
      setAnalysisResponse(null);
      setAnalysisError(null);
      return startAdvancedRxMer(selectedInstance?.baseUrl ?? "", payload);
    },
    getStatus: (operationId) => getAdvancedRxMerStatus(selectedInstance?.baseUrl ?? "", operationId),
    stopOperation: (operationId) => stopAdvancedRxMer(selectedInstance?.baseUrl ?? "", operationId),
  });

  useEffect(() => {
    if (machine.operationId) {
      setManualOperationId(machine.operationId);
    }
  }, [machine.operationId]);

  const effectiveOperationId = machine.hasOperation ? machine.operationId ?? "" : manualOperationId.trim();

  const runAnalysis = async () => {
    if (!effectiveOperationId || !selectedInstance?.baseUrl) return;
    setIsRunningAnalysis(true);
    setAnalysisError(null);
    try {
      const payload: AdvancedMultiRxMerAnalysisRequest = {
        operation_id: effectiveOperationId,
        analysis: {
          type: analysisType,
          output: { type: "json" },
          plot: { ui: { theme: "dark" } },
        },
      };
      const response = await analyzeAdvancedRxMer(selectedInstance.baseUrl, payload);
      setAnalysisResponse(response);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "Failed to run analysis.");
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  const resultsZipUrl = effectiveOperationId && selectedInstance?.baseUrl
    ? getAdvancedRxMerResultsZipUrl(selectedInstance.baseUrl, effectiveOperationId)
    : null;

  return (
    <>
      <PageHeader title="Advanced RxMER" subtitle="" />

      <Panel title="Request">
        <form className="grid" onSubmit={requestForm.handleSubmit(() => void machine.start())}>
          <div className="grid two">
            <div className="field">
              <FieldLabel htmlFor="advancedRxmerMacAddress" hint={requestFieldHints.mac_address}>MAC Address</FieldLabel>
              <input id="advancedRxmerMacAddress" {...requestForm.register("macAddress")} placeholder="aa:bb:cc:dd:ee:ff" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedRxmerIpAddress" hint={requestFieldHints.ip_address}>IP Address</FieldLabel>
              <input id="advancedRxmerIpAddress" {...requestForm.register("ipAddress")} placeholder="192.168.100.10" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedRxmerTftpIpv4" hint={requestFieldHints.tftp_ipv4}>TFTP IPv4</FieldLabel>
              <input id="advancedRxmerTftpIpv4" {...requestForm.register("tftpIpv4")} placeholder="192.168.100.2" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedRxmerTftpIpv6" hint={requestFieldHints.tftp_ipv6}>TFTP IPv6</FieldLabel>
              <input id="advancedRxmerTftpIpv6" {...requestForm.register("tftpIpv6")} placeholder="::1" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedRxmerChannelIds" hint={requestFieldHints.channel_ids}>Channel IDs</FieldLabel>
              <input id="advancedRxmerChannelIds" {...requestForm.register("channelIds")} placeholder="0" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedRxmerCommunity" hint={requestFieldHints.snmp_rw_community}>SNMP RW Community</FieldLabel>
              <input id="advancedRxmerCommunity" {...requestForm.register("community")} placeholder="private" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedRxmerDuration" hint={requestFieldHints.measurement_duration}>Measurement Duration</FieldLabel>
              <input id="advancedRxmerDuration" type="number" min="1" step="1" {...requestForm.register("measurementDuration", { valueAsNumber: true })} />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedRxmerInterval" hint={requestFieldHints.sample_interval}>Sample Interval</FieldLabel>
              <input id="advancedRxmerInterval" type="number" min="1" step="1" {...requestForm.register("sampleInterval", { valueAsNumber: true })} />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedRxmerMeasureMode" hint={requestFieldHints.measure_mode}>Measure Mode</FieldLabel>
              <select id="advancedRxmerMeasureMode" {...requestForm.register("measureMode", { valueAsNumber: true })}>
                <option value={0}>Continuous</option>
                <option value={1}>OFDM Performance 1</option>
              </select>
            </div>
          </div>
          <div className="actions">
            <button type="submit" className="primary" disabled={!selectedInstance || !machine.canStart}>
              {machine.lifecycleState === "starting" ? "Starting..." : "Start Capture"}
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Run">
        <div className="grid two advanced-run-grid">
          <div className="grid">
            <div className="status-chip-row">
              <span className="analysis-chip"><b>State</b> {machine.lifecycleState.toUpperCase()}</span>
              <span className="analysis-chip"><b>Polling</b> {machine.isPolling ? "yes" : "no"}</span>
              <span className="analysis-chip"><b>Collected</b> {machine.statusSummary?.collected ?? 0}</span>
              <span className="analysis-chip"><b>Time Remaining</b> {machine.statusSummary?.timeRemaining ?? 0}s</span>
            </div>
            {machine.lifecycleState === "starting" || machine.lifecycleState === "running" || machine.lifecycleState === "stopping" ? (
              <ThinkingIndicator
                label={
                  machine.lifecycleState === "stopping"
                    ? "Stopping advanced RxMER capture..."
                    : "Collecting advanced RxMER capture data..."
                }
              />
            ) : null}
            {machine.errorMessage ? <p className="advanced-error-text">{machine.errorMessage}</p> : null}
          </div>
          <div className="advanced-run-actions">
            <button type="button" onClick={() => void machine.refreshStatus()} disabled={!machine.hasOperation || machine.isPolling}>Refresh Status</button>
            <button type="button" onClick={() => void machine.stop()} disabled={!machine.canStop}>Stop Capture</button>
          </div>
        </div>
      </Panel>

      <Panel title="Results">
        <div className="grid two advanced-results-grid">
          <div className="field">
            <FieldLabel htmlFor="advancedRxmerOperationId" hint={requestFieldHints.operation_id}>Operation ID</FieldLabel>
            <input
              id="advancedRxmerOperationId"
              className="mono"
              value={machine.hasOperation ? machine.operationId ?? "" : manualOperationId}
              onChange={(event) => setManualOperationId(event.target.value)}
              placeholder="Enter an existing operation id"
              disabled={machine.hasOperation}
              readOnly={machine.hasOperation}
            />
          </div>
          <div className="actions advanced-run-actions">
            {resultsZipUrl ? <a className="button-link" href={resultsZipUrl} target="_blank" rel="noreferrer">Download Results ZIP</a> : null}
          </div>
        </div>
      </Panel>

      <Panel title="Analysis">
        <form className="grid" onSubmit={analysisForm.handleSubmit(() => void runAnalysis())}>
          <div className="grid two">
            <div className="field">
              <FieldLabel htmlFor="advancedRxmerAnalysisType">Analysis Type</FieldLabel>
              <select id="advancedRxmerAnalysisType" {...analysisForm.register("analysisType")}>
                {analysisOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="actions">
            <button type="submit" className="primary" disabled={!effectiveOperationId || isRunningAnalysis}>
              {isRunningAnalysis ? "Running Analysis..." : "Run Analysis"}
            </button>
            {analysisResponse ? (
              <button
                type="button"
                disabled={machine.lifecycleState !== "completed" && machine.lifecycleState !== "stopped"}
                onClick={() => downloadJson(buildAdvancedJsonFilename(analysisType, effectiveOperationId || "operation"), analysisResponse)}
              >
                Download JSON
              </button>
            ) : (
              <button type="button" disabled>Download JSON</button>
            )}
          </div>
        </form>
        {isRunningAnalysis ? <ThinkingIndicator label="Running RxMER analysis on the current capture set..." /> : null}
        {analysisError ? <p className="advanced-error-text">{analysisError}</p> : null}
        {analysisResponse ? <AdvancedRxMerAnalysisView analysisType={analysisType} response={analysisResponse} /> : null}
      </Panel>
    </>
  );
}

function AdvancedChannelEstimationAnalysisView({
  analysisType,
  response,
}: {
  analysisType: AdvancedChannelEstimationAnalysisType;
  response: AdvancedMultiChanEstAnalysisResponse;
}) {
  const results = response.data?.results ?? [];

  if (!results.length) {
    return <p className="panel-copy">No analysis data available yet.</p>;
  }

  return (
    <div className="operations-visual-stack">
      <div className="status-chip-row">
        <span className="analysis-chip"><b>Analysis</b> {channelEstimationAnalysisOptions.find((option) => option.value === analysisType)?.label ?? analysisType}</span>
        <span className="analysis-chip"><b>Channels</b> {results.length}</span>
      </div>
      {analysisType === "min-avg-max" ? (
        <AdvancedChannelEstMinAvgMaxView response={response} />
      ) : analysisType === "group-delay" ? (
        <AdvancedChannelEstGroupDelayView response={response} />
      ) : analysisType === "lte-detection-phase-slope" ? (
        <AdvancedChannelEstLteDetectionView response={response} />
      ) : analysisType === "echo-detection-ifft" ? (
        <AdvancedChannelEstEchoDetectionView response={response} />
      ) : (
        <>
          <DeviceInfoTable
            deviceInfo={toDeviceInfo(
              response.device?.system_description ?? response.system_description,
              response.device?.mac_address ?? response.mac_address,
            )}
          />
          <Panel title="Analysis JSON">
            <pre className="advanced-json-block">{JSON.stringify(response.data, null, 2)}</pre>
          </Panel>
        </>
      )}
    </div>
  );
}

function AdvancedChannelEstimationWorkbench() {
  const { selectedInstance } = useInstanceConfig();
  const requestDefaults = useCommonRequestFormDefaults();
  const requestForm = useForm<AdvancedChannelEstimationFormValues>({
    defaultValues: {
      macAddress: requestDefaults.macAddress,
      ipAddress: requestDefaults.ipAddress,
      tftpIpv4: requestDefaults.tftpIpv4,
      tftpIpv6: requestDefaults.tftpIpv6,
      channelIds: requestDefaults.channelIds,
      community: requestDefaults.community,
      measurementDuration: 30,
      sampleInterval: 1,
    },
  });
  const analysisForm = useForm<AdvancedChannelEstimationAnalysisFormValues>({ defaultValues: { analysisType: "min-avg-max" } });
  const analysisType = analysisForm.watch("analysisType");
  const [analysisResponse, setAnalysisResponse] = useState<AdvancedMultiChanEstAnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [manualOperationId, setManualOperationId] = useState("");

  useEffect(() => {
    requestForm.reset((current) => ({
      ...current,
      macAddress: requestDefaults.macAddress,
      ipAddress: requestDefaults.ipAddress,
      tftpIpv4: requestDefaults.tftpIpv4,
      tftpIpv6: requestDefaults.tftpIpv6,
      channelIds: requestDefaults.channelIds,
      community: requestDefaults.community,
    }));
  }, [requestDefaults, requestForm]);

  const machine = useAdvancedOperationMachine<AdvancedMultiChanEstStartResponse, AdvancedMultiChanEstStatusResponse>({
    parseStart: (response) => ({ groupId: response.group_id, operationId: response.operation_id, message: response.message }),
    parseStatus: (response) => ({
      operationId: response.operation.operation_id,
      state: response.operation.state,
      collected: response.operation.collected,
      timeRemaining: response.operation.time_remaining,
      message: response.operation.message ?? response.message,
    }),
    startOperation: async () => {
      const values = requestForm.getValues();
      const payload: AdvancedMultiChanEstRequest = {
        cable_modem: {
          mac_address: values.macAddress,
          ip_address: values.ipAddress,
          pnm_parameters: {
            tftp: { ipv4: values.tftpIpv4, ipv6: values.tftpIpv6 },
            capture: { channel_ids: parseChannelIds(values.channelIds) },
          },
          snmp: { snmpV2C: { community: values.community } },
        },
        capture: {
          parameters: {
            measurement_duration: Number(values.measurementDuration),
            sample_interval: Number(values.sampleInterval),
          },
        },
        measure: { mode: 0 },
      };
      setAnalysisResponse(null);
      setAnalysisError(null);
      return startAdvancedChannelEstimation(selectedInstance?.baseUrl ?? "", payload);
    },
    getStatus: (operationId) => getAdvancedChannelEstimationStatus(selectedInstance?.baseUrl ?? "", operationId),
    stopOperation: (operationId) => stopAdvancedChannelEstimation(selectedInstance?.baseUrl ?? "", operationId),
  });

  useEffect(() => {
    if (machine.operationId) {
      setManualOperationId(machine.operationId);
    }
  }, [machine.operationId]);

  const effectiveOperationId = machine.hasOperation ? machine.operationId ?? "" : manualOperationId.trim();

  const runAnalysis = async () => {
    if (!effectiveOperationId || !selectedInstance?.baseUrl) return;
    setIsRunningAnalysis(true);
    setAnalysisError(null);
    try {
      const payload: AdvancedMultiChanEstAnalysisRequest = {
        operation_id: effectiveOperationId,
        analysis: {
          type: analysisType,
          output: { type: "json" },
          plot: { ui: { theme: "dark" } },
        },
      };
      const response = await analyzeAdvancedChannelEstimation(selectedInstance.baseUrl, payload);
      setAnalysisResponse(response);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "Failed to run analysis.");
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  const resultsZipUrl = effectiveOperationId && selectedInstance?.baseUrl
    ? getAdvancedChannelEstimationResultsZipUrl(selectedInstance.baseUrl, effectiveOperationId)
    : null;

  return (
    <>
      <PageHeader title="Advanced Channel Estimation" subtitle="" />

      <Panel title="Request">
        <form className="grid" onSubmit={requestForm.handleSubmit(() => void machine.start())}>
          <div className="grid two">
            <div className="field">
              <FieldLabel htmlFor="advancedChanEstMacAddress" hint={requestFieldHints.mac_address}>MAC Address</FieldLabel>
              <input id="advancedChanEstMacAddress" {...requestForm.register("macAddress")} placeholder="aa:bb:cc:dd:ee:ff" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedChanEstIpAddress" hint={requestFieldHints.ip_address}>IP Address</FieldLabel>
              <input id="advancedChanEstIpAddress" {...requestForm.register("ipAddress")} placeholder="192.168.100.10" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedChanEstTftpIpv4" hint={requestFieldHints.tftp_ipv4}>TFTP IPv4</FieldLabel>
              <input id="advancedChanEstTftpIpv4" {...requestForm.register("tftpIpv4")} placeholder="192.168.100.2" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedChanEstTftpIpv6" hint={requestFieldHints.tftp_ipv6}>TFTP IPv6</FieldLabel>
              <input id="advancedChanEstTftpIpv6" {...requestForm.register("tftpIpv6")} placeholder="::1" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedChanEstChannelIds" hint={requestFieldHints.channel_ids}>Channel IDs</FieldLabel>
              <input id="advancedChanEstChannelIds" {...requestForm.register("channelIds")} placeholder="0" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedChanEstCommunity" hint={requestFieldHints.snmp_rw_community}>SNMP RW Community</FieldLabel>
              <input id="advancedChanEstCommunity" {...requestForm.register("community")} placeholder="private" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedChanEstDuration" hint={requestFieldHints.measurement_duration}>Measurement Duration</FieldLabel>
              <input id="advancedChanEstDuration" type="number" min="1" step="1" {...requestForm.register("measurementDuration", { valueAsNumber: true })} />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedChanEstInterval" hint={requestFieldHints.sample_interval}>Sample Interval</FieldLabel>
              <input id="advancedChanEstInterval" type="number" min="1" step="1" {...requestForm.register("sampleInterval", { valueAsNumber: true })} />
            </div>
          </div>
          <div className="actions">
            <button type="submit" className="primary" disabled={!selectedInstance || !machine.canStart}>
              {machine.lifecycleState === "starting" ? "Starting..." : "Start Capture"}
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Run">
        <div className="grid two advanced-run-grid">
          <div className="grid">
            <div className="status-chip-row">
              <span className="analysis-chip"><b>State</b> {machine.lifecycleState.toUpperCase()}</span>
              <span className="analysis-chip"><b>Polling</b> {machine.isPolling ? "yes" : "no"}</span>
              <span className="analysis-chip"><b>Collected</b> {machine.statusSummary?.collected ?? 0}</span>
              <span className="analysis-chip"><b>Time Remaining</b> {machine.statusSummary?.timeRemaining ?? 0}s</span>
            </div>
            {machine.lifecycleState === "starting" || machine.lifecycleState === "running" || machine.lifecycleState === "stopping" ? (
              <ThinkingIndicator
                label={
                  machine.lifecycleState === "stopping"
                    ? "Stopping advanced Channel Estimation capture..."
                    : "Collecting advanced Channel Estimation data..."
                }
              />
            ) : null}
            {machine.errorMessage ? <p className="advanced-error-text">{machine.errorMessage}</p> : null}
          </div>
          <div className="advanced-run-actions">
            <button type="button" onClick={() => void machine.refreshStatus()} disabled={!machine.hasOperation || machine.isPolling}>Refresh Status</button>
            <button type="button" onClick={() => void machine.stop()} disabled={!machine.canStop}>Stop Capture</button>
          </div>
        </div>
      </Panel>

      <Panel title="Results">
        <div className="grid two advanced-results-grid">
          <div className="field">
            <FieldLabel htmlFor="advancedChanEstOperationId" hint={requestFieldHints.operation_id}>Operation ID</FieldLabel>
            <input
              id="advancedChanEstOperationId"
              className="mono"
              value={machine.hasOperation ? machine.operationId ?? "" : manualOperationId}
              onChange={(event) => setManualOperationId(event.target.value)}
              placeholder="Enter an existing operation id"
              disabled={machine.hasOperation}
              readOnly={machine.hasOperation}
            />
          </div>
          <div className="actions advanced-run-actions">
            {resultsZipUrl ? <a className="button-link" href={resultsZipUrl} target="_blank" rel="noreferrer">Download Results ZIP</a> : null}
          </div>
        </div>
      </Panel>

      <Panel title="Analysis">
        <form className="grid" onSubmit={analysisForm.handleSubmit(() => void runAnalysis())}>
          <div className="grid two">
            <div className="field">
              <FieldLabel htmlFor="advancedChanEstAnalysisType">Analysis Type</FieldLabel>
              <select id="advancedChanEstAnalysisType" {...analysisForm.register("analysisType")}>
                {channelEstimationAnalysisOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="actions">
            <button type="submit" className="primary" disabled={!effectiveOperationId || isRunningAnalysis}>
              {isRunningAnalysis ? "Running Analysis..." : "Run Analysis"}
            </button>
            {analysisResponse ? (
              <button
                type="button"
                disabled={machine.lifecycleState !== "completed" && machine.lifecycleState !== "stopped"}
                onClick={() => downloadJson(`advanced-channel-estimation-${analysisType}-${effectiveOperationId || "operation"}.json`, analysisResponse)}
              >
                Download JSON
              </button>
            ) : (
              <button type="button" disabled>Download JSON</button>
            )}
          </div>
        </form>
        {isRunningAnalysis ? <ThinkingIndicator label="Running Channel Estimation analysis on the current capture set..." /> : null}
        {analysisError ? <p className="advanced-error-text">{analysisError}</p> : null}
        {analysisResponse ? <AdvancedChannelEstimationAnalysisView analysisType={analysisType} response={analysisResponse} /> : null}
      </Panel>
    </>
  );
}

function AdvancedOfdmaPreEqAnalysisView({
  analysisType,
  response,
}: {
  analysisType: AdvancedOfdmaPreEqAnalysisType;
  response: AdvancedMultiUsOfdmaPreEqAnalysisResponse;
}) {
  const results = response.data?.results ?? [];

  if (!results.length) {
    return <p className="panel-copy">No analysis data available yet.</p>;
  }

  return (
    <div className="operations-visual-stack">
      <div className="status-chip-row">
        <span className="analysis-chip"><b>Analysis</b> {ofdmaPreEqAnalysisOptions.find((option) => option.value === analysisType)?.label ?? analysisType}</span>
        <span className="analysis-chip"><b>Channels</b> {results.length}</span>
      </div>
      {analysisType === "min-avg-max" ? (
        <AdvancedOfdmaPreEqMinAvgMaxView response={response} />
      ) : analysisType === "group-delay" ? (
        <AdvancedOfdmaPreEqGroupDelayView response={response} />
      ) : analysisType === "echo-detection-ifft" ? (
        <AdvancedOfdmaPreEqEchoDetectionView response={response} />
      ) : (
        <>
          <DeviceInfoTable
            deviceInfo={toDeviceInfo(
              response.device?.system_description ?? response.system_description,
              response.device?.mac_address ?? response.mac_address,
            )}
          />
          <Panel title="Analysis JSON">
            <pre className="advanced-json-block">{JSON.stringify(response.data, null, 2)}</pre>
          </Panel>
        </>
      )}
    </div>
  );
}

function AdvancedOfdmaPreEqWorkbench() {
  const { selectedInstance } = useInstanceConfig();
  const requestDefaults = useCommonRequestFormDefaults();
  const requestForm = useForm<AdvancedOfdmaPreEqFormValues>({
    defaultValues: {
      macAddress: requestDefaults.macAddress,
      ipAddress: requestDefaults.ipAddress,
      tftpIpv4: requestDefaults.tftpIpv4,
      tftpIpv6: requestDefaults.tftpIpv6,
      channelIds: requestDefaults.channelIds,
      community: requestDefaults.community,
      measurementDuration: 30,
      sampleInterval: 1,
    },
  });
  const analysisForm = useForm<AdvancedOfdmaPreEqAnalysisFormValues>({ defaultValues: { analysisType: "min-avg-max" } });
  const analysisType = analysisForm.watch("analysisType");
  const [analysisResponse, setAnalysisResponse] = useState<AdvancedMultiUsOfdmaPreEqAnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [manualOperationId, setManualOperationId] = useState("");

  useEffect(() => {
    requestForm.reset((current) => ({
      ...current,
      macAddress: requestDefaults.macAddress,
      ipAddress: requestDefaults.ipAddress,
      tftpIpv4: requestDefaults.tftpIpv4,
      tftpIpv6: requestDefaults.tftpIpv6,
      channelIds: requestDefaults.channelIds,
      community: requestDefaults.community,
    }));
  }, [requestDefaults, requestForm]);

  const machine = useAdvancedOperationMachine<AdvancedMultiUsOfdmaPreEqStartResponse, AdvancedMultiUsOfdmaPreEqStatusResponse>({
    parseStart: (response) => ({ groupId: response.group_id, operationId: response.operation_id, message: response.message }),
    parseStatus: (response) => ({
      operationId: response.operation.operation_id,
      state: response.operation.state,
      collected: response.operation.collected,
      timeRemaining: response.operation.time_remaining,
      message: response.operation.message ?? response.message,
    }),
    startOperation: async () => {
      const values = requestForm.getValues();
      const payload: AdvancedMultiUsOfdmaPreEqRequest = {
        cable_modem: {
          mac_address: values.macAddress,
          ip_address: values.ipAddress,
          pnm_parameters: {
            tftp: { ipv4: values.tftpIpv4, ipv6: values.tftpIpv6 },
            capture: { channel_ids: parseChannelIds(values.channelIds) },
          },
          snmp: { snmpV2C: { community: values.community } },
        },
        capture: {
          parameters: {
            measurement_duration: Number(values.measurementDuration),
            sample_interval: Number(values.sampleInterval),
          },
        },
        measure: { mode: 0 },
      };
      setAnalysisResponse(null);
      setAnalysisError(null);
      return startAdvancedOfdmaPreEq(selectedInstance?.baseUrl ?? "", payload);
    },
    getStatus: (operationId) => getAdvancedOfdmaPreEqStatus(selectedInstance?.baseUrl ?? "", operationId),
    stopOperation: (operationId) => stopAdvancedOfdmaPreEq(selectedInstance?.baseUrl ?? "", operationId),
  });

  useEffect(() => {
    if (machine.operationId) {
      setManualOperationId(machine.operationId);
    }
  }, [machine.operationId]);

  const effectiveOperationId = machine.hasOperation ? machine.operationId ?? "" : manualOperationId.trim();

  const runAnalysis = async () => {
    if (!effectiveOperationId || !selectedInstance?.baseUrl) return;
    setIsRunningAnalysis(true);
    setAnalysisError(null);
    try {
      const payload: AdvancedMultiUsOfdmaPreEqAnalysisRequest = {
        operation_id: effectiveOperationId,
        analysis: {
          type: analysisType,
          output: { type: "json" },
          plot: { ui: { theme: "dark" } },
        },
      };
      const response = await analyzeAdvancedOfdmaPreEq(selectedInstance.baseUrl, payload);
      setAnalysisResponse(response);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "Failed to run analysis.");
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  const resultsZipUrl = effectiveOperationId && selectedInstance?.baseUrl
    ? getAdvancedOfdmaPreEqResultsZipUrl(selectedInstance.baseUrl, effectiveOperationId)
    : null;

  return (
    <>
      <PageHeader title="Advanced OFDMA PreEq" subtitle="" />

      <Panel title="Request">
        <form className="grid" onSubmit={requestForm.handleSubmit(() => void machine.start())}>
          <div className="grid two">
            <div className="field">
              <FieldLabel htmlFor="advancedOfdmaPreEqMacAddress" hint={requestFieldHints.mac_address}>MAC Address</FieldLabel>
              <input id="advancedOfdmaPreEqMacAddress" {...requestForm.register("macAddress")} placeholder="aa:bb:cc:dd:ee:ff" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedOfdmaPreEqIpAddress" hint={requestFieldHints.ip_address}>IP Address</FieldLabel>
              <input id="advancedOfdmaPreEqIpAddress" {...requestForm.register("ipAddress")} placeholder="192.168.100.10" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedOfdmaPreEqTftpIpv4" hint={requestFieldHints.tftp_ipv4}>TFTP IPv4</FieldLabel>
              <input id="advancedOfdmaPreEqTftpIpv4" {...requestForm.register("tftpIpv4")} placeholder="192.168.100.2" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedOfdmaPreEqTftpIpv6" hint={requestFieldHints.tftp_ipv6}>TFTP IPv6</FieldLabel>
              <input id="advancedOfdmaPreEqTftpIpv6" {...requestForm.register("tftpIpv6")} placeholder="::1" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedOfdmaPreEqChannelIds" hint={requestFieldHints.channel_ids}>Channel IDs</FieldLabel>
              <input id="advancedOfdmaPreEqChannelIds" {...requestForm.register("channelIds")} placeholder="0" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedOfdmaPreEqCommunity" hint={requestFieldHints.snmp_rw_community}>SNMP RW Community</FieldLabel>
              <input id="advancedOfdmaPreEqCommunity" {...requestForm.register("community")} placeholder="private" />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedOfdmaPreEqDuration" hint={requestFieldHints.measurement_duration}>Measurement Duration</FieldLabel>
              <input id="advancedOfdmaPreEqDuration" type="number" min="1" step="1" {...requestForm.register("measurementDuration", { valueAsNumber: true })} />
            </div>
            <div className="field">
              <FieldLabel htmlFor="advancedOfdmaPreEqInterval" hint={requestFieldHints.sample_interval}>Sample Interval</FieldLabel>
              <input id="advancedOfdmaPreEqInterval" type="number" min="1" step="1" {...requestForm.register("sampleInterval", { valueAsNumber: true })} />
            </div>
          </div>
          <div className="actions">
            <button type="submit" className="primary" disabled={!selectedInstance || !machine.canStart}>
              {machine.lifecycleState === "starting" ? "Starting..." : "Start Capture"}
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Run">
        <div className="grid two advanced-run-grid">
          <div className="grid">
            <div className="status-chip-row">
              <span className="analysis-chip"><b>State</b> {machine.lifecycleState.toUpperCase()}</span>
              <span className="analysis-chip"><b>Polling</b> {machine.isPolling ? "yes" : "no"}</span>
              <span className="analysis-chip"><b>Collected</b> {machine.statusSummary?.collected ?? 0}</span>
              <span className="analysis-chip"><b>Time Remaining</b> {machine.statusSummary?.timeRemaining ?? 0}s</span>
            </div>
            {machine.lifecycleState === "starting" || machine.lifecycleState === "running" || machine.lifecycleState === "stopping" ? (
              <ThinkingIndicator
                label={
                  machine.lifecycleState === "stopping"
                    ? "Stopping advanced OFDMA PreEq capture..."
                    : "Collecting advanced OFDMA PreEq data..."
                }
              />
            ) : null}
            {machine.errorMessage ? <p className="advanced-error-text">{machine.errorMessage}</p> : null}
          </div>
          <div className="advanced-run-actions">
            <button type="button" onClick={() => void machine.refreshStatus()} disabled={!machine.hasOperation || machine.isPolling}>Refresh Status</button>
            <button type="button" onClick={() => void machine.stop()} disabled={!machine.canStop}>Stop Capture</button>
          </div>
        </div>
      </Panel>

      <Panel title="Results">
        <div className="grid two advanced-results-grid">
          <div className="field">
            <FieldLabel htmlFor="advancedOfdmaPreEqOperationId" hint={requestFieldHints.operation_id}>Operation ID</FieldLabel>
            <input
              id="advancedOfdmaPreEqOperationId"
              className="mono"
              value={machine.hasOperation ? machine.operationId ?? "" : manualOperationId}
              onChange={(event) => setManualOperationId(event.target.value)}
              placeholder="Enter an existing operation id"
              disabled={machine.hasOperation}
              readOnly={machine.hasOperation}
            />
          </div>
          <div className="actions advanced-run-actions">
            {resultsZipUrl ? <a className="button-link" href={resultsZipUrl} target="_blank" rel="noreferrer">Download Results ZIP</a> : null}
          </div>
        </div>
      </Panel>

      <Panel title="Analysis">
        <form className="grid" onSubmit={analysisForm.handleSubmit(() => void runAnalysis())}>
          <div className="grid two">
            <div className="field">
              <FieldLabel htmlFor="advancedOfdmaPreEqAnalysisType">Analysis Type</FieldLabel>
              <select id="advancedOfdmaPreEqAnalysisType" {...analysisForm.register("analysisType")}>
                {ofdmaPreEqAnalysisOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="actions">
            <button type="submit" className="primary" disabled={!effectiveOperationId || isRunningAnalysis}>
              {isRunningAnalysis ? "Running Analysis..." : "Run Analysis"}
            </button>
            {analysisResponse ? (
              <button
                type="button"
                disabled={machine.lifecycleState !== "completed" && machine.lifecycleState !== "stopped"}
                onClick={() => downloadJson(`advanced-ofdma-pre-eq-${analysisType}-${effectiveOperationId || "operation"}.json`, analysisResponse)}
              >
                Download JSON
              </button>
            ) : (
              <button type="button" disabled>Download JSON</button>
            )}
          </div>
        </form>
        {isRunningAnalysis ? <ThinkingIndicator label="Running OFDMA PreEq analysis on the current capture set..." /> : null}
        {analysisError ? <p className="advanced-error-text">{analysisError}</p> : null}
        {analysisResponse ? <AdvancedOfdmaPreEqAnalysisView analysisType={analysisType} response={analysisResponse} /> : null}
      </Panel>
    </>
  );
}

export function AdvancedPage() {
  const location = useLocation();

  if (location.pathname === "/advanced") {
    return <Navigate to="/advanced/rxmer" replace />;
  }

  return (
    <>
      <nav className="advanced-subnav">
        {advancedRoutes.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>{item.label}</NavLink>
        ))}
      </nav>
      {location.pathname === "/advanced/channel-estimation" ? (
        <AdvancedChannelEstimationWorkbench />
      ) : location.pathname === "/advanced/ofdma-pre-eq" ? (
        <AdvancedOfdmaPreEqWorkbench />
      ) : (
        <AdvancedRxMerWorkbench />
      )}
    </>
  );
}
