import { http } from "@/services/http";
import type { EndpointDescriptor } from "@/types/api";

export async function listEndpoints(): Promise<EndpointDescriptor[]> {
  const response = await http.get<EndpointDescriptor[]>("/docs/endpoints");
  return response.data;
}
