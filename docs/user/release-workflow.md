# Release Workflow

## Prerequisites

Run bootstrap once:

```bash
./install.sh
```

This ensures:
- Node 22 is installed/selected
- `.venv` exists for Python tooling

## Release Version Model

- `VERSION` is the release source of truth.
- It uses `MAJOR.MINOR.MAINTENANCE.BUILD`.
- Release tags use that value with a `v` prefix, for example `v0.1.0.0`.
- `package.json` and `package-lock.json` are kept in sync with the derived npm-compatible version `MAJOR.MINOR.MAINTENANCE`.

## Validate before release

```bash
.venv/bin/python ./tools/release/check_version.py
.venv/bin/python ./tools/release/test-runner.py
```

## Bump version

View current:

```bash
.venv/bin/python ./tools/support/bump_version.py --current
```

Auto bump:

```bash
.venv/bin/python ./tools/support/bump_version.py --next maintenance
```

Build-only bump:

```bash
.venv/bin/python ./tools/support/bump_version.py --next build
```

Set explicit:

```bash
.venv/bin/python ./tools/support/bump_version.py 0.2.0.0
```

## Run release

Default release flow (checks + commit + tag + push):

```bash
.venv/bin/python ./tools/release/release.py --commit-msg "Release"
```

When `--next` is omitted, `release.py` performs an implicit `maintenance` bump before validation, commit, tag, and push.

As part of the release flow, `release.py` also generates a sanitized copy of:

- `public/config/pypnm-instances.yaml`

The sanitized copy is written under:

- `release-reports/runtime-config/pypnm-instances.sanitized.yaml`

This preserves the working runtime config file while producing a release-safe
copy with generic placeholder values.

Release with automatic version bump:

```bash
.venv/bin/python ./tools/release/release.py --commit-msg "Release" --next maintenance
```

Release with a build bump:

```bash
.venv/bin/python ./tools/release/release.py --commit-msg "Release" --next build
```

Release with explicit version:

```bash
.venv/bin/python ./tools/release/release.py --commit-msg "Release" --version 0.2.0.0
```

Safe dry-style release (no push):

```bash
.venv/bin/python ./tools/release/release.py --commit-msg "Release" --no-push
```

Skip tag creation:

```bash
.venv/bin/python ./tools/release/release.py --commit-msg "Release" --no-tag
```

## Notes

- `VERSION` is the authoritative release version and uses `MAJOR.MINOR.MAINTENANCE.BUILD`.
- `package.json` and `package-lock.json` keep the derived npm-compatible `MAJOR.MINOR.MAINTENANCE` version.
- tag creation follows the `v<version>` pattern, for example `v0.1.0.0`
- Release workflow only allows `main` or `hot-fix` branches.
- By default, working tree must be clean.
- Failure logs are stored under `release-reports/logs/`.
- The sanitized runtime-config release artifact is stored under
  `release-reports/runtime-config/`.
