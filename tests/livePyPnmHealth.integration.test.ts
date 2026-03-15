import { describe, expect, it } from "vitest";

import { getHealth } from "@/services/healthService";
import type { ApiEnvelope, HealthOutput } from "@/types/api";

const liveBaseUrl = process.env.PYPNM_LIVE_BASE_URL ?? "http://127.0.0.1:8000";
const liveHealthPath = process.env.PYPNM_LIVE_HEALTH_PATH ?? "/health";
const runLiveHealthCheck = process.env.RUN_LIVE_PYPNM_HEALTH === "1";

const liveDescribe = runLiveHealthCheck ? describe : describe.skip;

liveDescribe("live PyPNM health integration", () => {
  it("connects to a live PyPNM instance through the WebUI health service", async () => {
    const response = await getHealth(liveBaseUrl, liveHealthPath);
    const liveResponse = response as ApiEnvelope<HealthOutput> & { version?: string };

    expect(response.status).toBe("ok");
    expect(typeof (liveResponse.version ?? response.output?.version)).toBe("string");
  });
});
