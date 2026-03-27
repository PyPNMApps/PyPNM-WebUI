<p align="center">
  <a href="docs/index.md">
    <picture>
      <source srcset="docs/images/PyPNM-WebUI-dark.png" media="(prefers-color-scheme: dark)" />
      <img src="docs/images/PyPNM-WebUI-light.png" alt="PyPNM WebUI" width="240" style="border-radius: 24px;" />
    </picture>
  </a>
</p>

# PyPNM-WebUI

[![PyPNM-WebUI Version](https://img.shields.io/github/v/tag/PyPNMApps/PyPNM-WebUI?label=PyPNM-WebUI&sort=semver)](https://github.com/PyPNMApps/PyPNM-WebUI/tags)
[![Ubuntu Checks](https://github.com/PyPNMApps/PyPNM-WebUI/actions/workflows/ubuntu-checks.yml/badge.svg?branch=main)](https://github.com/PyPNMApps/PyPNM-WebUI/actions/workflows/ubuntu-checks.yml)
[![Ubuntu PyPNM Integration](https://github.com/PyPNMApps/PyPNM-WebUI/actions/workflows/ubuntu-pypnm-integration.yml/badge.svg?branch=main)](https://github.com/PyPNMApps/PyPNM-WebUI/actions/workflows/ubuntu-pypnm-integration.yml)
![CodeQL](https://github.com/PyPNMApps/PyPNM-WebUI/actions/workflows/codeql.yml/badge.svg)
[![Docs Publish](https://github.com/PyPNMApps/PyPNM-WebUI/actions/workflows/publish-mkdocs.yml/badge.svg?branch=main)](https://github.com/PyPNMApps/PyPNM-WebUI/actions/workflows/publish-mkdocs.yml)
[![Node](https://img.shields.io/badge/Node-%E2%89%A520.19.0-339933?logo=node.js&logoColor=white)](https://github.com/PyPNMApps/PyPNM-WebUI)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Ubuntu](https://img.shields.io/badge/Ubuntu-22.04%20%7C%2024.04%20LTS-E95420?logo=ubuntu&logoColor=white)](https://github.com/PyPNMApps/PyPNM-WebUI)

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
git clone https://github.com/PyPNMApps/PyPNM-WebUI.git
cd PyPNM-WebUI
```

## Install

```bash
./install.sh
```

Same-machine WebUI + `pypnm-docsis` install:

```bash
./install.sh --with-pypnm-docsis
```

Install Python development tooling (docs/release helpers) into `.venv`:

```bash
./install.sh --development
```

## Run locally

```bash
pypnm-webui serve
```

Start same-machine backend + frontend from the normal serve flow:

```bash
pypnm-webui serve --start-local-pypnm-docsis
```

Same-machine backend + frontend is also available with:

```bash
pypnm-webui start-local-stack
```

Default local URL:
- `http://127.0.0.1:4173`

CLI help:

```bash
pypnm-webui --help
pypnm-webui serve --help
pypnm-webui config-menu --help
pypnm-webui kill-pypnm-webui --help
```

Common serve examples:

```bash
pypnm-webui serve
pypnm-webui serve --host 0.0.0.0 --port 4173
pypnm-webui serve --open
pypnm-webui config-menu
pypnm-webui kill-pypnm-webui --list
./install.sh --update-webui
npm run docs:build
npm run docs:serve
```

## User docs

- [Documentation Index](docs/index.md)
- [Getting Started](docs/user/getting-started.md)
- [Install And Bootstrap](docs/user/install-and-bootstrap.md)
- [Local Combined Install](docs/user/local-combined-install.md)
- [Release Helpers](docs/user/release-helpers.md)
- [Runtime Configuration](docs/user/runtime-configuration.md)
- [UI Overview](docs/user/using-the-ui.md)
- [Navigation And Agent Selection](docs/user/ui-navigation.md)
- [Single Capture](docs/user/single-capture.md)
- [Operations And Spectrum Analyzer](docs/user/operations-and-spectrum.md)
- [Advanced Analysis](docs/user/advanced-workflows.md)
- [Files, Health, Settings, And About](docs/user/supporting-pages.md)
- [Troubleshooting](docs/user/troubleshooting.md)
- [Release Workflow](docs/user/release-workflow.md)

## Development docs

- [Development Field Hints](docs/development/field-hints.md)
- [Git Helpers](docs/development/git-helpers.md)
- [Development Workflow](docs/development/workflow.md)
- [Development Logging](docs/development/logging.md)
