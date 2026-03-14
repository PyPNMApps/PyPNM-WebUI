import { Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useInstanceConfig } from "@/app/useInstanceConfig";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { SingleCaptureRequestForm } from "@/features/operations/SingleCaptureRequestForm";
import { SingleChannelEstCoeffCaptureView } from "@/features/operations/SingleChannelEstCoeffCaptureView";
import { getOperationByRoutePath, operationNavigationItems } from "@/features/operations/operationsNavigation";
import { SingleRxMerCaptureView } from "@/features/operations/SingleRxMerCaptureView";
import { singleChannelEstCoeffFixture } from "@/features/operations/singleChannelEstCoeffFixture";
import { singleRxMerFixture } from "@/features/operations/singleRxMerFixture";
import { runSingleCaptureEndpoint } from "@/services/singleCaptureService";
import type { SingleChannelEstCoeffCaptureResponse, SingleRxMerCaptureRequest, SingleRxMerCaptureResponse } from "@/types/api";

export function EndpointExplorerPage() {
  const location = useLocation();
  const { selectedInstance } = useInstanceConfig();
  const [rxMerResponse, setRxMerResponse] = useState<SingleRxMerCaptureResponse>(singleRxMerFixture);
  const [channelEstResponse, setChannelEstResponse] = useState<SingleChannelEstCoeffCaptureResponse>(singleChannelEstCoeffFixture);
  const selectedOperation = getOperationByRoutePath(location.pathname);
  const mutation = useMutation({
    mutationFn: ({ endpointPath, payload }: { endpointPath: string; payload: SingleRxMerCaptureRequest }) =>
      runSingleCaptureEndpoint<SingleRxMerCaptureResponse | SingleChannelEstCoeffCaptureResponse>(
        selectedInstance?.baseUrl ?? "",
        endpointPath,
        payload,
      ),
    onSuccess: (data) => {
      if (selectedOperation?.id === "docs-pnm-ds-ofdm-rxmer-getcapture") {
        setRxMerResponse(data as SingleRxMerCaptureResponse);
        return;
      }

      if (selectedOperation?.id === "docs-pnm-ds-ofdm-channelestcoeff-getcapture") {
        setChannelEstResponse(data as SingleChannelEstCoeffCaptureResponse);
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
        <SingleCaptureRequestForm
          isPending={mutation.isPending}
          canRun={Boolean(selectedInstance)}
          submitLabel={`Run ${selectedOperation.label}`}
          errorMessage={mutation.isError ? (mutation.error as Error).message : undefined}
          onSubmit={(payload) => {
            mutation.mutate({ endpointPath: selectedOperation.endpointPath, payload });
          }}
        />
      </Panel>

      <Panel>
        {selectedOperation.id === "docs-pnm-ds-ofdm-rxmer-getcapture" ? (
          <SingleRxMerCaptureView response={rxMerResponse} />
        ) : (
          <SingleChannelEstCoeffCaptureView response={channelEstResponse} />
        )}
      </Panel>
    </>
  );
}
