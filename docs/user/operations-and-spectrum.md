# Operations And Spectrum Analyzer

## Operations

The `Operations` entry opens the endpoint navigation menu for non-single-capture
operation areas.

Current implemented groups include:

- `Device`
- `DOCSIS 3.0`
- `DOCSIS 3.1`
- `DOCSIS 4.0`

## Spectrum Analyzer

The `Spectrum Analyzer` tab is a top-level workflow area separate from the
general `Operations` menu.

Current spectrum analyzer workflows:

- `Friendly`
- `Full Band`
- `OFDM`
- `SCQAM`

## Shared Capture Behavior

Operation and Spectrum Analyzer pages expose the same request-panel behavior as
other capture-driven pages:

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
