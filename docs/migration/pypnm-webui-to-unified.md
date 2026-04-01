# Migration: PyPNM-WebUI to Unified WebUI

`PyPNM-CMTS-WebUI` is the unified runtime codebase for both modes:

- PW compatibility mode (`--with-pypnm-webui`)
- PCW mode (`--with-pypnm-cmts-webui`)

## What Changed

- `PyPNM-WebUI` no longer owns active frontend/runtime code.
- `install.sh` and `uninstall.sh` in this repo now delegate to the unified repo.
- Runtime updates and new features now land in `PyPNM-CMTS-WebUI`.

## Recommended Path

For new installations, clone and use the unified repository directly:

```bash
git clone https://github.com/PyPNMApps/PyPNM-CMTS-WebUI.git
cd PyPNM-CMTS-WebUI
./install.sh --with-pypnm-webui
```

For PCW mode:

```bash
./install.sh --with-pypnm-cmts-webui
```

## Compatibility Path

If your automation still starts from `PyPNM-WebUI`, wrapper install remains
available:

```bash
./install.sh --with-pypnm-webui
```

This command clones/updates `PyPNM-CMTS-WebUI` (default `../PyPNM-CMTS-WebUI`)
and delegates install execution to that repo.
