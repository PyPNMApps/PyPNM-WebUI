# Single Capture

The `Single Capture` tab is the dedicated one-shot PNM capture area.

## Current Workflows

- `RxMER`
- `Channel Estimation`
- `Histogram`
- `FEC Summary`
- `Constellation Display`
- `Modulation Profile`
- `OFDMA PreEqualization`

## Shared Behavior

Each `Single Capture` page includes:

- request form
- `Capture Inputs` online/offline chip driven by `/system/sysDescr`
- immediate status check on page load, then a 3 second debounce after MAC, IP,
  or SNMP community changes
- execution button stays disabled until the modem reports `Online`
- `Download JSON` stays inside the `Capture Inputs` card and remains disabled
  until the current operation completes successfully
- visible waiting indicator while data is being collected
- rendered visual below the form
- browser autocomplete enabled for `MAC Address`, `IP Address`, and
  `SNMP RW Community`
- `SNMP RW Community` masked by default with an eye toggle inside the field

## Chart Range Selection And Zoom

Where line-chart visuals are available, selection-based chart controls are
available in the chart header:

- drag a region to select the frequency range
- select `Zoom` to focus on that region
- select `Reset Zoom` to return to the full range

Current single-capture views with range-zoom controls:

- `Spectrum Analyzer` (Friendly, Full-Band, OFDM, SCQAM)
- `RxMER`
- `Channel Estimation`
- `OFDMA PreEqualization`
