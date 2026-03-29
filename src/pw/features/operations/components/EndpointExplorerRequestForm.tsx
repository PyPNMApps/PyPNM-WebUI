import type { ReactNode } from "react";

import { ConstellationDisplayCaptureRequestForm } from "@/pw/features/operations/ConstellationDisplayCaptureRequestForm";
import { DeviceConnectRequestForm } from "@/pw/features/operations/DeviceConnectRequestForm";
import { FecSummaryCaptureRequestForm } from "@/pw/features/operations/FecSummaryCaptureRequestForm";
import { HistogramCaptureRequestForm } from "@/pw/features/operations/HistogramCaptureRequestForm";
import { ScqamCodewordErrorRateRequestForm } from "@/pw/features/operations/ScqamCodewordErrorRateRequestForm";
import { SingleCaptureRequestForm } from "@/pw/features/operations/SingleCaptureRequestForm";
import { SpectrumFriendlyCaptureRequestForm } from "@/pw/features/operations/SpectrumFriendlyCaptureRequestForm";
import { SpectrumFullBandCaptureRequestForm } from "@/pw/features/operations/SpectrumFullBandCaptureRequestForm";
import { SpectrumOfdmCaptureRequestForm } from "@/pw/features/operations/SpectrumOfdmCaptureRequestForm";
import type { CaptureConnectivityInputs } from "@/pw/features/operations/captureConnectivity";
import type { OperationNavigationItem } from "@/pw/features/operations/operationsNavigation";
import { getEndpointExplorerRequestFormKind } from "@/pw/features/operations/shared/endpointExplorerOperationContracts";
import type {
  DeviceConnectRequest,
  DsScqamCodewordErrorRateRequest,
  SingleConstellationDisplayCaptureRequest,
  SingleFecSummaryCaptureRequest,
  SingleHistogramCaptureRequest,
  SingleRxMerCaptureRequest,
  SingleSpectrumFriendlyCaptureRequest,
  SingleSpectrumFullBandCaptureRequest,
  SingleSpectrumOfdmCaptureRequest,
  SingleSpectrumScqamCaptureRequest,
} from "@/types/api";

type EndpointExplorerPayload =
  | DeviceConnectRequest
  | DsScqamCodewordErrorRateRequest
  | SingleConstellationDisplayCaptureRequest
  | SingleFecSummaryCaptureRequest
  | SingleHistogramCaptureRequest
  | SingleRxMerCaptureRequest
  | SingleSpectrumFriendlyCaptureRequest
  | SingleSpectrumFullBandCaptureRequest
  | SingleSpectrumOfdmCaptureRequest
  | SingleSpectrumScqamCaptureRequest;

export interface EndpointExplorerRequestFormParams {
  selectedOperation: OperationNavigationItem;
  isPending: boolean;
  canRun: boolean;
  errorMessage: string | undefined;
  extraActions: ReactNode;
  onConnectivityInputsChange: (inputs: CaptureConnectivityInputs | null) => void;
  onSubmit: (payload: EndpointExplorerPayload) => void;
}

export function renderEndpointExplorerRequestForm({
  selectedOperation,
  isPending,
  canRun,
  errorMessage,
  extraActions,
  onConnectivityInputsChange,
  onSubmit,
}: EndpointExplorerRequestFormParams) {
  const requestFormKind = getEndpointExplorerRequestFormKind(selectedOperation.id);

  if (requestFormKind === "scqam-codeword-error-rate") {
    return (
      <ScqamCodewordErrorRateRequestForm
        isPending={isPending}
        canRun={canRun}
        submitLabel={`Run ${selectedOperation.label}`}
        errorMessage={errorMessage}
        onConnectivityInputsChange={onConnectivityInputsChange}
        onSubmit={onSubmit}
      />
    );
  }

  if (requestFormKind === "device-connect") {
    return (
      <DeviceConnectRequestForm
        isPending={isPending}
        canRun={canRun}
        submitLabel={`Run ${selectedOperation.label}`}
        errorMessage={errorMessage}
        onConnectivityInputsChange={onConnectivityInputsChange}
        onSubmit={onSubmit}
      />
    );
  }

  if (requestFormKind === "histogram-capture") {
    return (
      <HistogramCaptureRequestForm
        isPending={isPending}
        canRun={canRun}
        submitLabel="Get Capture"
        errorMessage={errorMessage}
        extraActions={extraActions}
        onConnectivityInputsChange={onConnectivityInputsChange}
        onSubmit={onSubmit}
      />
    );
  }

  if (requestFormKind === "spectrum-friendly-capture") {
    return (
      <SpectrumFriendlyCaptureRequestForm
        isPending={isPending}
        canRun={canRun}
        submitLabel="Get Capture"
        errorMessage={errorMessage}
        extraActions={extraActions}
        onConnectivityInputsChange={onConnectivityInputsChange}
        onSubmit={onSubmit}
      />
    );
  }

  if (requestFormKind === "spectrum-full-band-capture") {
    return (
      <SpectrumFullBandCaptureRequestForm
        isPending={isPending}
        canRun={canRun}
        submitLabel="Get Capture"
        errorMessage={errorMessage}
        extraActions={extraActions}
        onConnectivityInputsChange={onConnectivityInputsChange}
        onSubmit={onSubmit}
      />
    );
  }

  if (requestFormKind === "spectrum-ofdm-capture") {
    return (
      <SpectrumOfdmCaptureRequestForm
        isPending={isPending}
        canRun={canRun}
        submitLabel="Get Capture"
        errorMessage={errorMessage}
        extraActions={extraActions}
        onConnectivityInputsChange={onConnectivityInputsChange}
        onSubmit={onSubmit}
      />
    );
  }

  if (requestFormKind === "constellation-display-capture") {
    return (
      <ConstellationDisplayCaptureRequestForm
        isPending={isPending}
        canRun={canRun}
        submitLabel="Get Capture"
        errorMessage={errorMessage}
        extraActions={extraActions}
        onConnectivityInputsChange={onConnectivityInputsChange}
        onSubmit={onSubmit}
      />
    );
  }

  if (requestFormKind === "fec-summary-capture") {
    return (
      <FecSummaryCaptureRequestForm
        isPending={isPending}
        canRun={canRun}
        submitLabel="Get Capture"
        errorMessage={errorMessage}
        extraActions={extraActions}
        onConnectivityInputsChange={onConnectivityInputsChange}
        onSubmit={onSubmit}
      />
    );
  }

  return (
    <SingleCaptureRequestForm
      isPending={isPending}
      canRun={canRun}
      submitLabel="Get Capture"
      errorMessage={errorMessage}
      extraActions={extraActions}
      onConnectivityInputsChange={onConnectivityInputsChange}
      onSubmit={onSubmit}
    />
  );
}
