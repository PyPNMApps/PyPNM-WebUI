export interface OperationNavigationItem {
  id: string;
  label: string;
  routePath: string;
  endpointPath: string;
  description: string;
  menuPath: [string, string];
}

// Edit this file to add top-row operation navigation entries.
export const operationNavigationItems: OperationNavigationItem[] = [
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
];

export function getOperationByRoutePath(routePath: string | undefined): OperationNavigationItem | undefined {
  return operationNavigationItems.find((item) => item.routePath === routePath);
}
