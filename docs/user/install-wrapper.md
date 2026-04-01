# Install Wrapper Usage

`install.sh` in this repository delegates directly to the unified
`PyPNM-CMTS-WebUI` installer.

## Profiles

- `--with-pypnm-webui`: unified install in PW compatibility profile
- `--with-pypnm-cmts-webui`: unified install in PCW profile

If no profile flag is provided, wrapper install defaults to
`--with-pypnm-webui`.

## Basic Examples

```bash
./install.sh --with-pypnm-webui
./install.sh --with-pypnm-cmts-webui
```

Use an existing unified checkout:

```bash
./install.sh --pcw-dir ../PyPNM-CMTS-WebUI --with-pypnm-webui
```

Pin a branch/tag/SHA in the unified repo:

```bash
./install.sh --pcw-ref main --with-pypnm-webui
```

Forward extra unified install flags after `--`:

```bash
./install.sh --with-pypnm-webui -- --with-pypnm-docsis
```

## Uninstall

Wrapper uninstall delegates to unified uninstall:

```bash
./uninstall.sh --confirm-uninstall
```

Use a non-default unified checkout path:

```bash
./uninstall.sh --pcw-dir ../PyPNM-CMTS-WebUI --confirm-uninstall
```
