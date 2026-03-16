import { requestWithBaseUrl } from "@/services/http";
import type {
  DeviceConnectRequest,
  DsScqamCodewordErrorRateRequest,
  DeviceEventLogRequest,
  SingleConstellationDisplayCaptureRequest,
  SingleFecSummaryCaptureRequest,
  SingleHistogramCaptureRequest,
  SingleModulationProfileCaptureRequest,
  SingleRxMerCaptureRequest,
  SingleSpectrumFriendlyCaptureRequest,
} from "@/types/api";

export async function runSingleCaptureEndpoint<TResponse>(
  baseUrl: string,
  endpointPath: string,
  payload:
    | DeviceConnectRequest
    | DsScqamCodewordErrorRateRequest
    | DeviceEventLogRequest
    | SingleRxMerCaptureRequest
    | SingleHistogramCaptureRequest
    | SingleFecSummaryCaptureRequest
    | SingleConstellationDisplayCaptureRequest
    | SingleModulationProfileCaptureRequest
    | SingleSpectrumFriendlyCaptureRequest,
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
