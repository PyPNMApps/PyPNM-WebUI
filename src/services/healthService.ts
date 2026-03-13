import { http } from "@/services/http";
import type { ApiEnvelope, HealthOutput } from "@/types/api";

export async function getHealth(): Promise<ApiEnvelope<HealthOutput>> {
  const response = await http.get<ApiEnvelope<HealthOutput>>("/health");
  return response.data;
}
