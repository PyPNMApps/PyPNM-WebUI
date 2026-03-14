import { requestWithBaseUrl } from "@/services/http";
import type {
  SingleConstellationDisplayCaptureRequest,
  SingleFecSummaryCaptureRequest,
  SingleHistogramCaptureRequest,
  SingleRxMerCaptureRequest,
} from "@/types/api";

export async function runSingleCaptureEndpoint<TResponse>(
  baseUrl: string,
  endpointPath: string,
  payload:
    | SingleRxMerCaptureRequest
    | SingleHistogramCaptureRequest
    | SingleFecSummaryCaptureRequest
    | SingleConstellationDisplayCaptureRequest,
): Promise<TResponse> {
  const response = await requestWithBaseUrl<TResponse>(baseUrl, {
    method: "POST",
    url: endpointPath,
    data: payload,
  });

  return response.data;
}
