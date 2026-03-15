export interface OperationNavigationItem {
  id: string;
  label: string;
  routePath: string;
  endpointPath: string;
  description: string;
  menuPath: [string, string];
  requestTimeoutMs?: number;
}

// Edit this file to add top-row operation navigation entries.
export const operationNavigationItems: OperationNavigationItem[] = [
  {
    id: "docs-if31-ds-ofdm-chan-stats",
    label: "OFDM Channel Stats",
    routePath: "/operations/ds-ofdm-channel-stats",
    endpointPath: "/docs/if31/ds/ofdm/chan/stats",
    description: "DOCSIS 3.1 downstream OFDM channel statistics visual.",
    menuPath: ["DOCSIS 3.1", "Downstream"],
    requestTimeoutMs: 90000,
  },
  {
    id: "docs-if31-ds-ofdm-profile-stats",
    label: "OFDM Profile Stats",
    routePath: "/operations/ds-ofdm-profile-stats",
    endpointPath: "/docs/if31/ds/ofdm/profile/stats",
    description: "DOCSIS 3.1 downstream OFDM profile statistics visual.",
    menuPath: ["DOCSIS 3.1", "Downstream"],
    requestTimeoutMs: 90000,
  },
  {
    id: "docs-if31-system-diplexer",
    label: "System Diplexer",
    routePath: "/operations/if31-system-diplexer",
    endpointPath: "/docs/if31/system/diplexer",
    description: "DOCSIS 3.1 system diplexer configuration visual.",
    menuPath: ["DOCSIS 3.1", "System"],
    requestTimeoutMs: 90000,
  },
  {
    id: "docs-if31-us-ofdma-channel-stats",
    label: "OFDMA Channel Stats",
    routePath: "/operations/us-ofdma-channel-stats",
    endpointPath: "/docs/if31/us/ofdma/channel/stats",
    description: "DOCSIS 3.1 upstream OFDMA channel statistics visual.",
    menuPath: ["DOCSIS 3.1", "Upstream"],
    requestTimeoutMs: 90000,
  },
  {
    id: "docs-fdd-diplexer-bandedgecapability",
    label: "Diplexer Band Edge Capability",
    routePath: "/operations/fdd-diplexer-band-edge-capability",
    endpointPath: "/docs/fdd/diplexer/bandEdgeCapability",
    description: "DOCSIS 4.0 FDD diplexer band edge capability visual.",
    menuPath: ["DOCSIS 4.0", "FDD"],
    requestTimeoutMs: 90000,
  },
  {
    id: "docs-fdd-system-diplexer-configuration",
    label: "System Diplexer Configuration",
    routePath: "/operations/fdd-system-diplexer-configuration",
    endpointPath: "/docs/fdd/system/diplexer/configuration",
    description: "DOCSIS 4.0 FDD active system diplexer configuration visual.",
    menuPath: ["DOCSIS 4.0", "FDD"],
    requestTimeoutMs: 90000,
  },
  {
    id: "docs-if30-ds-scqam-chan-codeworderrorrate",
    label: "SCQAM Codeword Error Rate",
    routePath: "/operations/ds-scqam-codeword-error-rate",
    endpointPath: "/docs/if30/ds/scqam/chan/codewordErrorRate",
    description: "DOCSIS 3.0 downstream SC-QAM codeword error rate visual.",
    menuPath: ["DOCSIS 3.0", "Downstream"],
    requestTimeoutMs: 90000,
  },
  {
    id: "docs-if30-ds-scqam-chan-stats",
    label: "SCQAM Channel Stats",
    routePath: "/operations/ds-scqam-channel-stats",
    endpointPath: "/docs/if30/ds/scqam/chan/stats",
    description: "DOCSIS 3.0 downstream SC-QAM channel statistics visual.",
    menuPath: ["DOCSIS 3.0", "Downstream"],
    requestTimeoutMs: 90000,
  },
  {
    id: "docs-if30-us-atdma-chan-preequalization",
    label: "ATDMA PreEqualization",
    routePath: "/operations/atdma-pre-equalization",
    endpointPath: "/docs/if30/us/atdma/chan/preEqualization",
    description: "DOCSIS 3.0 upstream ATDMA pre-equalization visual.",
    menuPath: ["DOCSIS 3.0", "Upstream"],
    requestTimeoutMs: 90000,
  },
  {
    id: "docs-if30-us-atdma-chan-stats",
    label: "ATDMA Channel Stats",
    routePath: "/operations/atdma-channel-stats",
    endpointPath: "/docs/if30/us/atdma/chan/stats",
    description: "DOCSIS 3.0 upstream ATDMA channel statistics visual.",
    menuPath: ["DOCSIS 3.0", "Upstream"],
    requestTimeoutMs: 90000,
  },
  {
    id: "docs-dev-eventlog",
    label: "Event Log",
    routePath: "/operations/event-log",
    endpointPath: "/docs/dev/eventLog",
    description: "Device event log visual.",
    menuPath: ["Device", "Logs"],
  },
  {
    id: "docs-pnm-interface-stats",
    label: "Interface Stats",
    routePath: "/operations/interface-stats",
    endpointPath: "/docs/pnm/interface/stats",
    description: "DOCSIS interface statistics visual.",
    menuPath: ["Device", "Interface"],
    requestTimeoutMs: 90000,
  },
  {
    id: "system-uptime",
    label: "UpTime",
    routePath: "/operations/up-time",
    endpointPath: "/system/upTime",
    description: "Device system uptime visual.",
    menuPath: ["Device", "System"],
  },
  {
    id: "docs-pnm-ds-ofdm-rxmer-getcapture",
    label: "RxMER",
    routePath: "/operations/rxmer",
    endpointPath: "/docs/pnm/ds/ofdm/rxMer/getCapture",
    description: "Single downstream OFDM RxMER capture visual.",
    menuPath: ["PNM", "Single Capture"],
  },
  {
    id: "docs-pnm-ds-ofdm-channelestcoeff-getcapture",
    label: "Channel Est Coeff",
    routePath: "/operations/channel-est-coeff",
    endpointPath: "/docs/pnm/ds/ofdm/channelEstCoeff/getCapture",
    description: "Single downstream OFDM channel estimation coefficient capture visual.",
    menuPath: ["PNM", "Single Capture"],
  },
  {
    id: "docs-pnm-ds-histogram-getcapture",
    label: "Histogram",
    routePath: "/operations/histogram",
    endpointPath: "/docs/pnm/ds/histogram/getCapture",
    description: "Single downstream histogram capture visual.",
    menuPath: ["PNM", "Single Capture"],
  },
  {
    id: "docs-pnm-ds-ofdm-fecsummary-getcapture",
    label: "FEC Summary",
    routePath: "/operations/fec-summary",
    endpointPath: "/docs/pnm/ds/ofdm/fecSummary/getCapture",
    description: "Single downstream OFDM FEC summary capture visual.",
    menuPath: ["PNM", "Single Capture"],
  },
  {
    id: "docs-pnm-ds-ofdm-constellationdisplay-getcapture",
    label: "Constellation Display",
    routePath: "/operations/constellation-display",
    endpointPath: "/docs/pnm/ds/ofdm/constellationDisplay/getCapture",
    description: "Single downstream OFDM constellation display visual.",
    menuPath: ["PNM", "Single Capture"],
  },
  {
    id: "docs-pnm-ds-ofdm-modulationprofile-getcapture",
    label: "Modulation Profile",
    routePath: "/operations/modulation-profile",
    endpointPath: "/docs/pnm/ds/ofdm/modulationProfile/getCapture",
    description: "Single downstream OFDM modulation profile visual.",
    menuPath: ["PNM", "Single Capture"],
  },
];

export function getOperationByRoutePath(routePath: string | undefined): OperationNavigationItem | undefined {
  return operationNavigationItems.find((item) => item.routePath === routePath);
}
