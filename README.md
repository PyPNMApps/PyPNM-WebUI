# PyPNM-WebUI (Wrapper Repository)

This repository is now a lightweight wrapper for the unified UI:

- Unified repo: [PyPNM-CMTS-WebUI](https://github.com/PyPNMApps/PyPNM-CMTS-WebUI)
- PW compatibility profile: `--with-pypnm-webui`
- PCW profile: `--with-pypnm-cmts-webui`

PyPNM-WebUI frontend runtime code is no longer maintained here.  
This repo intentionally keeps only documentation and install/uninstall entrypoints.

## Install

PW compatibility profile (default):

```bash
./install.sh --with-pypnm-webui
```

PCW profile:

```bash
./install.sh --with-pypnm-cmts-webui
```

With extra downstream unified install args:

```bash
./install.sh --with-pypnm-webui -- --with-pypnm-docsis
```

## Uninstall

Delegates to unified repo uninstall:

```bash
./uninstall.sh --confirm-uninstall
```

## Migration Notes

- New installs should use `PyPNM-CMTS-WebUI` directly.
- This wrapper remains for compatibility and guided migration.
- See docs: [docs/migration/pypnm-webui-to-unified.md](docs/migration/pypnm-webui-to-unified.md)

## Release Helper

Release can still be started from this repo and is delegated to unified:

```bash
python3 ./tools/release/release.py
```
