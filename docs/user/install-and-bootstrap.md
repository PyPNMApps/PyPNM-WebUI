# Install And Bootstrap

## Command

From the repo root:

```bash
./install.sh
```

Update an existing install to the latest tagged release:

```bash
./install.sh --update-webui
```

Update to a specific tag:

```bash
./install.sh --update-webui v0.1.6.0
```

## Platform support

Validated on:

- Ubuntu 22.04 LTS
- Ubuntu 24.04 LTS

Other modern Linux distributions may work but are not yet part of the formal
test matrix.

The installer currently knows how to bootstrap prerequisites when one of these
package managers is available:

- `apt-get`
- `dnf`
- `yum`
- `zypper`
- `apk`
- `brew`

## Minimum shell dependency

From a fresh system, install Git first:

```bash
sudo apt-get update
sudo apt-get install -y git
```

## What `install.sh` does

- installs missing shell prerequisites when possible:
  - `git`
  - `curl`
  - Python 3
  - Python venv support
- installs `nvm` if missing
- installs and uses Node 22
- sets Node 22 as the default
- creates `.env` from `.env.example` if needed
- runs `npm install`
- creates `.venv` and installs Python release-tool dependencies
- refreshes `public/config/pypnm-instances.local.yaml` from the version-controlled
  template while preserving local values

## Update behavior

When `--update-webui` is used:

- the script fetches tags from `origin`
- checks out the latest tag unless you provide one explicitly
- does not overwrite your active runtime config directly
- merges your local runtime config values into the current template shape

Runtime config model:

- `public/config/pypnm-instances.yaml` is the version-controlled template
- `public/config/pypnm-instances.local.yaml` is the machine-local active override

## After install

Start the UI with:

```bash
pypnm-webui serve
```
