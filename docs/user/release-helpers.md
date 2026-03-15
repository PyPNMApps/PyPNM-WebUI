# Release Helpers

## Purpose

These helpers support version inspection, version bumping, validation, and release execution for `PyPNM-WebUI`.

## Prerequisites

Run bootstrap once:

```bash
./install.sh
```

This ensures:
- Node 22 is installed and selected
- `.venv` exists for Python-based release tooling

## Version Helpers

Show the current package version:

```bash
.venv/bin/python ./tools/support/bump_version.py --current
```

Compute and apply the next patch version:

```bash
.venv/bin/python ./tools/support/bump_version.py --next patch
```

Set an explicit version:

```bash
.venv/bin/python ./tools/support/bump_version.py 0.2.0
```

## Validation Helpers

Run release-oriented validation checks:

```bash
.venv/bin/python ./tools/release/check_version.py
.venv/bin/python ./tools/release/test-runner.py
```

## Release Runner

Show release runner help:

```bash
.venv/bin/python ./tools/release/release.py --help
```

For the full release sequence and branch rules, use [Release Workflow](release-workflow.md).
