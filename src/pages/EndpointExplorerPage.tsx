import { Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useInstanceConfig } from "@/app/useInstanceConfig";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { ThinkingIndicator } from "@/components/common/ThinkingIndicator";
import { ConstellationDisplayCaptureRequestForm } from "@/features/operations/ConstellationDisplayCaptureRequestForm";
import { DeviceConnectRequestForm } from "@/features/operations/DeviceConnectRequestForm";
import { HistogramCaptureRequestForm } from "@/features/operations/HistogramCaptureRequestForm";
import { FecSummaryCaptureRequestForm } from "@/features/operations/FecSummaryCaptureRequestForm";
import { SingleCaptureRequestForm } from "@/features/operations/SingleCaptureRequestForm";
import { SingleAtdmaChannelStatsView } from "@/features/operations/SingleAtdmaChannelStatsView";
import { SingleChannelEstCoeffCaptureView } from "@/features/operations/SingleChannelEstCoeffCaptureView";
import { SingleConstellationDisplayCaptureView } from "@/features/operations/SingleConstellationDisplayCaptureView";
import { SingleDeviceEventLogView } from "@/features/operations/SingleDeviceEventLogView";
import { SingleFecSummaryCaptureView } from "@/features/operations/SingleFecSummaryCaptureView";
import { getOperationByRoutePath, operationNavigationItems } from "@/features/operations/operationsNavigation";
import { SingleHistogramCaptureView } from "@/features/operations/SingleHistogramCaptureView";
import { SingleInterfaceStatsView } from "@/features/operations/SingleInterfaceStatsView";
import { SingleModulationProfileCaptureView } from "@/features/operations/SingleModulationProfileCaptureView";
import { SingleRxMerCaptureView } from "@/features/operations/SingleRxMerCaptureView";
import { SingleSystemUpTimeView } from "@/features/operations/SingleSystemUpTimeView";
import { singleAtdmaChannelStatsFixture } from "@/features/operations/singleAtdmaChannelStatsFixture";
import { singleChannelEstCoeffFixture } from "@/features/operations/singleChannelEstCoeffFixture";
import { singleConstellationDisplayFixture } from "@/features/operations/singleConstellationDisplayFixture";
import { singleDeviceEventLogFixture } from "@/features/operations/singleDeviceEventLogFixture";
import { singleFecSummaryFixture } from "@/features/operations/singleFecSummaryFixture";
import { singleHistogramFixture } from "@/features/operations/singleHistogramFixture";
import { singleInterfaceStatsFixture } from "@/features/operations/singleInterfaceStatsFixture";
import { singleModulationProfileFixture } from "@/features/operations/singleModulationProfileFixture";
import { singleRxMerFixture } from "@/features/operations/singleRxMerFixture";
import { singleSystemUpTimeFixture } from "@/features/operations/singleSystemUpTimeFixture";
import { runSingleCaptureEndpoint } from "@/services/singleCaptureService";
import type {
  AtdmaChannelStatsResponse,
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
  SingleRxMerCaptureRequest,
  SingleRxMerCaptureResponse,
  SystemUpTimeResponse,
} from "@/types/api";

export function EndpointExplorerPage() {
  const location = useLocation();
  const { selectedInstance } = useInstanceConfig();
  const [atdmaChannelStatsResponse, setAtdmaChannelStatsResponse] = useState<AtdmaChannelStatsResponse>(singleAtdmaChannelStatsFixture);
  const [rxMerResponse, setRxMerResponse] = useState<SingleRxMerCaptureResponse>(singleRxMerFixture);
  const [channelEstResponse, setChannelEstResponse] = useState<SingleChannelEstCoeffCaptureResponse>(singleChannelEstCoeffFixture);
  const [constellationResponse, setConstellationResponse] = useState<SingleConstellationDisplayCaptureResponse>(singleConstellationDisplayFixture);
  const [eventLogResponse, setEventLogResponse] = useState<DeviceEventLogResponse>(singleDeviceEventLogFixture);
  const [fecSummaryResponse, setFecSummaryResponse] = useState<SingleFecSummaryCaptureResponse>(singleFecSummaryFixture);
  const [histogramResponse, setHistogramResponse] = useState<SingleHistogramCaptureResponse>(singleHistogramFixture);
  const [interfaceStatsResponse, setInterfaceStatsResponse] = useState<InterfaceStatsResponse>(singleInterfaceStatsFixture);
  const [modulationProfileResponse, setModulationProfileResponse] = useState<SingleModulationProfileCaptureResponse>(singleModulationProfileFixture);
  const [systemUpTimeResponse, setSystemUpTimeResponse] = useState<SystemUpTimeResponse>(singleSystemUpTimeFixture);
  const selectedOperation = getOperationByRoutePath(location.pathname);
  const mutation = useMutation({
    mutationFn: ({
      endpointPath,
      payload,
    }: {
      endpointPath: string;
      payload:
        | DeviceConnectRequest
        | DeviceEventLogRequest
        | SingleRxMerCaptureRequest
        | SingleHistogramCaptureRequest
        | SingleFecSummaryCaptureRequest
        | SingleConstellationDisplayCaptureRequest
        | SingleModulationProfileCaptureRequest;
    }) =>
      runSingleCaptureEndpoint<
        | AtdmaChannelStatsResponse
        | DeviceEventLogResponse
        | SystemUpTimeResponse
        | InterfaceStatsResponse
        | SingleRxMerCaptureResponse
        | SingleChannelEstCoeffCaptureResponse
        | SingleHistogramCaptureResponse
        | SingleFecSummaryCaptureResponse
        | SingleConstellationDisplayCaptureResponse
        | SingleModulationProfileCaptureResponse
      >(
        selectedInstance?.baseUrl ?? "",
        endpointPath,
        payload,
        selectedOperation?.requestTimeoutMs,
      ),
    onSuccess: (data) => {
      if (selectedOperation?.id === "docs-if30-us-atdma-chan-stats") {
        setAtdmaChannelStatsResponse(data as AtdmaChannelStatsResponse);
        return;
      }

      if (selectedOperation?.id === "system-uptime") {
        setSystemUpTimeResponse(data as SystemUpTimeResponse);
        return;
      }

      if (selectedOperation?.id === "docs-pnm-interface-stats") {
        setInterfaceStatsResponse(data as InterfaceStatsResponse);
        return;
      }

      if (selectedOperation?.id === "docs-dev-eventlog") {
        setEventLogResponse(data as DeviceEventLogResponse);
        return;
      }

      if (selectedOperation?.id === "docs-pnm-ds-ofdm-rxmer-getcapture") {
        setRxMerResponse(data as SingleRxMerCaptureResponse);
        return;
      }

      if (selectedOperation?.id === "docs-pnm-ds-ofdm-channelestcoeff-getcapture") {
        setChannelEstResponse(data as SingleChannelEstCoeffCaptureResponse);
        return;
      }

      if (selectedOperation?.id === "docs-pnm-ds-ofdm-fecsummary-getcapture") {
        setFecSummaryResponse(data as SingleFecSummaryCaptureResponse);
        return;
      }

      if (selectedOperation?.id === "docs-pnm-ds-ofdm-constellationdisplay-getcapture") {
        setConstellationResponse(data as SingleConstellationDisplayCaptureResponse);
        return;
      }

      if (selectedOperation?.id === "docs-pnm-ds-ofdm-modulationprofile-getcapture") {
        setModulationProfileResponse(data as SingleModulationProfileCaptureResponse);
        return;
      }

      if (selectedOperation?.id === "docs-pnm-ds-histogram-getcapture") {
        setHistogramResponse(data as SingleHistogramCaptureResponse);
      }
    },
  });

  if (!selectedOperation) {
    return <Navigate to={operationNavigationItems[0]?.routePath ?? "/"} replace />;
  }

  return (
    <>
      <PageHeader title={selectedOperation.label} subtitle="" />
      <Panel title="Capture Inputs">
        {selectedOperation.id === "docs-dev-eventlog" || selectedOperation.id === "system-uptime" || selectedOperation.id === "docs-pnm-interface-stats" || selectedOperation.id === "docs-if30-us-atdma-chan-stats" ? (
          <DeviceConnectRequestForm
            isPending={mutation.isPending}
            canRun={Boolean(selectedInstance)}
            submitLabel={`Run ${selectedOperation.label}`}
            errorMessage={mutation.isError ? (mutation.error as Error).message : undefined}
            onSubmit={(payload) => {
              mutation.mutate({ endpointPath: selectedOperation.endpointPath, payload });
            }}
          />
        ) : selectedOperation.id === "docs-pnm-ds-histogram-getcapture" ? (
          <HistogramCaptureRequestForm
            isPending={mutation.isPending}
            canRun={Boolean(selectedInstance)}
            submitLabel={`Run ${selectedOperation.label}`}
            errorMessage={mutation.isError ? (mutation.error as Error).message : undefined}
            onSubmit={(payload) => {
              mutation.mutate({ endpointPath: selectedOperation.endpointPath, payload });
            }}
          />
        ) : selectedOperation.id === "docs-pnm-ds-ofdm-constellationdisplay-getcapture" ? (
          <ConstellationDisplayCaptureRequestForm
            isPending={mutation.isPending}
            canRun={Boolean(selectedInstance)}
            submitLabel={`Run ${selectedOperation.label}`}
            errorMessage={mutation.isError ? (mutation.error as Error).message : undefined}
            onSubmit={(payload) => {
              mutation.mutate({ endpointPath: selectedOperation.endpointPath, payload });
            }}
          />
        ) : selectedOperation.id === "docs-pnm-ds-ofdm-fecsummary-getcapture" ? (
          <FecSummaryCaptureRequestForm
            isPending={mutation.isPending}
            canRun={Boolean(selectedInstance)}
            submitLabel={`Run ${selectedOperation.label}`}
            errorMessage={mutation.isError ? (mutation.error as Error).message : undefined}
            onSubmit={(payload) => {
              mutation.mutate({ endpointPath: selectedOperation.endpointPath, payload });
            }}
          />
        ) : (
          <SingleCaptureRequestForm
            isPending={mutation.isPending}
            canRun={Boolean(selectedInstance)}
            submitLabel={`Run ${selectedOperation.label}`}
            errorMessage={mutation.isError ? (mutation.error as Error).message : undefined}
            onSubmit={(payload) => {
              mutation.mutate({ endpointPath: selectedOperation.endpointPath, payload });
            }}
          />
        )}
      </Panel>

      {mutation.isPending ? (
        <Panel>
          <ThinkingIndicator label={`Collecting ${selectedOperation.label} data...`} />
        </Panel>
      ) : null}

      <Panel>
        {selectedOperation.id === "docs-if30-us-atdma-chan-stats" ? (
          <SingleAtdmaChannelStatsView response={atdmaChannelStatsResponse} />
        ) : selectedOperation.id === "system-uptime" ? (
          <SingleSystemUpTimeView response={systemUpTimeResponse} />
        ) : selectedOperation.id === "docs-pnm-interface-stats" ? (
          <SingleInterfaceStatsView response={interfaceStatsResponse} />
        ) : selectedOperation.id === "docs-dev-eventlog" ? (
          <SingleDeviceEventLogView response={eventLogResponse} />
        ) : selectedOperation.id === "docs-pnm-ds-ofdm-rxmer-getcapture" ? (
          <SingleRxMerCaptureView response={rxMerResponse} />
        ) : selectedOperation.id === "docs-pnm-ds-ofdm-modulationprofile-getcapture" ? (
          <SingleModulationProfileCaptureView response={modulationProfileResponse} />
        ) : selectedOperation.id === "docs-pnm-ds-ofdm-constellationdisplay-getcapture" ? (
          <SingleConstellationDisplayCaptureView response={constellationResponse} />
        ) : selectedOperation.id === "docs-pnm-ds-ofdm-fecsummary-getcapture" ? (
          <SingleFecSummaryCaptureView response={fecSummaryResponse} />
        ) : selectedOperation.id === "docs-pnm-ds-histogram-getcapture" ? (
          <SingleHistogramCaptureView response={histogramResponse} />
        ) : (
          <SingleChannelEstCoeffCaptureView response={channelEstResponse} />
        )}
      </Panel>
    </>
  );
}
