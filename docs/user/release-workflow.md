# Release Workflow

## Prerequisites

Run bootstrap once:

```bash
./install.sh
```

This ensures:
- Node 22 is installed/selected
- `.venv` exists for Python tooling

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
.venv/bin/python ./tools/support/bump_version.py --next patch
```

Set explicit:

```bash
.venv/bin/python ./tools/support/bump_version.py 0.2.0
```

## Run release

Default release flow (checks + commit + tag + push):

```bash
.venv/bin/python ./tools/release/release.py --commit-msg "Release"
```

Release with automatic version bump:

```bash
.venv/bin/python ./tools/release/release.py --commit-msg "Release" --next patch
```

Release with explicit version:

```bash
.venv/bin/python ./tools/release/release.py --commit-msg "Release" --version 0.2.0
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

- Release workflow only allows `main` or `hot-fix` branches.
- By default, working tree must be clean.
- Failure logs are stored under `release-reports/logs/`.
