# Coding Agent Guidance

## Core Purpose (Required)

- This repository is **frontend-only** for PyPNM Web UI.
- Do not implement or duplicate backend logic from PyPNM (SNMP, DOCSIS parsing, business logic, analysis engines).
- All technical data must come from PyPNM REST APIs.

## Reuse-First Rules (Required)

- Reuse existing UI components/hooks/services before creating new ones.
- Keep endpoint integrations isolated in feature/service modules.
- Centralize API transport concerns (base URL, headers, timeout, interceptors) in one API client.
- Reuse shared request/response types in `src/types`.
- Keep diffs minimal and focused; avoid formatting churn.

## Typing And API Contracts (Required)

- Use strict TypeScript typing.
- Avoid `any` unless unavoidable and justified inline.
- Define typed request/response models for each endpoint integration.
- Validate external API payloads at boundaries (for example with Zod).
- Prefer shared type aliases/interfaces over ad-hoc inline types.

## Architecture Constraints (Required)

- Keep a clean split between:
  - `features/` (workflow modules)
  - `components/` (reusable UI)
  - `services/` (API integrations)
  - `types/` (contracts)
  - `lib/` (pure utilities)
- Keep presentational components free of API side effects when practical.
- Put endpoint-specific logic inside feature modules, not global app shell.

## UX/Engineering Dashboard Rules (Required)

- Prioritize clarity and traceability over decorative UI.
- Always show request context and backend response metadata (`status`, `message`, `timestamp` when available).
- Provide both interpreted and raw JSON views for technical results.
- Include explicit loading, error, and empty states for every data panel.
- Support copy-to-clipboard for identifiers and payloads where useful.

## Environment And Configuration (Required)

- API base URL must be environment-driven (`VITE_PYPNM_API_BASE_URL`), never hardcoded.
- Keep local/dev/prod behavior configurable via environment variables.
- Document all env vars in `docs/env.md` and `.env.example`.

## Security And Data Hygiene (Required)

- Do not commit secrets, tokens, or private credentials.
- Use generic/sanitized example values in docs and fixtures.
- Avoid embedding real customer/device identifiers in static assets or sample payloads.

## Testing Expectations (Required)

- Add tests for new behavior where practical:
  - unit tests for helpers/mappers
  - component tests for UI logic
  - API mocking for network behavior
- Maintain at least smoke-level coverage for critical user flows.
- Do not merge changes that break lint/type-check/tests.

## Documentation Requirements (Required)

- Update relevant docs when behavior or architecture changes:
  - `README.md`
  - `docs/architecture.md`
  - `docs/api-integration.md`
  - `docs/env.md`
  - `docs/development-workflow.md`
  - `docs/roadmap.md`

## Commit Message Guidance

- If a user request starts with `commit-msg`, preface with:
  - `./tools/git/git-save.sh --commit-msg "<commit-msg>"`
- Keep commit messages concise and descriptive.
- Include key scope changes and user-visible impact.

## Agent Guardrails

- Do not add backend/server code to this repo unless explicitly requested.
- Do not assume endpoint response shapes beyond documented contracts.
- Do not hardcode endpoint-specific behavior into shared generic components.
- Preserve room for future auth/RBAC integration without premature complexity.
