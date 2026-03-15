# PyPNM-WebUI

Frontend-only web client for PyPNM REST APIs.

## Requirements

- Ubuntu 22.04+ (or compatible Linux)
- `curl`
- `python3` (for release tooling)
- internet access for first-time dependency install

## One-command install

```bash
./install.sh
```

What `install.sh` does:
- installs `nvm` if missing
- installs/uses Node 22
- sets Node 22 as default
- creates `.env` from `.env.example` if needed
- runs `npm install`
- creates `.venv` and installs Python release-tool dependencies

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
```

Common serve examples:

```bash
pypnm-webui serve
pypnm-webui serve --host 0.0.0.0 --port 4173
pypnm-webui serve --open
```

## Environment

Local env file:
- `.env`

Example values:

```env
VITE_PYPNM_API_BASE_URL=http://127.0.0.1:8080
VITE_REQUEST_TIMEOUT_MS=30000
```

Instance targets for the runtime dropdown:
- `public/config/pypnm-instances.yaml`
- The selected instance overrides `VITE_PYPNM_API_BASE_URL`
- `VITE_PYPNM_API_BASE_URL` remains the fallback when the YAML file is missing
- Use the left sidebar dropdown to switch between configured PyPNM instances at runtime

## Scripts

```bash
npm run serve
npm run build
npm run preview
npm run lint
npm run test
```

## Git Helpers

```bash
./tools/git/git-save.sh --commit-msg "message"
./tools/git/git-save.sh --commit-msg "message" --push
./tools/git/git-push.sh --commit-msg "message"
```

For destructive history rewrite workflows only:

```bash
./tools/git/git-reset-branch-history.sh --help
```

## Release Helpers

```bash
.venv/bin/python ./tools/support/bump_version.py --current
.venv/bin/python ./tools/support/bump_version.py --next patch
.venv/bin/python ./tools/support/bump_version.py 0.2.0
.venv/bin/python ./tools/release/check_version.py
.venv/bin/python ./tools/release/test-runner.py
.venv/bin/python ./tools/release/release.py --help
```

## User docs

- [Getting Started](docs/user/getting-started.md)
- [Using The UI](docs/user/using-the-ui.md)
- [Troubleshooting](docs/user/troubleshooting.md)
- [Release Workflow](docs/user/release-workflow.md)

## Development docs

- [Development Field Hints](docs/development/field-hints.md)

## Current baseline

- App shell with route navigation
- Health and operations pages backed by selected-instance runtime config
- Generic measurement request form
- Fixture-backed analysis viewer with reusable device, chart, and evidence components
- Runtime YAML config for multiple PyPNM instances with dropdown selection
- Postman-style operations workbench for `PNM / MultiCapture / Downstream / RxMER`
- `pypnm-webui serve` CLI startup aligned with `pypnm` / `pypnm-cmts` command style
- Placeholder pages for results and file list
- Typed API client and environment config
