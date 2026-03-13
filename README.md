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
npm run dev
```

Default local URL:
- `http://localhost:5173`

## Environment

Local env file:
- `.env`

Example values:

```env
VITE_PYPNM_API_BASE_URL=http://127.0.0.1:8080
VITE_REQUEST_TIMEOUT_MS=30000
```

## Scripts

```bash
npm run dev
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

## Initial scaffold included

- App shell with route navigation
- Health and endpoint explorer pages
- Generic measurement request form
- Placeholder pages for results, file list, and analysis viewer
- Typed API client and environment config
