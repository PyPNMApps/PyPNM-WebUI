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
npm link
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
- verify the selected instance in the top-bar dropdown
- verify `public/config/pypnm-instances.local.yaml` base URLs when using a local override
- otherwise verify `public/config/pypnm-instances.yaml` base URLs
- verify `.env` `VITE_PYPNM_API_BASE_URL` if YAML fallback is being used
- check browser devtools network tab for failing request paths/statuses

## `pypnm-webui: command not found`

Re-register the local CLI from the repo root:

```bash
npm link
```

Then verify:

```bash
pypnm-webui --help
```
