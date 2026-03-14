import { requestWithBaseUrl } from "@/services/http";
import type { ApiEnvelope, HealthOutput } from "@/types/api";

export async function getHealth(baseUrl: string, healthPath = "/health"): Promise<ApiEnvelope<HealthOutput>> {
  const response = await requestWithBaseUrl<ApiEnvelope<HealthOutput>>(baseUrl, {
    method: "GET",
    url: healthPath,
  });

  return response.data;
}
