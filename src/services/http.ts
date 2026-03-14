import axios from "axios";

import { env } from "@/lib/env";

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.requestTimeoutMs,
});

export function requestWithBaseUrl<T>(baseURL: string, config: Parameters<typeof http.request<T>>[0]) {
  return http.request<T>({
    ...config,
    baseURL,
  });
}

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message ?? error?.message ?? "Request failed";
    return Promise.reject(new Error(String(message)));
  },
);
