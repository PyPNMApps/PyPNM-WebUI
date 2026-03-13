# Troubleshooting

## Vite fails with syntax errors (e.g. optional chaining)

Cause:
- old Node runtime in current shell.

Check:

```bash
node -v
which node
```

Expected:
- Node 22.x
- path under `~/.nvm/...`

Fix:

```bash
./install.sh
```

Then reinstall dependencies if needed:

```bash
rm -rf node_modules package-lock.json
npm install
```

## `nvm: command not found`

Run installer:

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
```

Then re-run `./install.sh`.

## UI loads but API requests fail

- verify PyPNM backend is running
- verify `.env` `VITE_PYPNM_API_BASE_URL`
- check browser devtools network tab for failing request paths/statuses
