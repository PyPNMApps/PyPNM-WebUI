# Using The UI

## Navigation

The top navigation includes:
- `Settings`
- `Operations`
- `Advanced`
- `Files`
- `Health`
- `About`

The top bar also includes the `PyPNM Target` dropdown sourced from:

- `public/config/pypnm-instances.yaml`
- `public/config/pypnm-instances.local.yaml`

Use it to switch the active backend instance without rebuilding the UI.

Important:

- edits to the runtime YAML config files are not part of Vite hot reload
- after changing that file, reload the browser page so the updated runtime config
  is loaded

## Operations Menu

The `Operations` entry opens the endpoint navigation menu.
Current implemented groups include:

- `Device`
- `PNM`
- `DOCSIS 3.0`
- `DOCSIS 3.1`
- `DOCSIS 4.0`

Current `PNM -> Spectrum Analyzer` entries include:

- `Friendly`
- `Full Band`
- `OFDM`
- `SCQAM`

All operation pages currently expose:

- request form
- visible waiting indicator while data is being collected
- right-aligned `Download JSON` action for the current response
- bound visual below the form

## Advanced

The `Advanced` tab is the long-running multi-capture workflow area.

Current first slice:

- `RxMER`

The Advanced RxMER workbench is state-machine driven and includes:

- `Request`
  - start a multi-capture operation
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

Current Advanced RxMER analysis types:

- `Min / Avg / Max`
- `Heat Map`
- `Echo Detection 1`
- `OFDM Profile Performance 1`

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
2. `Operations`
   - choose the endpoint visual you want to run from the operations menu.
3. `PyPNM Target`
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
