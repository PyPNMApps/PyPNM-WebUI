# Install And Bootstrap

## Command

From the repo root:

```bash
./install.sh
```

## What `install.sh` does

- installs `nvm` if missing
- installs and uses Node 22
- sets Node 22 as the default
- creates `.env` from `.env.example` if needed
- runs `npm install`
- creates `.venv` and installs Python release-tool dependencies

## After install

Start the UI with:

```bash
pypnm-webui serve
```
