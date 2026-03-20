# Using The UI

## Navigation

The top navigation includes:
- `Settings`
- `Operations`
- `Spectrum Analyzer`
- `Single Capture`
- `Advanced`
- `Files`
- `Health`
- `About`

The `Health` page includes per-agent `Reload` buttons and a `Reload All Web
Services` action. These send `GET /pypnm/system/webService/reload` to one or
all configured agents and then refresh the health table.

Single-capture and advanced capture execution buttons stay disabled until the
request panel reports the cable modem as `Online`.

When execution is blocked, the action button remains grayed out and does not
show a click-style pointer on hover. This is intentional and indicates that the
current MAC, IP, and SNMP RW community have not yet passed the online check.

The top bar also includes the `PyPNM Agent` dropdown sourced from:

- `public/config/pypnm-instances.yaml`
- `public/config/pypnm-instances.local.yaml`

Use it to switch the active backend instance without rebuilding the UI.

Important:

- edits to the runtime YAML config files are not part of Vite hot reload
- after changing that file, reload the browser page so the updated runtime config
  is loaded

## Single Capture

The `Single Capture` tab is the dedicated one-shot PNM capture area.

Current workflows:

- `RxMER`
- `Channel Est Coeff`
- `Histogram`
- `FEC Summary`
- `Constellation Display`
- `Modulation Profile`
- `OFDMA PreEqualization`

Each Single Capture page includes:

- request form
- `Capture Inputs` online/offline chip driven by `/system/sysDescr`
- immediate status check on page load, then a 3 second debounce after MAC, IP, or SNMP community changes
- execution button stays disabled until the modem reports `Online`
- visible waiting indicator while data is being collected
- right-aligned `Download JSON` action for the current response
- bound visual below the form

## Operations Menu

The `Operations` entry opens the endpoint navigation menu for non-single-capture operation areas.
Current implemented groups include:

- `Device`
- `DOCSIS 3.0`
- `DOCSIS 3.1`
- `DOCSIS 4.0`

Current `PNM` operations in the menu are:

- `Spectrum Analyzer`

All operation pages currently expose:

- request form
- `Capture Inputs` online/offline chip driven by `/system/sysDescr`
- immediate status check on page load, then a 3 second debounce after MAC, IP, or SNMP community changes
- execution button stays disabled until the modem reports `Online`
- visible waiting indicator while data is being collected
- right-aligned `Download JSON` action for the current response
- bound visual below the form

## Advanced

The `Advanced` tab is the long-running multi-capture workflow area.

Current workflows:

- `RxMER`
- `Channel Estimation`
- `OFDMA PreEq`

Each Advanced workbench includes:

- `Request`
  - start a multi-capture operation
  - `Start Capture` remains disabled until the modem reports `Online`
- `Run`
  - live status polling
  - collected count
  - time remaining
  - stop control while capture is active
- `Results`
  - operation and group identifiers
  - ZIP download for collected captures
- `Analysis`
  - run multiple analysis types against the same `operation_id`
  - no need to restart capture for a different analysis type

## Spectrum Analyzer

The `Spectrum Analyzer` tab is now a top-level workflow area separate from the
general `Operations` menu.

Current spectrum analyzer workflows:

- `Friendly`
- `Full Band`
- `OFDM`
- `SCQAM`

Spectrum Analyzer pages expose the same request-panel online gating and
execution behavior as other capture-driven pages.

Advanced RxMER analysis types:

- `Min / Avg / Max`
- `Heat Map`
- `Echo Detection 1`
- `OFDM Profile Performance 1`

Advanced Channel Estimation analysis types:

- `Min / Avg / Max`
- `Group Delay`
- `LTE Detection Phase Slope`
- `Echo Detection IFFT`

Advanced OFDMA PreEq analysis types:

- `Min / Avg / Max`
- `Group Delay`
- `Echo Detection IFFT`

Analysis export behavior:

- SVG-backed charts expose per-panel `PNG` and `CSV` actions
- table-backed analysis views expose per-panel `CSV` actions
- chart CSV exports are derived from the same plotted series shown in the UI
- table CSV exports are derived from the typed rows used to render the table
- RxMER heat-map analysis currently exposes `CSV` export for source values;
  PNG export is currently limited to SVG-backed charts

## Input Validation

Request forms now validate common network fields in the browser before submit.

Validated fields include:

- `MAC Address`
- `IP Address`
- `TFTP IPv4`
- `TFTP IPv6`

Rules:

- MAC address may use any common delimiter
- the MAC must still resolve to exactly 12 hex characters
- IP address accepts either IPv4 or IPv6 where that field allows it
- TFTP IPv4 requires valid IPv4 when present
- TFTP IPv6 requires valid IPv6 when present

## Files

The `Files` tab is the dedicated PyPNM file-manager surface.

Current behavior:

- browse registered MAC addresses with stored PNM files
- search file entries by MAC address
- download a stored file by transaction ID
- download by selected MAC archive, stored filename, or operation ID
- upload a raw PNM file into the PyPNM file ledger
- inspect a transaction with:
  - `Hexdump` in a dedicated browser tab
  - `JSON` inline on the Files page
  - `Analyze` in a dedicated browser tab

Supported file analysis visuals currently route by PNM file type into matching
capture visuals where available.

## Recommended workflow

1. `Health`
   - confirm API status and metadata for all configured agents.
2. `Single Capture` or `Operations`
   - choose the workflow area you want to run.
3. `PyPNM Agent`
   - switch to the correct configured backend instance for that operation.
4. request form
   - confirm the prefilled per-instance MAC, IP, TFTP, and SNMP defaults before running.

## Settings

`Settings` displays runtime client configuration, including:

- `.env` fallback base URL and timeout
- selected instance label and base URL
- configured instance count
- runtime health path from YAML config
- selected instance request defaults for MAC, IP, and SNMP RW community

## About

`About` displays:

- a brief product description
- the repository link
- the current loaded WebUI version
- the latest GitHub tag discovered from the remote repository

## Runtime Config Changes

If you use:

```bash
pypnm-webui config-menu
```

then reload the page after saving changes. The UI reads
the runtime YAML config at startup and does not hot-reload that file.
