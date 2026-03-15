# Development Workflow

## Local Setup
1. Run `./install.sh` for first-time setup.
2. Start dev server with `pypnm-webui serve`.
3. Run tests with `npm run test`.
4. Run lint checks with `npm run lint`.
5. Run production build validation with `npm run build`.

## Git Workflow Helpers
- `./tools/git/git-save.sh --commit-msg "..."` stages, runs checks, and commits.
- `./tools/git/git-save.sh --commit-msg "..." --push` also pushes.
- `./tools/git/git-push.sh --commit-msg "..."` commit+push helper for quick flows.
- `./tools/git/git-reset-branch-history.sh` rewrites branch history; use only with care.

## Release Workflow
- `.venv/bin/python ./tools/support/bump_version.py --next patch` bumps package version files.
- `.venv/bin/python ./tools/release/check_version.py` validates package version consistency.
- `.venv/bin/python ./tools/release/test-runner.py` runs lint/test/build gates.
- `.venv/bin/python ./tools/release/release.py` runs release checks, commit/tag, and optional push.

## PR Guidance
- Keep changes scoped to a single feature/module when possible.
- Include screenshots for UI-impacting changes.
- Document API assumptions in `docs/api-integration.md`.
- For shared request-form hover text, use `docs/development/field-hints.md`.

## Quality Gates (target)
- Lint: pass
- Type-check: pass
- Unit/component tests: pass
- Critical flow smoke test: pass
