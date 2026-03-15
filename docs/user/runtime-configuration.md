# Runtime Configuration

## Local Env File

Use:

- `.env`

Example values:

```env
VITE_PYPNM_API_BASE_URL=http://127.0.0.1:8080
VITE_REQUEST_TIMEOUT_MS=30000
```

## Instance Targets

Runtime instance targets for the dropdown live in:

- `public/config/pypnm-instances.yaml`

Behavior:

- the selected instance overrides `VITE_PYPNM_API_BASE_URL`
- `VITE_PYPNM_API_BASE_URL` remains the fallback when the YAML file is missing
- use the `PyPNM Target` dropdown to switch between configured PyPNM instances at runtime
