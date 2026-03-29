import { describe, expect, it } from "vitest";

import {
  getEndpointExplorerSelectedResponse,
  type EndpointExplorerResponses,
} from "@/pw/features/operations/components/EndpointExplorerResultsView";
import type {
  SingleChannelEstCoeffCaptureResponse,
  SingleRxMerCaptureResponse,
} from "@/types/api";

function buildResponses(): EndpointExplorerResponses {
  return {
    atdmaChannelStatsResponse: null,
    fddDiplexerBandEdgeCapabilityResponse: null,
    fddSystemDiplexerConfigurationResponse: null,
    if31DocsisBaseCapabilityResponse: null,
    if31DsOfdmChannelStatsResponse: null,
    if31DsOfdmProfileStatsResponse: null,
    if31UsOfdmaChannelStatsResponse: null,
    if31SystemDiplexerResponse: null,
    dsScqamCodewordErrorRateResponse: null,
    dsScqamChannelStatsResponse: null,
    atdmaPreEqualizationResponse: null,
    rxMerResponse: null,
    channelEstResponse: null,
    constellationResponse: null,
    eventLogResponse: null,
    fecSummaryResponse: null,
    histogramResponse: null,
    interfaceStatsResponse: null,
    modulationProfileResponse: null,
    usOfdmaPreEqualizationResponse: null,
    systemUpTimeResponse: null,
    spectrumFriendlyResponse: null,
    spectrumFullBandResponse: null,
    spectrumOfdmResponse: null,
    spectrumScqamResponse: null,
  };
}

describe("getEndpointExplorerSelectedResponse", () => {
  it("resolves a known operation to the mapped response", () => {
    const responses = buildResponses();
    const rxMer = { marker: "rxmer" } as unknown as SingleRxMerCaptureResponse;
    responses.rxMerResponse = rxMer;

    const selected = getEndpointExplorerSelectedResponse("docs-pnm-ds-ofdm-rxmer-getcapture", responses);
    expect(selected).toBe(rxMer);
  });

  it("falls back to channel estimation response for unknown operation ids", () => {
    const responses = buildResponses();
    const channelEst = { marker: "channel-est" } as unknown as SingleChannelEstCoeffCaptureResponse;
    responses.channelEstResponse = channelEst;

    const selected = getEndpointExplorerSelectedResponse("unknown-operation-id", responses);
    expect(selected).toBe(channelEst);
  });
});
