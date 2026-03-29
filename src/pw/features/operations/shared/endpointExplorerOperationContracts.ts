import {
  defineOperationContract,
  type OperationContract,
  type OperationRequestFormKind,
} from "@/pw/features/operations/shared/operationContract";

const endpointExplorerOperationContracts: OperationContract[] = [
  defineOperationContract({
    id: "docs-if30-ds-scqam-chan-codeworderrorrate",
    requestFormKind: "scqam-codeword-error-rate",
  }),
  defineOperationContract({
    id: "docs-dev-eventlog",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "system-uptime",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "docs-pnm-interface-stats",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "docs-if30-us-atdma-chan-stats",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "docs-if30-us-atdma-chan-preequalization",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "docs-if30-ds-scqam-chan-stats",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "docs-fdd-diplexer-bandedgecapability",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "docs-fdd-system-diplexer-configuration",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "docs-if31-us-ofdma-channel-stats",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "docs-if31-system-diplexer",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "docs-if31-ds-ofdm-profile-stats",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "docs-if31-ds-ofdm-chan-stats",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "docs-if31-docsis-basecapability",
    requestFormKind: "device-connect",
  }),
  defineOperationContract({
    id: "docs-pnm-ds-histogram-getcapture",
    requestFormKind: "histogram-capture",
  }),
  defineOperationContract({
    id: "docs-pnm-ds-spectrumanalyzer-getcapture-friendly",
    requestFormKind: "spectrum-friendly-capture",
  }),
  defineOperationContract({
    id: "docs-pnm-ds-spectrumanalyzer-getcapture-fullbandcapture",
    requestFormKind: "spectrum-full-band-capture",
  }),
  defineOperationContract({
    id: "docs-pnm-ds-spectrumanalyzer-getcapture-ofdm",
    requestFormKind: "spectrum-ofdm-capture",
  }),
  defineOperationContract({
    id: "docs-pnm-ds-spectrumanalyzer-getcapture-scqam",
    requestFormKind: "spectrum-ofdm-capture",
  }),
  defineOperationContract({
    id: "docs-pnm-ds-ofdm-constellationdisplay-getcapture",
    requestFormKind: "constellation-display-capture",
  }),
  defineOperationContract({
    id: "docs-pnm-ds-ofdm-fecsummary-getcapture",
    requestFormKind: "fec-summary-capture",
  }),
];

const requestKindByOperationId = new Map(endpointExplorerOperationContracts.map((contract) => [contract.id, contract.requestFormKind]));

export function getEndpointExplorerRequestFormKind(operationId: string): OperationRequestFormKind {
  return requestKindByOperationId.get(operationId) ?? "single-capture";
}
