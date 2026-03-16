# Runtime Configuration

## Local Env File

Use:

- `.env`

Example values:

```env
VITE_PYPNM_API_BASE_URL=http://127.0.0.1:8080
VITE_REQUEST_TIMEOUT_MS=30000
```

## Instance Targets

Runtime instance targets for the dropdown live in:

- `public/config/pypnm-instances.yaml`
- `public/config/pypnm-instances.local.yaml`

Load order:

1. `public/config/pypnm-instances.local.yaml`
2. `public/config/pypnm-instances.yaml`

The `.local` file is the active machine-local override.
The non-local file is the version-controlled template.

## Config Menu

Use the interactive editor when you want to manage that file from the CLI:

```bash
pypnm-webui config-menu
```

What it edits:

- runtime instance entries
- `defaults.selected_instance`
- `defaults.logging.level`
- per-instance `request_defaults`

Behavior:

- the menu saves `public/config/pypnm-instances.local.yaml` after each edit
- if the file already exists and the content changes, the menu creates a
  timestamped `.bak` backup beside it before overwrite
- changes to `public/config/pypnm-instances.local.yaml` are not part of Vite hot reload
- after editing runtime config, reload the WebUI page so the updated YAML is read

Behavior:

- the UI starts on the instance named by `defaults.selected_instance`
- the selected instance overrides `VITE_PYPNM_API_BASE_URL`
- `VITE_PYPNM_API_BASE_URL` remains the fallback when the YAML file is missing
- use the `PyPNM Target` dropdown to switch between configured PyPNM instances at runtime

## Per-Agent Request Defaults

Each instance can carry its own request defaults. This is where you keep values
that differ by PyPNM agent, such as:

- cable modem MAC address
- cable modem IP address
- TFTP IPv4
- TFTP IPv6
- channel ids
- SNMP RW community

Those values live under each instance entry as `request_defaults`.

Example:

```yaml
defaults:
  logging:
    level: INFO

instances:
  - id: lab-local
    label: Lab Local
    base_url: http://127.0.0.1:8080
    request_defaults:
      cable_modem:
        mac_address: aa:bb:cc:dd:ee:ff
        ip_address: 192.168.100.10
      tftp:
        ipv4: 192.168.100.2
        ipv6: ::1
      capture:
        channel_ids: []
      snmp:
        rw_community: private
```

Notes:

- `channel_ids: []` means all channels
- the selected instance's `request_defaults` prefill the capture and device
  request forms in the UI
