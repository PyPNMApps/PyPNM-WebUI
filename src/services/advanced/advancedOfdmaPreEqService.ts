import { requestWithBaseUrl } from "@/services/http";
import type {
  AdvancedMultiUsOfdmaPreEqAnalysisRequest,
  AdvancedMultiUsOfdmaPreEqAnalysisResponse,
  AdvancedMultiUsOfdmaPreEqRequest,
  AdvancedMultiUsOfdmaPreEqStartResponse,
  AdvancedMultiUsOfdmaPreEqStatusResponse,
} from "@/types/api";

const ADVANCED_OFDMA_PRE_EQ_BASE = "/advance/multi/us/ofdmaPreEqualization";

export async function startAdvancedOfdmaPreEq(baseUrl: string, payload: AdvancedMultiUsOfdmaPreEqRequest): Promise<AdvancedMultiUsOfdmaPreEqStartResponse> {
  const response = await requestWithBaseUrl<AdvancedMultiUsOfdmaPreEqStartResponse>(baseUrl, {
    method: "POST",
    url: `${ADVANCED_OFDMA_PRE_EQ_BASE}/start`,
    data: payload,
    timeout: 120000,
  });
  return response.data;
}

export async function getAdvancedOfdmaPreEqStatus(baseUrl: string, operationId: string): Promise<AdvancedMultiUsOfdmaPreEqStatusResponse> {
  const response = await requestWithBaseUrl<AdvancedMultiUsOfdmaPreEqStatusResponse>(baseUrl, {
    method: "GET",
    url: `${ADVANCED_OFDMA_PRE_EQ_BASE}/status/${operationId}`,
    timeout: 30000,
  });
  return response.data;
}

export async function stopAdvancedOfdmaPreEq(baseUrl: string, operationId: string): Promise<AdvancedMultiUsOfdmaPreEqStatusResponse> {
  const response = await requestWithBaseUrl<AdvancedMultiUsOfdmaPreEqStatusResponse>(baseUrl, {
    method: "DELETE",
    url: `${ADVANCED_OFDMA_PRE_EQ_BASE}/stop/${operationId}`,
    timeout: 30000,
  });
  return response.data;
}

export async function analyzeAdvancedOfdmaPreEq(baseUrl: string, payload: AdvancedMultiUsOfdmaPreEqAnalysisRequest): Promise<AdvancedMultiUsOfdmaPreEqAnalysisResponse> {
  const response = await requestWithBaseUrl<AdvancedMultiUsOfdmaPreEqAnalysisResponse>(baseUrl, {
    method: "POST",
    url: `${ADVANCED_OFDMA_PRE_EQ_BASE}/analysis`,
    data: payload,
    timeout: 300000,
  });
  return response.data;
}

export function getAdvancedOfdmaPreEqResultsZipUrl(baseUrl: string, operationId: string): string {
  return new URL(`${ADVANCED_OFDMA_PRE_EQ_BASE}/results/${operationId}`, baseUrl).toString();
}
