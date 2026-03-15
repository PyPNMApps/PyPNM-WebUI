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
