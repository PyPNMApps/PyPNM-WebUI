# Architecture Overview

## Purpose
`pypnm-webui` is a frontend-only client for PyPNM REST APIs.

- UI handles forms, request execution, and result visualization.
- Backend remains source of truth for business logic and analysis.

## High-Level Structure
- `src/app`: app bootstrap and providers
- `src/routes`: route definitions
- `src/layouts`: shell and page layout
- `src/features`: endpoint/workflow modules
- `src/components`: reusable UI components
- `src/services`: API client and endpoint services
- `src/types`: request/response/domain types
- `src/lib`: shared helpers/utilities

## Design Rules
- Do not reimplement backend logic in UI.
- Keep endpoint integrations isolated in service modules.
- Use typed contracts for all request/response payloads.
- Prefer reusable components over endpoint-specific one-offs.

## Analysis Viewer Baseline
- `src/features/analysis/types.ts` holds typed analysis contracts for the current fixture-backed view.
- `src/features/analysis/analysisViewModel.ts` contains pure display-oriented derivations for summaries and chart series.
- `src/features/analysis/components/` contains reusable technical UI blocks:
  - `DeviceInfoTable`
  - `LineAnalysisChart`
  - `ChannelAnalysisCard`
- `src/pages/AnalysisViewerPage.tsx` composes those pieces into the current RxMER echo analysis route.
- Current state: fixture-backed UI proving the analysis composition model without duplicating backend logic.

## Instance Target Selection
- `public/config/pypnm-instances.yaml` is the version-controlled runtime template.
- `public/config/pypnm-instances.local.yaml` is the machine-local runtime override when present.
- Each instance can also carry `request_defaults` used to prefill capture and
  device request forms for that specific PyPNM agent.
- `src/app/InstanceConfigProvider.tsx` loads the YAML, normalizes it, and persists the selected instance in local storage.
- `src/components/layout/InstanceSelector.tsx` exposes the dropdown in the top navigation.
- Service calls should take the selected instance base URL from provider state rather than hardcoding one target.
- Shared request form defaults should come from the selected instance rather
  than from hardcoded form values.

## Operations Catalog Direction
- The WebUI uses a compact operations menu modeled after the Postman
  collection structure rather than a flat endpoint table.
- `src/features/operations/operationsNavigation.ts` is the editable registry
  for top-level operations menu entries.
- `src/pages/EndpointExplorerPage.tsx` is the current operations page for
  endpoint-bound request forms and visuals.
