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

## RxMER Selection Insights Math

`Single Capture -> RxMER` includes a `Selection Insights` popup for both
`All Channels` and per-channel charts.

For a selected frequency interval, the popup computes:

- average MER
- estimated bitload (bits/symbol)
- error-free QAM from the minimum MER in the selection
- MER distribution histogram

Let `M` be the set of selected MER samples (in dB):

\\[
M = \{ m_1, m_2, \ldots, m_N \}
\\]

Average MER:

\\[
\overline{m} = \frac{1}{N}\sum_{i=1}^{N} m_i
\\]

Minimum MER (used for conservative QAM recommendation):

\\[
m_{min} = \min(M)
\\]

Estimated bitload (Shannon-style estimate):

\\[
\mathrm{SNR}_{lin} = 10^{\overline{m}/10}
\\]

\\[
b_{est} = \log_2(1 + \mathrm{SNR}_{lin})
\\]

The UI clamps this estimate to a practical display range:

\\[
b_{display} = \min(12, \max(0, b_{est}))
\\]

Error-free QAM is inferred from `m_min` using fixed thresholds:

- `QAM-4096` if `m_min >= 45 dB`
- `QAM-2048` if `m_min >= 42 dB`
- `QAM-1024` if `m_min >= 39 dB`
- `QAM-512` if `m_min >= 36 dB`
- `QAM-256` if `m_min >= 33 dB`
- `Below QAM-256` otherwise

MER distribution histogram:

- values in `M` are binned across the selected MER span
- each bin count is plotted as `Carrier Count`
- x-axis labels show RxMER bin centers in dB
