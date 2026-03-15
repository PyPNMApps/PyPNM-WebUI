# Using The UI

## Navigation

The top navigation includes:
- `Settings`
- `Operations`
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
- `Operations`
- `PNM`

## Files

The `Files` tab is the dedicated PyPNM file-manager surface.

Current first slice:

- browse registered MAC addresses with stored PNM files
- search file entries by MAC address
- download a stored file by transaction ID
- download by selected MAC archive, stored filename, or operation ID
- upload a raw PNM file into the PyPNM file ledger
- inspect a transaction with hexdump or backend-triggered analysis

Later slices will add:
- analysis-specific visuals for supported uploaded PNM file types

## Recommended workflow

1. `Health`
   - confirm API status and metadata.
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

## Runtime Config Changes

If you use:

```bash
pypnm-webui config-menu
```

then reload the page after saving changes. The UI reads
the runtime YAML config at startup and does not hot-reload that file.
