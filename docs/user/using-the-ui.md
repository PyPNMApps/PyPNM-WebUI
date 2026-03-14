# Using The UI

## Navigation

The left navigation includes:
- `Overview`
- `Health`
- `Operations`
- `Measurement Request`
- `Results`
- `File List`
- `Analysis Viewer`
- `Settings`

The sidebar also includes a `PyPNM Target` dropdown sourced from `public/config/pypnm-instances.yaml`.
Use it to switch the active backend instance without rebuilding the UI.

## Recommended workflow

1. `Health`
   - confirm API status and metadata.
2. `Operations`
   - use the Postman-style workflow tree to select `Start`, `Status`, `Results`, or `Analysis`.
3. `Measurement Request`
   - enter identifiers and preview request payload.
4. `Results`
   - inspect structured output and raw JSON (as endpoint wiring is added).
5. `Analysis Viewer`
   - review the reusable engineering layout while live analysis wiring expands.

## Settings

`Settings` displays runtime client configuration, including:

- `.env` fallback base URL and timeout
- selected instance label and base URL
- configured instance count
- runtime health path from YAML config

## Operations Workbench

The current operations page is organized around the Postman collection pattern:

- folder-style catalog on the left
- workflow workbench in the center
- tabs for `Request`, `Run`, `Visual`, `Raw JSON`, and `History`

The first implemented workflow is:

- `PNM / MultiCapture / Downstream / RxMER`

Its `Echo Detection 1` analysis route is already bound to the reusable WebUI visual.
