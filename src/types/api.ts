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

export interface SingleRxMerSystemDescription {
  HW_REV?: string;
  VENDOR?: string;
  BOOTR?: string;
  SW_REV?: string;
  MODEL?: string;
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
