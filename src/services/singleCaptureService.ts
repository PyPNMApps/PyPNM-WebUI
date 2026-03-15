import { requestWithBaseUrl } from "@/services/http";
import type {
  DeviceEventLogRequest,
  SingleConstellationDisplayCaptureRequest,
  SingleFecSummaryCaptureRequest,
  SingleHistogramCaptureRequest,
  SingleModulationProfileCaptureRequest,
  SingleRxMerCaptureRequest,
} from "@/types/api";

export async function runSingleCaptureEndpoint<TResponse>(
  baseUrl: string,
  endpointPath: string,
  payload:
    | DeviceEventLogRequest
    | SingleRxMerCaptureRequest
    | SingleHistogramCaptureRequest
    | SingleFecSummaryCaptureRequest
    | SingleConstellationDisplayCaptureRequest
    | SingleModulationProfileCaptureRequest,
): Promise<TResponse> {
  const response = await requestWithBaseUrl<TResponse>(baseUrl, {
    method: "POST",
    url: endpointPath,
    data: payload,
  });

  return response.data;
}
