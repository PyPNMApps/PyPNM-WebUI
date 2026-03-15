# Getting Started

## 1. Install and bootstrap

From the repo root:

```bash
./install.sh
```

Details:
- [Install And Bootstrap](install-and-bootstrap.md)

## 2. Configure API endpoint

Edit `.env` if your PyPNM API is not local default:

```env
VITE_PYPNM_API_BASE_URL=http://127.0.0.1:8080
VITE_REQUEST_TIMEOUT_MS=30000
```

Runtime instance selection details:
- [Runtime Configuration](runtime-configuration.md)

## 3. Start the UI

```bash
pypnm-webui serve
```

Open:
- `http://127.0.0.1:4173`

## 4. First checks

- Use the left sidebar `PyPNM Target` dropdown to confirm the active instance from `public/config/pypnm-instances.yaml`.
- Open `Health` page and verify backend connectivity.
- Open `Operations` and confirm the `PNM / MultiCapture / Downstream / RxMER` workflow appears.
