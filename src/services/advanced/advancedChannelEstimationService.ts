import { requestWithBaseUrl } from "@/services/http";
import type {
  AdvancedMultiChanEstAnalysisRequest,
  AdvancedMultiChanEstAnalysisResponse,
  AdvancedMultiChanEstRequest,
  AdvancedMultiChanEstStartResponse,
  AdvancedMultiChanEstStatusResponse,
} from "@/types/api";

const ADVANCED_CHANNEL_ESTIMATION_BASE = "/advance/multi/ds/channelEstimation";

export async function startAdvancedChannelEstimation(baseUrl: string, payload: AdvancedMultiChanEstRequest): Promise<AdvancedMultiChanEstStartResponse> {
  const response = await requestWithBaseUrl<AdvancedMultiChanEstStartResponse>(baseUrl, {
    method: "POST",
    url: `${ADVANCED_CHANNEL_ESTIMATION_BASE}/start`,
    data: payload,
    timeout: 120000,
  });
  return response.data;
}

export async function getAdvancedChannelEstimationStatus(baseUrl: string, operationId: string): Promise<AdvancedMultiChanEstStatusResponse> {
  const response = await requestWithBaseUrl<AdvancedMultiChanEstStatusResponse>(baseUrl, {
    method: "GET",
    url: `${ADVANCED_CHANNEL_ESTIMATION_BASE}/status/${operationId}`,
    timeout: 30000,
  });
  return response.data;
}

export async function stopAdvancedChannelEstimation(baseUrl: string, operationId: string): Promise<AdvancedMultiChanEstStatusResponse> {
  const response = await requestWithBaseUrl<AdvancedMultiChanEstStatusResponse>(baseUrl, {
    method: "DELETE",
    url: `${ADVANCED_CHANNEL_ESTIMATION_BASE}/stop/${operationId}`,
    timeout: 30000,
  });
  return response.data;
}

export async function analyzeAdvancedChannelEstimation(baseUrl: string, payload: AdvancedMultiChanEstAnalysisRequest): Promise<AdvancedMultiChanEstAnalysisResponse> {
  const response = await requestWithBaseUrl<AdvancedMultiChanEstAnalysisResponse>(baseUrl, {
    method: "POST",
    url: `${ADVANCED_CHANNEL_ESTIMATION_BASE}/analysis`,
    data: payload,
    timeout: 120000,
  });
  return response.data;
}

export function getAdvancedChannelEstimationResultsZipUrl(baseUrl: string, operationId: string): string {
  return new URL(`${ADVANCED_CHANNEL_ESTIMATION_BASE}/results/${operationId}`, baseUrl).toString();
}
