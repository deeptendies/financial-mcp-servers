# MCP Servers — Organization & Usage

This folder documents and organizes the financial MCP servers collected in the repository.

Recommended layout
- mcp-servers/
  - README.md (this file)
  - servers/
    - financial-datasets.json
    - financial-modeling-prep.json
    - alpha-vantage.json
    - yahoo-finance.json
    - coinstats-crypto.json
    - polymarket-predictions.json
    - wealthy-trading.json
    - korea-stock-market.json
    - aktools-asia-markets.json
    - free-crypto-data.json
  - .env.example

Purpose
- Keep each MCP server's launch command, required env vars, and allowed autoApprove actions in a separate JSON file.
- Keep a single index file at the repo root (`mcp-servers.json`) for tooling that expects an aggregated config (already present).
- Store secrets only in local environment files (not committed). Use `.env` or secret manager.

Per-server JSON format (example)
```json
{
  "name": "financial-datasets",
  "command": "npx",
  "args": [
    "-y",
    "mcp-remote@latest",
    "https://financialdatasets.ai/api/mcp",
    "--header",
    "X-API-KEY: ${FINANCIAL_DATASETS_API_KEY}"
  ],
  "disabled": false,
  "autoApprove": ["get_income_statements", "get_balance_sheets", "get_current_stock_price"],
  "env": {
    "FINANCIAL_DATASETS_API_KEY": "YOUR_FINANCIAL_DATASETS_API_KEY"
  }
}
```

Examples: how to run a server locally
```bash
# run financial-datasets (example)
FINANCIAL_DATASETS_API_KEY=xxxx npx -y mcp-remote@latest "https://financialdatasets.ai/api/mcp" --header "X-API-KEY: $FINANCIAL_DATASETS_API_KEY"
```

Windows (PowerShell)
```powershell
$env:FINANCIAL_DATASETS_API_KEY="xxxx"
npx -y mcp-remote@latest "https://financialdatasets.ai/api/mcp" --header "X-API-KEY: $env:FINANCIAL_DATASETS_API_KEY"
```

.env.example (place in mcp-servers/.env.example)
```env
# mcp-servers/.env.example
FINANCIAL_DATASETS_API_KEY=YOUR_FINANCIAL_DATASETS_API_KEY
FMP_ACCESS_TOKEN=YOUR_FMP_ACCESS_TOKEN
ALPHA_VANTAGE_API_KEY=YOUR_ALPHA_VANTAGE_API_KEY
COINSTATS_API_KEY=YOUR_COINSTATS_API_KEY
WEALTHY_API_KEY=YOUR_WEALTHY_API_KEY
DART_API_KEY=YOUR_DART_API_KEY
KRX_API_KEY=YOUR_KRX_API_KEY
PRIVATE_KEY=YOUR_POLYGON_WALLET_PRIVATE_KEY
```

Recommended next steps (manual)
1. Create `mcp-servers/servers/` and split the entries from the root `mcp-servers.json` into individual files named as above.
2. Add `mcp-servers/.env` (never commit) and populate with real keys.
3. Add a small script or Makefile to start commonly used MCP servers (optional).
4. If desired, add automated checks (CI) that validate each JSON file shape and required env variables.

Security note
- Never commit real API keys or private keys to the repository.
- Use `.gitignore` to exclude `mcp-servers/.env` and any credential files.

If you want, I can:
- Create the `mcp-servers/servers/` directory and create per-server JSON files and `.env.example` automatically from the existing root `mcp-servers.json`.
- Add a small `run-server.sh` / `run-server.ps1` helper for starting servers.
