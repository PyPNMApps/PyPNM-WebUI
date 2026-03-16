# PyPNM-WebUI

Frontend-only web client for PyPNM REST APIs.

## Requirements

- Linux, validated on:
  - Ubuntu 22.04 LTS
  - Ubuntu 24.04 LTS

Other modern Linux distributions may work but are not yet part of the test matrix.

## Minimum shell dependencies

From a fresh system, install Git:

```bash
sudo apt-get update
sudo apt-get install -y git
```

## Get PyPNM-WebUI

```bash
git clone https://github.com/your-repo/PyPNM-WebUI.git
cd PyPNM-WebUI
```

## Install

```bash
./install.sh
```

## Run locally

```bash
pypnm-webui serve
```

Default local URL:
- `http://127.0.0.1:4173`

CLI help:

```bash
pypnm-webui --help
pypnm-webui serve --help
pypnm-webui config-menu --help
```

Common serve examples:

```bash
pypnm-webui serve
pypnm-webui serve --host 0.0.0.0 --port 4173
pypnm-webui serve --open
pypnm-webui config-menu
./install.sh --update-webui
npm run docs:build
npm run docs:serve
```

## User docs

- [Documentation Index](docs/index.md)
- [Getting Started](docs/user/getting-started.md)
- [Install And Bootstrap](docs/user/install-and-bootstrap.md)
- [Release Helpers](docs/user/release-helpers.md)
- [Runtime Configuration](docs/user/runtime-configuration.md)
- [Using The UI](docs/user/using-the-ui.md)
- [Troubleshooting](docs/user/troubleshooting.md)
- [Release Workflow](docs/user/release-workflow.md)

## Development docs

- [Development Field Hints](docs/development/field-hints.md)
- [Git Helpers](docs/development/git-helpers.md)
- [Development Workflow](docs/development/workflow.md)
