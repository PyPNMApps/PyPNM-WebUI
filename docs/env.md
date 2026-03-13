# Environment Configuration

## Required Variables
- `VITE_PYPNM_API_BASE_URL`: Base URL for PyPNM REST API.

## Optional Variables
- `VITE_REQUEST_TIMEOUT_MS`: HTTP timeout override in milliseconds.

## Example
```env
VITE_PYPNM_API_BASE_URL=http://127.0.0.1:8000
VITE_REQUEST_TIMEOUT_MS=15000
```

## Notes
- Keep `.env.local` out of version control.
- Provide defaults in `.env.example` once scaffold is created.
