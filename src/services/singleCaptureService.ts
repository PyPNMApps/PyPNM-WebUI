import { requestWithBaseUrl } from "@/services/http";
import type {
  DeviceConnectRequest,
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
    | DeviceConnectRequest
    | DeviceEventLogRequest
    | SingleRxMerCaptureRequest
    | SingleHistogramCaptureRequest
    | SingleFecSummaryCaptureRequest
    | SingleConstellationDisplayCaptureRequest
    | SingleModulationProfileCaptureRequest,
  timeoutMs?: number,
): Promise<TResponse> {
  const response = await requestWithBaseUrl<TResponse>(baseUrl, {
    method: "POST",
    timeout: timeoutMs,
    url: endpointPath,
    data: payload,
  });

  return response.data;
}
