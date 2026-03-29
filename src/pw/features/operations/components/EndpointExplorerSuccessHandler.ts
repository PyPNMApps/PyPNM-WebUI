import type {
  AtdmaChannelStatsResponse,
  AtdmaPreEqualizationResponse,
  DeviceEventLogResponse,
  DsScqamChannelStatsResponse,
  DsScqamCodewordErrorRateResponse,
  FddDiplexerBandEdgeCapabilityResponse,
  FddSystemDiplexerConfigurationResponse,
  If31DocsisBaseCapabilityResponse,
  If31DsOfdmChannelStatsResponse,
  If31DsOfdmProfileStatsResponse,
  If31SystemDiplexerResponse,
  If31UsOfdmaChannelStatsResponse,
  InterfaceStatsResponse,
  SingleChannelEstCoeffCaptureResponse,
  SingleConstellationDisplayCaptureResponse,
  SingleFecSummaryCaptureResponse,
  SingleHistogramCaptureResponse,
  SingleModulationProfileCaptureResponse,
  SingleRxMerCaptureResponse,
  SingleSpectrumFriendlyCaptureResponse,
  SingleSpectrumOfdmCaptureResponse,
  SingleSpectrumScqamCaptureResponse,
  SingleUsOfdmaPreEqualizationCaptureResponse,
  SystemUpTimeResponse,
} from "@/types/api";

export type EndpointExplorerMutationResponse =
  | AtdmaChannelStatsResponse
  | FddDiplexerBandEdgeCapabilityResponse
  | FddSystemDiplexerConfigurationResponse
  | If31DocsisBaseCapabilityResponse
  | If31DsOfdmChannelStatsResponse
  | If31DsOfdmProfileStatsResponse
  | If31UsOfdmaChannelStatsResponse
  | If31SystemDiplexerResponse
  | DsScqamCodewordErrorRateResponse
  | DsScqamChannelStatsResponse
  | AtdmaPreEqualizationResponse
  | DeviceEventLogResponse
  | SystemUpTimeResponse
  | InterfaceStatsResponse
  | SingleRxMerCaptureResponse
  | SingleChannelEstCoeffCaptureResponse
  | SingleHistogramCaptureResponse
  | SingleFecSummaryCaptureResponse
  | SingleConstellationDisplayCaptureResponse
  | SingleModulationProfileCaptureResponse
  | SingleUsOfdmaPreEqualizationCaptureResponse
  | SingleSpectrumOfdmCaptureResponse
  | SingleSpectrumScqamCaptureResponse
  | SingleSpectrumFriendlyCaptureResponse;

interface EndpointExplorerSuccessSetters {
  setIf31DocsisBaseCapabilityResponse: (data: If31DocsisBaseCapabilityResponse | null) => void;
  setIf31DsOfdmChannelStatsResponse: (data: If31DsOfdmChannelStatsResponse | null) => void;
  setIf31DsOfdmProfileStatsResponse: (data: If31DsOfdmProfileStatsResponse | null) => void;
  setIf31SystemDiplexerResponse: (data: If31SystemDiplexerResponse | null) => void;
  setIf31UsOfdmaChannelStatsResponse: (data: If31UsOfdmaChannelStatsResponse | null) => void;
  setFddSystemDiplexerConfigurationResponse: (data: FddSystemDiplexerConfigurationResponse | null) => void;
  setFddDiplexerBandEdgeCapabilityResponse: (data: FddDiplexerBandEdgeCapabilityResponse | null) => void;
  setDsScqamCodewordErrorRateResponse: (data: DsScqamCodewordErrorRateResponse | null) => void;
  setDsScqamChannelStatsResponse: (data: DsScqamChannelStatsResponse | null) => void;
  setAtdmaPreEqualizationResponse: (data: AtdmaPreEqualizationResponse | null) => void;
  setAtdmaChannelStatsResponse: (data: AtdmaChannelStatsResponse | null) => void;
  setSystemUpTimeResponse: (data: SystemUpTimeResponse | null) => void;
  setInterfaceStatsResponse: (data: InterfaceStatsResponse | null) => void;
  setEventLogResponse: (data: DeviceEventLogResponse | null) => void;
  setRxMerResponse: (data: SingleRxMerCaptureResponse | null) => void;
  setChannelEstResponse: (data: SingleChannelEstCoeffCaptureResponse | null) => void;
  setFecSummaryResponse: (data: SingleFecSummaryCaptureResponse | null) => void;
  setConstellationResponse: (data: SingleConstellationDisplayCaptureResponse | null) => void;
  setModulationProfileResponse: (data: SingleModulationProfileCaptureResponse | null) => void;
  setUsOfdmaPreEqualizationResponse: (data: SingleUsOfdmaPreEqualizationCaptureResponse | null) => void;
  setSpectrumFriendlyResponse: (data: SingleSpectrumFriendlyCaptureResponse | null) => void;
  setSpectrumFullBandResponse: (data: SingleSpectrumFriendlyCaptureResponse | null) => void;
  setSpectrumOfdmResponse: (data: SingleSpectrumOfdmCaptureResponse | null) => void;
  setSpectrumScqamResponse: (data: SingleSpectrumScqamCaptureResponse | null) => void;
  setHistogramResponse: (data: SingleHistogramCaptureResponse | null) => void;
}

type SuccessHandlerMap = Record<string, (data: EndpointExplorerMutationResponse) => void>;

export function createEndpointExplorerSuccessHandlers(setters: EndpointExplorerSuccessSetters): SuccessHandlerMap {
  return {
    "docs-if31-docsis-basecapability": (data) => setters.setIf31DocsisBaseCapabilityResponse(data as If31DocsisBaseCapabilityResponse),
    "docs-if31-ds-ofdm-chan-stats": (data) => setters.setIf31DsOfdmChannelStatsResponse(data as If31DsOfdmChannelStatsResponse),
    "docs-if31-ds-ofdm-profile-stats": (data) => setters.setIf31DsOfdmProfileStatsResponse(data as If31DsOfdmProfileStatsResponse),
    "docs-if31-system-diplexer": (data) => setters.setIf31SystemDiplexerResponse(data as If31SystemDiplexerResponse),
    "docs-if31-us-ofdma-channel-stats": (data) => setters.setIf31UsOfdmaChannelStatsResponse(data as If31UsOfdmaChannelStatsResponse),
    "docs-fdd-system-diplexer-configuration": (data) => setters.setFddSystemDiplexerConfigurationResponse(data as FddSystemDiplexerConfigurationResponse),
    "docs-fdd-diplexer-bandedgecapability": (data) => setters.setFddDiplexerBandEdgeCapabilityResponse(data as FddDiplexerBandEdgeCapabilityResponse),
    "docs-if30-ds-scqam-chan-codeworderrorrate": (data) => setters.setDsScqamCodewordErrorRateResponse(data as DsScqamCodewordErrorRateResponse),
    "docs-if30-ds-scqam-chan-stats": (data) => setters.setDsScqamChannelStatsResponse(data as DsScqamChannelStatsResponse),
    "docs-if30-us-atdma-chan-preequalization": (data) => setters.setAtdmaPreEqualizationResponse(data as AtdmaPreEqualizationResponse),
    "docs-if30-us-atdma-chan-stats": (data) => setters.setAtdmaChannelStatsResponse(data as AtdmaChannelStatsResponse),
    "system-uptime": (data) => setters.setSystemUpTimeResponse(data as SystemUpTimeResponse),
    "docs-pnm-interface-stats": (data) => setters.setInterfaceStatsResponse(data as InterfaceStatsResponse),
    "docs-dev-eventlog": (data) => setters.setEventLogResponse(data as DeviceEventLogResponse),
    "docs-pnm-ds-ofdm-rxmer-getcapture": (data) => setters.setRxMerResponse(data as SingleRxMerCaptureResponse),
    "docs-pnm-ds-ofdm-channelestcoeff-getcapture": (data) => setters.setChannelEstResponse(data as SingleChannelEstCoeffCaptureResponse),
    "docs-pnm-ds-ofdm-fecsummary-getcapture": (data) => setters.setFecSummaryResponse(data as SingleFecSummaryCaptureResponse),
    "docs-pnm-ds-ofdm-constellationdisplay-getcapture": (data) => setters.setConstellationResponse(data as SingleConstellationDisplayCaptureResponse),
    "docs-pnm-ds-ofdm-modulationprofile-getcapture": (data) => setters.setModulationProfileResponse(data as SingleModulationProfileCaptureResponse),
    "docs-pnm-us-ofdma-preequalization-getcapture": (data) => setters.setUsOfdmaPreEqualizationResponse(data as SingleUsOfdmaPreEqualizationCaptureResponse),
    "docs-pnm-ds-spectrumanalyzer-getcapture-friendly": (data) => setters.setSpectrumFriendlyResponse(data as SingleSpectrumFriendlyCaptureResponse),
    "docs-pnm-ds-spectrumanalyzer-getcapture-fullbandcapture": (data) => setters.setSpectrumFullBandResponse(data as SingleSpectrumFriendlyCaptureResponse),
    "docs-pnm-ds-spectrumanalyzer-getcapture-ofdm": (data) => setters.setSpectrumOfdmResponse(data as SingleSpectrumOfdmCaptureResponse),
    "docs-pnm-ds-spectrumanalyzer-getcapture-scqam": (data) => setters.setSpectrumScqamResponse(data as SingleSpectrumScqamCaptureResponse),
    "docs-pnm-ds-histogram-getcapture": (data) => setters.setHistogramResponse(data as SingleHistogramCaptureResponse),
  };
}
