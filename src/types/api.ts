export type ApiStatus = "ok" | "error" | "warning" | "unknown";

export interface ApiEnvelope<T> {
  status?: ApiStatus | string;
  message?: string;
  timestamp?: string;
  output?: T;
}

export interface HealthOutput {
  service?: string;
  version?: string;
  uptime_seconds?: number;
}

export interface EndpointDescriptor {
  path: string;
  method: string;
  summary?: string;
  operation_id?: string;
  tags?: string[];
}

export interface PnmFileMacAddressEntry {
  mac_address: string;
  system_description?: Record<string, string | number | boolean | null> | null;
}

export interface PnmFileMacAddressResponse {
  mac_addresses: PnmFileMacAddressEntry[];
}

export interface PnmFileEntry {
  transaction_id: string;
  filename: string;
  pnm_test_type: string;
  timestamp: number;
  system_description?: Record<string, string | number | boolean | null> | null;
}

export interface PnmFileQueryResponse {
  files: Record<string, PnmFileEntry[]>;
}

export interface PnmFileUploadResponse {
  mac_address: string;
  filename: string;
  transaction_id: string;
}

export interface PnmFileHexdumpResponse {
  transaction_id: string;
  bytes_per_line: number;
  lines: string[];
}

export interface PnmFileAnalysisResponse {
  mac_address?: string;
  pnm_file_type: string;
  status: string;
  analysis: Record<string, unknown>;
}

export interface GenericMeasurementRequest {
  mac_address?: string;
  ip_address?: string;
  service_group?: string;
  operation?: {
    pnm_capture_operation_id?: string;
  };
  response?: {
    output?: {
      request_summary?: string;
    };
  };
}

export interface SingleRxMerCaptureRequest {
  cable_modem: {
    mac_address: string;
    ip_address: string;
    pnm_parameters: {
      tftp: {
        ipv4: string;
        ipv6: string;
      };
      capture: {
        channel_ids: number[];
      };
    };
    snmp: {
      snmpV2C: {
        community: string;
      };
    };
  };
  analysis: {
    type: "basic";
    output: {
      type: "json";
    };
    plot: {
      ui: {
        theme: "dark";
      };
    };
  };
}

export interface SingleFecSummaryCaptureRequest {
  cable_modem: {
    mac_address: string;
    ip_address: string;
    pnm_parameters: {
      tftp: {
        ipv4: string;
        ipv6: string;
      };
      capture: {
        channel_ids: number[];
      };
    };
    snmp: {
      snmpV2C: {
        community: string;
      };
    };
  };
  analysis: {
    type: "basic";
    output: {
      type: "json";
    };
    plot: {
      ui: {
        theme: "dark";
      };
    };
  };
  capture_settings: {
    fec_summary_type: number;
  };
}

export interface SingleConstellationDisplayCaptureRequest {
  cable_modem: {
    mac_address: string;
    ip_address: string;
    pnm_parameters: {
      tftp: {
        ipv4: string;
        ipv6: string;
      };
      capture: {
        channel_ids: number[];
      };
    };
    snmp: {
      snmpV2C: {
        community: string;
      };
    };
  };
  analysis: {
    type: "basic";
    output: {
      type: "json";
    };
    plot: {
      ui: {
        theme: "dark";
      };
      options: {
        display_cross_hair: boolean;
      };
    };
  };
  capture_settings: {
    modulation_order_offset: number;
    number_sample_symbol: number;
  };
}

export type SingleModulationProfileCaptureRequest = SingleRxMerCaptureRequest;

export interface SingleHistogramCaptureRequest {
  cable_modem: {
    mac_address: string;
    ip_address: string;
    pnm_parameters: {
      tftp: {
        ipv4: string;
        ipv6: string;
      };
    };
    snmp: {
      snmpV2C: {
        community: string;
      };
    };
  };
  analysis: {
    type: "basic";
    output: {
      type: "json";
    };
    plot: {
      ui: {
        theme: "dark";
      };
    };
  };
  capture_settings: {
    sample_duration: number;
  };
}

export interface DeviceConnectRequest {
  cable_modem: {
    mac_address: string;
    ip_address: string;
    snmp: {
      snmpV2C: {
        community: string;
      };
    };
  };
}

export type DeviceEventLogRequest = DeviceConnectRequest;

export interface DsScqamCodewordErrorRateRequest extends DeviceConnectRequest {
  capture_parameters: {
    sample_time_elapsed: number;
  };
}

export interface SingleRxMerSystemDescription {
  HW_REV?: string;
  VENDOR?: string;
  BOOTR?: string;
  SW_REV?: string;
  MODEL?: string;
}

export interface DeviceEventLogEntry {
  docsDevEvFirstTime?: string;
  docsDevEvLastTime?: string;
  docsDevEvCounts?: number | string;
  docsDevEvLevel?: number | string;
  docsDevEvId?: number | string;
  docsDevEvText?: string;
}

export interface DeviceEventLogResponse {
  mac_address?: string;
  status?: number | string;
  message?: string | null;
  system_description?: SingleRxMerSystemDescription;
  device?: {
    mac_address?: string;
    system_description?: SingleRxMerSystemDescription;
  };
  logs?: DeviceEventLogEntry[];
}

export interface SystemUpTimeResponse {
  mac_address?: string;
  status?: number | string;
  message?: string | null;
  device?: {
    mac_address?: string;
    system_description?: SingleRxMerSystemDescription;
  };
  system_description?: SingleRxMerSystemDescription;
  results?: {
    uptime?: string;
  };
}

export interface InterfaceStatsIfEntry {
  ifIndex?: number | string;
  ifDescr?: string;
  ifType?: number | string;
  ifSpeed?: number | string;
  ifAdminStatus?: number | string;
  ifOperStatus?: number | string;
  ifInOctets?: number | string;
  ifOutOctets?: number | string;
}

export interface InterfaceStatsIfXEntry {
  ifName?: string;
  ifHighSpeed?: number | string;
  ifHCInOctets?: number | string;
  ifHCOutOctets?: number | string;
}

export interface InterfaceStatsBridgeIfIndexEntry {
  ifName?: string;
  ifDescription?: string;
}

export interface InterfaceStatsGroupEntry {
  ifEntry?: InterfaceStatsIfEntry;
  ifXEntry?: InterfaceStatsIfXEntry;
}

export interface InterfaceStatsBridgeEntry {
  ifIndexes?: Record<string, InterfaceStatsBridgeIfIndexEntry>;
}

export interface InterfaceStatsResults {
  bridge?: InterfaceStatsBridgeEntry;
  ethernetCsmacd?: InterfaceStatsGroupEntry[];
  docsCableMaclayer?: InterfaceStatsGroupEntry[];
  docsCableDownstream?: InterfaceStatsGroupEntry[];
  docsOfdmDownstream?: InterfaceStatsGroupEntry[];
  docsCableUpstream?: InterfaceStatsGroupEntry[];
  docsOfdmaUpstream?: InterfaceStatsGroupEntry[];
  [key: string]: InterfaceStatsBridgeEntry | InterfaceStatsGroupEntry[] | undefined;
}

export interface InterfaceStatsResponse {
  mac_address?: string;
  status?: number | string;
  message?: string | null;
  device?: {
    mac_address?: string;
    system_description?: SingleRxMerSystemDescription;
  };
  system_description?: SingleRxMerSystemDescription;
  results?: InterfaceStatsResults;
}

export interface AtdmaDwrWindowCheck {
  dwr_warning_db?: number;
  dwr_violation_db?: number;
  spread_db?: number;
  channel_count?: number;
  min_power_dbmv?: number;
  max_power_dbmv?: number;
  is_warning?: boolean;
  is_violation?: boolean;
  extreme_channel_ids?: number[];
}

export interface AtdmaUpstreamChannelEntryData {
  docsIfUpChannelId?: number | string;
  docsIfUpChannelFrequency?: number;
  docsIfUpChannelWidth?: number;
  docsIf3CmStatusUsTxPower?: number;
  docsIf3CmStatusUsIsMuted?: boolean;
  docsIfUpChannelPreEqEnable?: boolean;
  docsIfUpChannelStatus?: number | string;
  docsIf3CmStatusUsT3Timeouts?: number | string;
  docsIf3CmStatusUsT4Timeouts?: number | string;
  docsIf3CmStatusUsT3Exceededs?: number | string;
  docsIf3CmStatusUsRangingAborteds?: number | string;
  docsIf3CmStatusUsModulationType?: number | string;
  docsIfUpChannelSlotSize?: number | string;
  docsIfUpChannelTxTimingOffset?: number | string;
  docsIf3CmStatusUsRangingStatus?: number | string;
  docsIfUpChannelType?: number | string;
}

export interface AtdmaUpstreamChannelEntry {
  index?: number | string;
  channel_id?: number | string;
  entry?: AtdmaUpstreamChannelEntryData;
}

export interface AtdmaChannelStatsResults {
  entries?: AtdmaUpstreamChannelEntry[];
  dwr_window_check?: AtdmaDwrWindowCheck | null;
}

export interface AtdmaChannelStatsResponse {
  mac_address?: string;
  status?: number | string;
  message?: string | null;
  device?: {
    mac_address?: string;
    system_description?: SingleRxMerSystemDescription;
  };
  system_description?: SingleRxMerSystemDescription;
  results?: AtdmaChannelStatsResults;
}

export interface AtdmaPreEqTap {
  real?: number;
  imag?: number;
  magnitude?: number;
  magnitude_power_dB?: number | null;
  real_hex?: string;
  imag_hex?: string;
  delay_us?: number;
  tap_offset?: number;
  is_main_tap?: boolean;
  delay_samples?: number;
  cable_length_m?: number;
  cable_length_ft?: number;
}

export interface AtdmaPreEqFrequencyResponse {
  fft_size?: number;
  frequency_bins?: number[];
  magnitude_power_db_normalized?: number[];
}

export interface AtdmaPreEqMetrics {
  main_tap_ratio?: number;
  non_main_tap_energy_ratio?: number;
  pre_post_energy_symmetry_ratio?: number;
  pre_main_tap_total_energy_ratio?: number;
  post_main_tap_total_energy_ratio?: number;
  frequency_response?: AtdmaPreEqFrequencyResponse;
}

export interface AtdmaPreEqGroupDelay {
  fft_size?: number;
  delay_us?: number[];
}

export interface AtdmaPreEqTapDelaySummary {
  main_echo_post_tap_index?: number | null;
  taps?: AtdmaPreEqTap[];
}

export interface AtdmaPreEqRecord {
  main_tap_location?: number;
  taps_per_symbol?: number;
  num_taps?: number;
  header_hex?: string;
  taps?: AtdmaPreEqTap[];
  metrics?: AtdmaPreEqMetrics | null;
  group_delay?: AtdmaPreEqGroupDelay | null;
  tap_delay_summary?: AtdmaPreEqTapDelaySummary | null;
  velocity_factor?: number;
}

export interface AtdmaPreEqualizationResponse {
  mac_address?: string;
  status?: number | string;
  message?: string | null;
  device?: {
    mac_address?: string;
    system_description?: SingleRxMerSystemDescription;
  };
  system_description?: SingleRxMerSystemDescription;
  results?: Record<string, AtdmaPreEqRecord>;
}

export interface DsScqamChannelEntryData {
  docsIfDownChannelId?: number;
  docsIfDownChannelFrequency?: number;
  docsIfDownChannelWidth?: number;
  docsIfDownChannelModulation?: string;
  docsIfDownChannelInterleave?: string;
  docsIfDownChannelPower?: number;
  docsIfSigQUnerroreds?: number;
  docsIfSigQCorrecteds?: number;
  docsIfSigQUncorrectables?: number;
  docsIfSigQMicroreflections?: number;
  docsIfSigQExtUnerroreds?: number;
  docsIfSigQExtCorrecteds?: number;
  docsIfSigQExtUncorrectables?: number;
  docsIf3SignalQualityExtRxMER?: number;
}

export interface DsScqamChannelEntry {
  index?: number;
  channel_id?: number;
  entry?: DsScqamChannelEntryData;
}

export interface DsScqamChannelStatsResponse {
  mac_address?: string;
  status?: number | string;
  message?: string | null;
  device?: {
    mac_address?: string;
    system_description?: SingleRxMerSystemDescription;
  };
  system_description?: SingleRxMerSystemDescription;
  results?: DsScqamChannelEntry[];
}

export interface DsScqamCodewordTotals {
  total_codewords?: number;
  total_errors?: number;
  time_elapsed?: number;
  error_rate?: number;
  codewords_per_second?: number;
  errors_per_second?: number;
}

export interface DsScqamCodewordErrorRateEntry {
  index?: number;
  channel_id?: number;
  codeword_totals?: DsScqamCodewordTotals;
}

export interface DsScqamCodewordErrorRateResponse {
  mac_address?: string;
  status?: number | string;
  message?: string | null;
  device?: {
    mac_address?: string;
    system_description?: SingleRxMerSystemDescription;
  };
  system_description?: SingleRxMerSystemDescription;
  results?: DsScqamCodewordErrorRateEntry[];
}

export interface FddDiplexerBandEdgeCapabilityEntryData {
  docsFddDiplexerUsUpperBandEdgeCapability?: number;
  docsFddDiplexerDsLowerBandEdgeCapability?: number;
  docsFddDiplexerDsUpperBandEdgeCapability?: number;
}

export interface FddDiplexerBandEdgeCapabilityEntry {
  index?: number;
  entry?: FddDiplexerBandEdgeCapabilityEntryData;
}

export interface FddDiplexerBandEdgeCapabilityResponse {
  mac_address?: string;
  status?: number | string;
  message?: string | null;
  device?: {
    mac_address?: string;
    system_description?: SingleRxMerSystemDescription;
  };
  system_description?: SingleRxMerSystemDescription;
  results?: FddDiplexerBandEdgeCapabilityEntry[];
}

export interface FddSystemDiplexerConfigurationEntryData {
  docsFddCmFddSystemCfgStateDiplexerDsLowerBandEdgeCfg?: number;
  docsFddCmFddSystemCfgStateDiplexerDsUpperBandEdgeCfg?: number;
  docsFddCmFddSystemCfgStateDiplexerUsUpperBandEdgeCfg?: number;
}

export interface FddSystemDiplexerConfigurationEntry {
  index?: number;
  entry?: FddSystemDiplexerConfigurationEntryData;
}

export interface FddSystemDiplexerConfigurationResponse {
  mac_address?: string;
  status?: number | string;
  message?: string | null;
  device?: {
    mac_address?: string;
    system_description?: SingleRxMerSystemDescription;
  };
  system_description?: SingleRxMerSystemDescription;
  results?: FddSystemDiplexerConfigurationEntry;
}

export interface If31UsOfdmaChannelEntryData {
  docsIf31CmUsOfdmaChanChannelId?: number;
  docsIf31CmUsOfdmaChanConfigChangeCt?: number;
  docsIf31CmUsOfdmaChanSubcarrierZeroFreq?: number;
  docsIf31CmUsOfdmaChanFirstActiveSubcarrierNum?: number;
  docsIf31CmUsOfdmaChanLastActiveSubcarrierNum?: number;
  docsIf31CmUsOfdmaChanNumActiveSubcarriers?: number;
  docsIf31CmUsOfdmaChanSubcarrierSpacing?: number;
  docsIf31CmUsOfdmaChanCyclicPrefix?: number;
  docsIf31CmUsOfdmaChanRollOffPeriod?: number;
  docsIf31CmUsOfdmaChanNumSymbolsPerFrame?: number;
  docsIf31CmUsOfdmaChanTxPower?: number;
  docsIf31CmUsOfdmaChanPreEqEnabled?: boolean;
  docsIf31CmStatusOfdmaUsT3Timeouts?: number;
  docsIf31CmStatusOfdmaUsT4Timeouts?: number;
  docsIf31CmStatusOfdmaUsRangingAborteds?: number;
  docsIf31CmStatusOfdmaUsT3Exceededs?: number;
  docsIf31CmStatusOfdmaUsIsMuted?: boolean;
  docsIf31CmStatusOfdmaUsRangingStatus?: number | string;
}

export interface If31UsOfdmaChannelEntry {
  index?: number;
  channel_id?: number;
  entry?: If31UsOfdmaChannelEntryData;
}

export interface If31UsOfdmaChannelStatsResponse {
  mac_address?: string;
  status?: number | string;
  message?: string | null;
  device?: {
    mac_address?: string;
    system_description?: SingleRxMerSystemDescription;
  };
  system_description?: SingleRxMerSystemDescription;
  results?: If31UsOfdmaChannelEntry[];
}

export interface If31DsOfdmProfileStat {
  docsIf31CmDsOfdmProfileStatsConfigChangeCt?: number;
  docsIf31CmDsOfdmProfileStatsTotalCodewords?: number;
  docsIf31CmDsOfdmProfileStatsCorrectedCodewords?: number;
  docsIf31CmDsOfdmProfileStatsUncorrectableCodewords?: number;
  docsIf31CmDsOfdmProfileStatsInOctets?: number;
  docsIf31CmDsOfdmProfileStatsInUnicastOctets?: number;
  docsIf31CmDsOfdmProfileStatsInMulticastOctets?: number;
  docsIf31CmDsOfdmProfileStatsInFrames?: number;
  docsIf31CmDsOfdmProfileStatsInUnicastFrames?: number;
  docsIf31CmDsOfdmProfileStatsInMulticastFrames?: number;
  docsIf31CmDsOfdmProfileStatsInFrameCrcFailures?: number;
  docsIf31CmDsOfdmProfileStatsCtrDiscontinuityTime?: number;
}

export interface If31DsOfdmProfileStatsChannel {
  index?: number;
  channel_id?: number;
  profiles?: Record<string, If31DsOfdmProfileStat>;
}

export interface If31DsOfdmProfileStatsResponse {
  mac_address?: string;
  status?: number | string;
  message?: string | null;
  device?: {
    mac_address?: string;
    system_description?: SingleRxMerSystemDescription;
  };
  system_description?: SingleRxMerSystemDescription;
  results?: If31DsOfdmProfileStatsChannel[];
}

export interface If31SystemDiplexer {
  diplexer_capability?: number;
  cfg_band_edge?: number;
  ds_lower_capability?: number;
  cfg_ds_lower_band_edge?: number;
  ds_upper_capability?: number;
  cfg_ds_upper_band_edge?: number;
}

export interface If31SystemDiplexerResponse {
  mac_address?: string;
  status?: number | string;
  message?: string | null;
  device?: {
    mac_address?: string;
    system_description?: SingleRxMerSystemDescription;
  };
  system_description?: SingleRxMerSystemDescription;
  results?: {
    diplexer?: If31SystemDiplexer;
  };
}

export interface SingleRxMerAnalysisEntry {
  mac_address?: string;
  channel_id?: number;
  subcarrier_spacing?: number;
  first_active_subcarrier_index?: number;
  subcarrier_zero_frequency?: number;
  carrier_values?: {
    carrier_count?: number;
    frequency?: number[];
    magnitude?: number[];
  };
  modulation_statistics?: {
    bits_per_symbol?: number[];
    supported_modulation_counts?: Record<string, number>;
  };
  regression?: {
    slope?: number[];
  };
  pnm_header?: {
    capture_time?: number;
  };
  device_details?: {
    system_description?: SingleRxMerSystemDescription;
  };
}

export interface SingleRxMerCaptureResponse {
  system_description?: SingleRxMerSystemDescription;
  mac_address?: string;
  status?: number;
  message?: string | null;
  data?: {
    analysis?: SingleRxMerAnalysisEntry[];
  };
}

export interface ChannelEstEchoEntry {
  time_s: number;
  amplitude: number;
  distance_m: number;
  distance_ft: number;
}

export interface SingleChannelEstCoeffAnalysisEntry {
  mac_address?: string;
  channel_id?: number;
  pnm_header?: {
    capture_time?: number;
  };
  device_details?: {
    system_description?: SingleRxMerSystemDescription;
  };
  echo?: {
    report?: {
      cable_type?: string;
      velocity_factor?: number | string;
      prop_speed_mps?: number;
      echoes?: ChannelEstEchoEntry[];
    };
  };
  signal_statistics?: {
    mean?: number;
    median?: number;
    std?: number;
    variance?: number;
    power?: number;
    peak_to_peak?: number;
    mean_abs_deviation?: number;
    skewness?: number;
    kurtosis?: number;
    crest_factor?: number;
  };
  carrier_values: {
    carrier_count?: number;
    frequency: number[];
    magnitudes: number[];
    group_delay?: {
      magnitude: number[];
    };
  };
}

export interface SingleChannelEstCoeffPrimitiveEntry {
  channel_id?: number;
  subcarrier_spacing?: number;
  occupied_channel_bandwidth?: number;
  values: Array<[number, number]>;
}

export interface SingleChannelEstCoeffMeasurementStatsEntry {
  index?: number;
  channel_id?: number;
  entry?: {
    docsPnmCmOfdmChEstCoefFileName?: string;
    docsPnmCmOfdmChEstCoefMeasStatus?: string;
    docsPnmCmOfdmChEstCoefAmpRipplePkToPk?: number;
    docsPnmCmOfdmChEstCoefAmpRippleRms?: number;
    docsPnmCmOfdmChEstCoefAmpSlope?: number;
    docsPnmCmOfdmChEstCoefAmpMean?: number;
    docsPnmCmOfdmChEstCoefGrpDelayRipplePkToPk?: number;
    docsPnmCmOfdmChEstCoefGrpDelayRippleRms?: number;
    docsPnmCmOfdmChEstCoefGrpDelaySlope?: number;
    docsPnmCmOfdmChEstCoefGrpDelayMean?: number;
  };
}

export interface SingleChannelEstCoeffCaptureResponse {
  system_description?: SingleRxMerSystemDescription;
  mac_address?: string;
  status?: number;
  message?: string | null;
  data?: {
    analysis?: SingleChannelEstCoeffAnalysisEntry[];
    primative?: SingleChannelEstCoeffPrimitiveEntry[];
    measurement_stats?: SingleChannelEstCoeffMeasurementStatsEntry[];
  };
}

export interface SingleHistogramAnalysisEntry {
  mac_address?: string;
  hit_counts?: number[];
  pnm_header?: {
    capture_time?: number | string;
  };
  device_details?: {
    system_description?: SingleRxMerSystemDescription;
  };
}

export interface SingleHistogramCaptureResponse {
  system_description?: SingleRxMerSystemDescription;
  mac_address?: string;
  status?: number;
  message?: string | null;
  data?: {
    analysis?: SingleHistogramAnalysisEntry[];
  };
}

export interface SingleFecSummaryCodewords {
  timestamps: number[];
  total_codewords: number[];
  corrected: number[];
  uncorrected: number[];
}

export interface SingleFecSummaryProfileEntry {
  profile: number | string;
  codewords: SingleFecSummaryCodewords;
}

export interface SingleFecSummaryAnalysisEntry {
  channel_id?: number;
  profiles: SingleFecSummaryProfileEntry[];
  device_details?: {
    system_description?: SingleRxMerSystemDescription;
  };
}

export interface SingleFecSummaryCaptureResponse {
  system_description?: SingleRxMerSystemDescription;
  mac_address?: string;
  status?: number;
  message?: string | null;
  data?: {
    analysis?: SingleFecSummaryAnalysisEntry[];
  };
}

export interface SingleConstellationDisplayAnalysisEntry {
  channel_id?: number;
  mac_address?: string;
  modulation_order?: number;
  num_sample_symbols?: number;
  pnm_header?: {
    capture_time?: number | string;
  };
  device_details?: {
    system_description?: SingleRxMerSystemDescription;
  };
  soft?: Array<[number, number]> | { complex?: Array<[number, number]> };
  hard?: Array<[number, number]> | { complex?: Array<[number, number]> };
}

export interface SingleConstellationDisplayCaptureResponse {
  system_description?: SingleRxMerSystemDescription;
  mac_address?: string;
  status?: number;
  message?: string | null;
  data?: {
    analysis?: SingleConstellationDisplayAnalysisEntry[];
  };
}

export interface SingleModulationProfileCarrierValues {
  frequency: number[];
  modulation?: string[];
  shannon_min_mer: number[];
}

export interface SingleModulationProfileProfileEntry {
  profile_id: number;
  carrier_values: SingleModulationProfileCarrierValues;
}

export interface SingleModulationProfileAnalysisEntry {
  channel_id?: number;
  mac_address?: string;
  pnm_header?: {
    capture_time?: number | string;
  };
  device_details?: {
    system_description?: SingleRxMerSystemDescription;
  };
  profiles: SingleModulationProfileProfileEntry[];
}

export interface SingleModulationProfileCaptureResponse {
  system_description?: SingleRxMerSystemDescription;
  mac_address?: string;
  status?: number;
  message?: string | null;
  data?: {
    analysis?: SingleModulationProfileAnalysisEntry[];
  };
}
