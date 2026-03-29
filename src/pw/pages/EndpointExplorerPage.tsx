import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useInstanceConfig } from "@/app/useInstanceConfig";
import { RequestJsonAction } from "@/components/common/RequestJsonAction";
import type { CaptureConnectivityInputs, CaptureConnectivityStatus } from "@/pw/features/operations/captureConnectivity";
import {
  buildCaptureConnectivityInputsFromInstance,
  hasCompleteCaptureConnectivityInputs,
  isCaptureConnectivityOnline,
} from "@/pw/features/operations/captureConnectivity";
import { CaptureOperationShell } from "@/pw/features/operations/components/CaptureOperationShell";
import { renderEndpointExplorerRequestForm } from "@/pw/features/operations/components/EndpointExplorerRequestForm";
import {
  type EndpointExplorerResponses,
  getEndpointExplorerSelectedResponse,
  renderEndpointExplorerResultsView,
} from "@/pw/features/operations/components/EndpointExplorerResultsView";
import {
  createEndpointExplorerSuccessHandlers,
  type EndpointExplorerMutationResponse,
} from "@/pw/features/operations/components/EndpointExplorerSuccessHandler";
import {
  getOperationByRoutePath,
  operationNavigationItems,
  singleCaptureNavigationItems,
} from "@/pw/features/operations/operationsNavigation";
import { checkCaptureInputsOnline } from "@/pw/services/captureConnectivityService";
import { CONNECTIVITY_STATUS_DEBOUNCE_MS } from "@/lib/constants";
import { runSingleCaptureEndpoint } from "@/pw/services/singleCaptureService";
import type {
  AtdmaChannelStatsResponse,
  FddDiplexerBandEdgeCapabilityResponse,
  FddSystemDiplexerConfigurationResponse,
  If31DocsisBaseCapabilityResponse,
  If31DsOfdmChannelStatsResponse,
  If31DsOfdmProfileStatsResponse,
  If31UsOfdmaChannelStatsResponse,
  If31SystemDiplexerResponse,
  DsScqamCodewordErrorRateRequest,
  DsScqamCodewordErrorRateResponse,
  DsScqamChannelStatsResponse,
  AtdmaPreEqualizationResponse,
  DeviceConnectRequest,
  DeviceEventLogRequest,
  DeviceEventLogResponse,
  InterfaceStatsResponse,
  SingleChannelEstCoeffCaptureResponse,
  SingleConstellationDisplayCaptureRequest,
  SingleConstellationDisplayCaptureResponse,
  SingleFecSummaryCaptureResponse,
  SingleFecSummaryCaptureRequest,
  SingleHistogramCaptureResponse,
  SingleHistogramCaptureRequest,
  SingleModulationProfileCaptureRequest,
  SingleModulationProfileCaptureResponse,
  SingleUsOfdmaPreEqualizationCaptureRequest,
  SingleUsOfdmaPreEqualizationCaptureResponse,
  SingleRxMerCaptureRequest,
  SingleRxMerCaptureResponse,
  SingleSpectrumOfdmCaptureRequest,
  SingleSpectrumOfdmCaptureResponse,
  SingleSpectrumScqamCaptureRequest,
  SingleSpectrumScqamCaptureResponse,
  SingleSpectrumFullBandCaptureRequest,
  SingleSpectrumFriendlyCaptureRequest,
  SingleSpectrumFriendlyCaptureResponse,
  SystemUpTimeResponse,
} from "@/types/api";

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

function buildJsonFilename(label: string): string {
  return `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "operation"}.json`;
}

export function EndpointExplorerPage() {
  const location = useLocation();
  const { selectedInstance } = useInstanceConfig();
  const isSingleCaptureRoute = location.pathname.startsWith("/single-capture");
  const isSpectrumAnalyzerRoute = location.pathname.startsWith("/spectrum-analyzer");
  const [captureConnectivityInputs, setCaptureConnectivityInputs] = useState<CaptureConnectivityInputs | null>(null);
  const [captureConnectivityStatus, setCaptureConnectivityStatus] = useState<CaptureConnectivityStatus>("unknown");
  const connectivityCheckSequenceRef = useRef(0);
  const connectivityHasCheckedInitialRef = useRef(false);
  const [atdmaChannelStatsResponse, setAtdmaChannelStatsResponse] = useState<AtdmaChannelStatsResponse | null>(null);
  const [fddDiplexerBandEdgeCapabilityResponse, setFddDiplexerBandEdgeCapabilityResponse] = useState<FddDiplexerBandEdgeCapabilityResponse | null>(null);
  const [fddSystemDiplexerConfigurationResponse, setFddSystemDiplexerConfigurationResponse] = useState<FddSystemDiplexerConfigurationResponse | null>(null);
  const [if31DocsisBaseCapabilityResponse, setIf31DocsisBaseCapabilityResponse] = useState<If31DocsisBaseCapabilityResponse | null>(null);
  const [if31DsOfdmChannelStatsResponse, setIf31DsOfdmChannelStatsResponse] = useState<If31DsOfdmChannelStatsResponse | null>(null);
  const [if31DsOfdmProfileStatsResponse, setIf31DsOfdmProfileStatsResponse] = useState<If31DsOfdmProfileStatsResponse | null>(null);
  const [if31UsOfdmaChannelStatsResponse, setIf31UsOfdmaChannelStatsResponse] = useState<If31UsOfdmaChannelStatsResponse | null>(null);
  const [if31SystemDiplexerResponse, setIf31SystemDiplexerResponse] = useState<If31SystemDiplexerResponse | null>(null);
  const [dsScqamCodewordErrorRateResponse, setDsScqamCodewordErrorRateResponse] = useState<DsScqamCodewordErrorRateResponse | null>(null);
  const [dsScqamChannelStatsResponse, setDsScqamChannelStatsResponse] = useState<DsScqamChannelStatsResponse | null>(null);
  const [atdmaPreEqualizationResponse, setAtdmaPreEqualizationResponse] = useState<AtdmaPreEqualizationResponse | null>(null);
  const [rxMerResponse, setRxMerResponse] = useState<SingleRxMerCaptureResponse | null>(null);
  const [channelEstResponse, setChannelEstResponse] = useState<SingleChannelEstCoeffCaptureResponse | null>(null);
  const [constellationResponse, setConstellationResponse] = useState<SingleConstellationDisplayCaptureResponse | null>(null);
  const [eventLogResponse, setEventLogResponse] = useState<DeviceEventLogResponse | null>(null);
  const [fecSummaryResponse, setFecSummaryResponse] = useState<SingleFecSummaryCaptureResponse | null>(null);
  const [histogramResponse, setHistogramResponse] = useState<SingleHistogramCaptureResponse | null>(null);
  const [interfaceStatsResponse, setInterfaceStatsResponse] = useState<InterfaceStatsResponse | null>(null);
  const [modulationProfileResponse, setModulationProfileResponse] = useState<SingleModulationProfileCaptureResponse | null>(null);
  const [usOfdmaPreEqualizationResponse, setUsOfdmaPreEqualizationResponse] = useState<SingleUsOfdmaPreEqualizationCaptureResponse | null>(null);
  const [systemUpTimeResponse, setSystemUpTimeResponse] = useState<SystemUpTimeResponse | null>(null);
  const [spectrumFriendlyResponse, setSpectrumFriendlyResponse] = useState<SingleSpectrumFriendlyCaptureResponse | null>(null);
  const [spectrumFullBandResponse, setSpectrumFullBandResponse] = useState<SingleSpectrumFriendlyCaptureResponse | null>(null);
  const [spectrumOfdmResponse, setSpectrumOfdmResponse] = useState<SingleSpectrumOfdmCaptureResponse | null>(null);
  const [spectrumScqamResponse, setSpectrumScqamResponse] = useState<SingleSpectrumScqamCaptureResponse | null>(null);
  const selectedOperation = getOperationByRoutePath(location.pathname);
  const canExecuteOperation = Boolean(selectedInstance) && isCaptureConnectivityOnline(captureConnectivityStatus);
  const captureInputsTitle = useMemo(() => {
    const label = captureConnectivityStatus === "online"
      ? "Online"
      : captureConnectivityStatus === "offline"
        ? "Offline"
        : captureConnectivityStatus === "checking"
          ? "Checking"
          : "Unknown";
    const stateClass = captureConnectivityStatus === "online"
      ? "online"
      : captureConnectivityStatus === "offline"
        ? "offline"
        : captureConnectivityStatus === "checking"
          ? "checking"
          : "unknown";

    return (
      <div className="panel-title-inline">
        <h2 className="panel-title-heading">Capture Inputs</h2>
        <span className={`capture-status-chip ${stateClass}`}>{label}</span>
      </div>
    );
  }, [captureConnectivityStatus]);

  useEffect(() => {
    connectivityHasCheckedInitialRef.current = false;
    connectivityCheckSequenceRef.current += 1;
    setCaptureConnectivityInputs(buildCaptureConnectivityInputsFromInstance(selectedInstance));
    setCaptureConnectivityStatus("unknown");
  }, [selectedInstance, selectedOperation?.id]);

  useEffect(() => {
    if (!selectedInstance?.baseUrl || !hasCompleteCaptureConnectivityInputs(captureConnectivityInputs)) {
      setCaptureConnectivityStatus("unknown");
      return;
    }

    const runCheck = async (requestId: number) => {
      setCaptureConnectivityStatus("checking");
      try {
        const isOnline = await checkCaptureInputsOnline(selectedInstance.baseUrl, captureConnectivityInputs);
        if (connectivityCheckSequenceRef.current !== requestId) {
          return;
        }
        setCaptureConnectivityStatus(isOnline ? "online" : "offline");
      } catch {
        if (connectivityCheckSequenceRef.current !== requestId) {
          return;
        }
        setCaptureConnectivityStatus("offline");
      }
    };

    const requestId = connectivityCheckSequenceRef.current + 1;
    connectivityCheckSequenceRef.current = requestId;

    if (!connectivityHasCheckedInitialRef.current) {
      connectivityHasCheckedInitialRef.current = true;
      void runCheck(requestId);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void runCheck(requestId);
    }, CONNECTIVITY_STATUS_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [captureConnectivityInputs, selectedInstance?.baseUrl]);

  const successHandlers = useMemo(
    () =>
      createEndpointExplorerSuccessHandlers({
        setIf31DocsisBaseCapabilityResponse,
        setIf31DsOfdmChannelStatsResponse,
        setIf31DsOfdmProfileStatsResponse,
        setIf31SystemDiplexerResponse,
        setIf31UsOfdmaChannelStatsResponse,
        setFddSystemDiplexerConfigurationResponse,
        setFddDiplexerBandEdgeCapabilityResponse,
        setDsScqamCodewordErrorRateResponse,
        setDsScqamChannelStatsResponse,
        setAtdmaPreEqualizationResponse,
        setAtdmaChannelStatsResponse,
        setSystemUpTimeResponse,
        setInterfaceStatsResponse,
        setEventLogResponse,
        setRxMerResponse,
        setChannelEstResponse,
        setFecSummaryResponse,
        setConstellationResponse,
        setModulationProfileResponse,
        setUsOfdmaPreEqualizationResponse,
        setSpectrumFriendlyResponse,
        setSpectrumFullBandResponse,
        setSpectrumOfdmResponse,
        setSpectrumScqamResponse,
        setHistogramResponse,
      }),
    [],
  );

  const mutation = useMutation({
    mutationFn: ({
      endpointPath,
      payload,
    }: {
      endpointPath: string;
      payload:
        | DeviceConnectRequest
        | DsScqamCodewordErrorRateRequest
        | DeviceEventLogRequest
        | SingleRxMerCaptureRequest
        | SingleHistogramCaptureRequest
        | SingleFecSummaryCaptureRequest
        | SingleConstellationDisplayCaptureRequest
        | SingleModulationProfileCaptureRequest
        | SingleUsOfdmaPreEqualizationCaptureRequest
        | SingleSpectrumOfdmCaptureRequest
        | SingleSpectrumScqamCaptureRequest
        | SingleSpectrumFullBandCaptureRequest
        | SingleSpectrumFriendlyCaptureRequest;
    }) =>
      runSingleCaptureEndpoint<EndpointExplorerMutationResponse>(
        selectedInstance?.baseUrl ?? "",
        endpointPath,
        payload,
        selectedOperation?.requestTimeoutMs,
      ),
    onSuccess: (data) => {
      const operationId = selectedOperation?.id;
      if (!operationId) {
        return;
      }
      successHandlers[operationId]?.(data);
    },
  });

  if (!selectedOperation) {
    return (
      <Navigate
        to={isSingleCaptureRoute ? (singleCaptureNavigationItems[0]?.routePath ?? "/") : (operationNavigationItems[0]?.routePath ?? "/")}
        replace
      />
    );
  }

  const responses: EndpointExplorerResponses = {
    atdmaChannelStatsResponse,
    fddDiplexerBandEdgeCapabilityResponse,
    fddSystemDiplexerConfigurationResponse,
    if31DocsisBaseCapabilityResponse,
    if31DsOfdmChannelStatsResponse,
    if31DsOfdmProfileStatsResponse,
    if31UsOfdmaChannelStatsResponse,
    if31SystemDiplexerResponse,
    dsScqamCodewordErrorRateResponse,
    dsScqamChannelStatsResponse,
    atdmaPreEqualizationResponse,
    rxMerResponse,
    channelEstResponse,
    constellationResponse,
    eventLogResponse,
    fecSummaryResponse,
    histogramResponse,
    interfaceStatsResponse,
    modulationProfileResponse,
    usOfdmaPreEqualizationResponse,
    systemUpTimeResponse,
    spectrumFriendlyResponse,
    spectrumFullBandResponse,
    spectrumOfdmResponse,
    spectrumScqamResponse,
  };
  const selectedResponse = getEndpointExplorerSelectedResponse(selectedOperation.id, responses);
  const hasCompletedSelectedOperation = mutation.isSuccess && mutation.variables?.endpointPath === selectedOperation.endpointPath;
  const requestJsonAction = (
    <RequestJsonAction
      disabled={!hasCompletedSelectedOperation}
      onClick={() => {
        if (!hasCompletedSelectedOperation) {
          return;
        }
        downloadJson(buildJsonFilename(selectedOperation.label), selectedResponse);
      }}
    >
      Download JSON
    </RequestJsonAction>
  );
  const errorMessage = mutation.isError ? (mutation.error as Error).message : undefined;
  const requestForm = renderEndpointExplorerRequestForm({
    selectedOperation,
    isPending: mutation.isPending,
    canRun: canExecuteOperation,
    errorMessage,
    extraActions: requestJsonAction,
    onConnectivityInputsChange: setCaptureConnectivityInputs,
    onSubmit: (payload) => {
      mutation.mutate({ endpointPath: selectedOperation.endpointPath, payload });
    },
  });
  const resultsView = renderEndpointExplorerResultsView(selectedOperation.id, responses);

  return (
    <CaptureOperationShell
      isSingleCaptureRoute={isSingleCaptureRoute}
      isSpectrumAnalyzerRoute={isSpectrumAnalyzerRoute}
      selectedOperation={selectedOperation}
      captureInputsTitle={captureInputsTitle}
      requestForm={requestForm}
      isPending={mutation.isPending}
      resultsView={resultsView}
    />
  );
}
