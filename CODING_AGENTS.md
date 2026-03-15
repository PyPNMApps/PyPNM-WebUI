# Coding Agent Guidance

## Core Purpose (Required)

- This repository is **frontend-only** for PyPNM Web UI.
- Do not implement or duplicate backend logic from PyPNM (SNMP, DOCSIS parsing, business logic, analysis engines).
- All technical data must come from PyPNM REST APIs.

## Reuse-First Rules (Required)

- Reuse existing UI components/hooks/services before creating new ones.
- When multiple visuals need the same metadata rendering or formatting behavior, extract it into `src/components/common` or `src/lib` instead of duplicating it inside a feature view.
- Keep endpoint integrations isolated in feature/service modules.
- Centralize API transport concerns (base URL, headers, timeout, interceptors) in one API client.
- Reuse shared request/response types in `src/types`.
- Centralize reusable request-form hover text in a shared hint registry instead of hardcoding inline helper copy in individual forms.
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
- Keep shared visual primitives generic: device context tables, epoch-to-UTC formatting, frequency-range formatting, and numeric summary helpers belong in common modules, not in endpoint-specific components.
- Keep the project root lean. Do not accumulate support files at the repo root when they belong to a feature, toolchain, docs area, or script path.
- Place support files near the code or workflow they serve. Do not create a generic central folder unless the files are truly shared across multiple areas.
- For request forms that accept `channel_ids`, document the default black value as indicating all channels.
- Render shared request-form hover hints through a reusable field-label component so the displayed help text and the editable source stay aligned.

## UX/Engineering Dashboard Rules (Required)

- Prioritize clarity and traceability over decorative UI.
- Always show request context and backend response metadata (`status`, `message`, `timestamp` when available).
- Provide both interpreted and raw JSON views for technical results.
- Include explicit loading, error, and empty states for every data panel.
- Support copy-to-clipboard for identifiers and payloads where useful.
- Default graph lines to thin strokes unless a thicker treatment is required for legibility or a specific visual convention.
- When x-axis labels are large numeric values and horizontal rendering hurts readability, angle the labels so they remain visible and readable.
- Prefer lazy-loading at route or page boundaries when it reduces initial bundle cost.
- Do not micro-chunk small shared UI pieces; keep lazy-loading focused on meaningful page-level splits.

## Environment And Configuration (Required)

- API base URL must be environment-driven (`VITE_PYPNM_API_BASE_URL`), never hardcoded.
- Keep local/dev/prod behavior configurable via environment variables.
- Document all env vars in `docs/env.md` and `.env.example`.
- Keep shared request defaults in `public/config/pypnm-instances.yaml` at the instance level when they vary by PyPNM agent.
- When config fields are edited interactively, route that behavior through `pypnm-webui config-menu` instead of inventing parallel config entry points.
- Treat runtime YAML config as startup state, not hot-reload state. If behavior changes there, document that a page reload is required.
- Use `public/config/pypnm-instances.yaml` as the version-controlled template and `public/config/pypnm-instances.local.yaml` as the preserved machine-local override.

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
  - `docs/development/workflow.md`
  - `docs/roadmap.md`

## Commit Message Guidance

- If request via chat request starts with `commit-msg`, then preface command `./tools/git/git-save.sh` with `commit-msg "<commit-msg>"`
- One line summary (max 50 characters)
- One line Summary start: `Feature:` , `Bugfix:` , `Docs:` , `Refactor:` , `Test:`
- Detailed description lines (max 72 characters per line); every line after the first must start with `-`
- When the user asks for a commit message, provide plain text for direct paste into the terminal or UI text box.
- Do not wrap commit message suggestions in quotes (`"`), backticks (`` ` ``), or code fences unless the user explicitly asks for that format.
- Prefer detailed commit messages that describe the current change set clearly.
- Do not default to a one-line commit message when the change set is broad; provide a title plus concise bullet points.
- Avoid redundant wording and avoid repeating the exact prior commit message suggestion unless the diff is unchanged and the user explicitly asks to reuse it.
- If the user asks for `in a text box`, return plain text only (no markdown fence).
- If the user asks for `in a markdown text box`, return the commit message inside a fenced code block with `text`.

## Agent Guardrails

- Do not add backend/server code to this repo unless explicitly requested.
- Do not assume endpoint response shapes beyond documented contracts.
- Do not hardcode endpoint-specific behavior into shared generic components.
- Preserve room for future auth/RBAC integration without premature complexity.
