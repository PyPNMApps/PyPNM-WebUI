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
