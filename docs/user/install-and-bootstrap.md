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
- runs `npm ci`
- creates `.venv` and installs Python release-tool dependencies
- installs Python dependencies in isolated mode so local `PYTHONPATH` or
  `PYTHONHOME` values do not leak other project metadata into the WebUI
  environment
- refreshes `public/config/pypnm-instances.local.yaml` from the version-controlled
  template while preserving local values

## Update behavior

When `--update-webui` is used:

- the script fetches tags from `origin`
- checks out the latest tag unless you provide one explicitly
- creates or resets a local branch for that tag instead of leaving the repo in a
  detached `HEAD` state
- does not overwrite your active runtime config directly
- merges your local runtime config values into the current template shape
- reminds you to restart any running WebUI server after the update

Runtime config model:

- `public/config/pypnm-instances.yaml` is the version-controlled template
- `public/config/pypnm-instances.local.yaml` is the machine-local runtime file
- runtime config is merged by instance `id`; `.local` is not a full-file replacement

## After install

Start the UI with:

```bash
pypnm-webui serve
```

If you need to inspect or stop local WebUI dev servers:

```bash
pypnm-webui kill-pypnm-webui --list
pypnm-webui kill-pypnm-webui --kill
```
