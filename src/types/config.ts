export interface InstancePollingConfig {
  enabled: boolean;
  intervalMs: number;
}

export interface PypnmInstance {
  id: string;
  label: string;
  baseUrl: string;
  enabled: boolean;
  tags: string[];
  capabilities: string[];
  polling: InstancePollingConfig;
}

export interface PypnmInstanceDefaults {
  selectedInstance: string;
  pollIntervalMs: number;
  requestTimeoutMs: number;
  healthPath: string;
}

export interface PypnmInstanceConfig {
  version: number;
  defaults: PypnmInstanceDefaults;
  instances: PypnmInstance[];
}
