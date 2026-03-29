import { describe, expect, it, vi } from "vitest";

import {
  createEndpointExplorerSuccessHandlers,
  type EndpointExplorerMutationResponse,
} from "@/pw/features/operations/components/EndpointExplorerSuccessHandler";

function createSetters() {
  return {
    setIf31DocsisBaseCapabilityResponse: vi.fn(),
    setIf31DsOfdmChannelStatsResponse: vi.fn(),
    setIf31DsOfdmProfileStatsResponse: vi.fn(),
    setIf31SystemDiplexerResponse: vi.fn(),
    setIf31UsOfdmaChannelStatsResponse: vi.fn(),
    setFddSystemDiplexerConfigurationResponse: vi.fn(),
    setFddDiplexerBandEdgeCapabilityResponse: vi.fn(),
    setDsScqamCodewordErrorRateResponse: vi.fn(),
    setDsScqamChannelStatsResponse: vi.fn(),
    setAtdmaPreEqualizationResponse: vi.fn(),
    setAtdmaChannelStatsResponse: vi.fn(),
    setSystemUpTimeResponse: vi.fn(),
    setInterfaceStatsResponse: vi.fn(),
    setEventLogResponse: vi.fn(),
    setRxMerResponse: vi.fn(),
    setChannelEstResponse: vi.fn(),
    setFecSummaryResponse: vi.fn(),
    setConstellationResponse: vi.fn(),
    setModulationProfileResponse: vi.fn(),
    setUsOfdmaPreEqualizationResponse: vi.fn(),
    setSpectrumFriendlyResponse: vi.fn(),
    setSpectrumFullBandResponse: vi.fn(),
    setSpectrumOfdmResponse: vi.fn(),
    setSpectrumScqamResponse: vi.fn(),
    setHistogramResponse: vi.fn(),
  };
}

describe("createEndpointExplorerSuccessHandlers", () => {
  it("dispatches known operation ids to their mapped setter", () => {
    const setters = createSetters();
    const handlers = createEndpointExplorerSuccessHandlers(setters);
    const payload = { marker: "ok" } as EndpointExplorerMutationResponse;

    handlers["docs-pnm-ds-ofdm-rxmer-getcapture"]?.(payload);
    handlers["docs-pnm-ds-histogram-getcapture"]?.(payload);

    expect(setters.setRxMerResponse).toHaveBeenCalledWith(payload);
    expect(setters.setHistogramResponse).toHaveBeenCalledWith(payload);
    expect(setters.setChannelEstResponse).not.toHaveBeenCalled();
  });

  it("does not create handlers for unknown ids", () => {
    const handlers = createEndpointExplorerSuccessHandlers(createSetters());
    expect(handlers["not-a-real-operation"]).toBeUndefined();
  });
});
