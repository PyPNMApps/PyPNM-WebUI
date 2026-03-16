import { useEffect } from "react";

export interface CaptureConnectivityInputs {
  macAddress: string;
  ipAddress: string;
  community: string;
}

export function normalizeCaptureConnectivityInputs(inputs: CaptureConnectivityInputs): CaptureConnectivityInputs {
  return {
    macAddress: inputs.macAddress.trim(),
    ipAddress: inputs.ipAddress.trim(),
    community: inputs.community.trim(),
  };
}

export function hasCompleteCaptureConnectivityInputs(inputs: CaptureConnectivityInputs | null): inputs is CaptureConnectivityInputs {
  return Boolean(inputs?.macAddress && inputs.ipAddress && inputs.community);
}

export function useReportCaptureConnectivityInputs(
  inputs: CaptureConnectivityInputs,
  onChange?: (inputs: CaptureConnectivityInputs) => void,
) {
  const { macAddress, ipAddress, community } = inputs;

  useEffect(() => {
    if (!onChange) {
      return;
    }
    onChange(
      normalizeCaptureConnectivityInputs({
        macAddress,
        ipAddress,
        community,
      }),
    );
  }, [community, ipAddress, macAddress, onChange]);
}
