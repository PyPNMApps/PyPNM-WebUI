export type OperationRequestFormKind =
  | "single-capture"
  | "scqam-codeword-error-rate"
  | "device-connect"
  | "histogram-capture"
  | "spectrum-friendly-capture"
  | "spectrum-full-band-capture"
  | "spectrum-ofdm-capture"
  | "constellation-display-capture"
  | "fec-summary-capture";

export interface OperationContract {
  id: string;
  requestFormKind: OperationRequestFormKind;
}

export function defineOperationContract(contract: OperationContract): OperationContract {
  return contract;
}
