# financial-mcp-servers

Repository of MCP (Model Context Protocol) servers focused on financial data sources and related tooling. This repo collects, organizes, and helps maintain MCP servers (local or remote) that provide finance, market, and crypto data to agents.

## Purpose
- Collect finance/market-related MCP servers in one place.
- Provide tools to discover MCP servers on npm and add them to the repo.
- Maintain a weekly GitHub Action that refreshes discovered MCP servers.

## Repo layout
- mcp-servers.json — root aggregated config used by tooling
- mcp-servers/
  - README.md — docs for the `mcp-servers` folder
  - generated-mcp-servers.json — auto-generated config (do not edit by hand)
  - .env.example — example env vars
  - servers/ — per-server JSON files (one file per MCP server)
  - scripts/
    - generate-mcp-config.js — npm registry scanner (creates generated-mcp-servers.json)
    - split-generated.js — split generated file into per-server files
    - split-servers.js — split aggregated root config into per-server files
    - find-npm-mcp.js — quick npm filter helper
    - test-run.sh — small test runner (Unix)
- .github/workflows/update-mcp-servers.yml — weekly workflow that runs the scanner and commits generated output

## Quickstart (local)
Prereqs
- Node.js v18+ (global fetch available)
- Network access to registry.npmjs.org

Scan npm and generate JSON
```bash
# generate mcp-servers/generated-mcp-servers.json
node mcp-servers/scripts/generate-mcp-config.js
```

Split generated results into per-server files
```bash
node mcp-servers/scripts/split-generated.js
# or inspect the generated file first:
cat mcp-servers/generated-mcp-servers.json
```

Split the root aggregator into per-server files (if you update mcp-servers.json)
```bash
node mcp-servers/scripts/split-servers.js
```

Preview / quick filter (alternative)
```bash
node mcp-servers/scripts/find-npm-mcp.js
cat mcp-servers/npm_filtered.json
```

Test-run (Unix)
```bash
chmod +x mcp-servers/scripts/test-run.sh
./mcp-servers/scripts/test-run.sh
```

## GitHub Action
- Workflow: .github/workflows/update-mcp-servers.yml
- Runs weekly (configured by cron) and on manual dispatch
- Executes the generator script and commits mcp-servers/generated-mcp-servers.json if changed
- Default behavior: direct push. Consider changing to PR-based flow or using a bot account.

## How entries are represented
Per-server JSON files use the same structure as the existing ones:
```json
{
  "name": "example-mcp-server",
  "command": "npx",
  "args": ["-y", "example-mcp-server"],
  "disabled": false,
  "autoApprove": [],
  "env": {}
}
```

- Place secrets in local `.env` (not committed). See `mcp-servers/.env.example`.

## Recommended workflow
1. Run the generator locally, review `mcp-servers/generated-mcp-servers.json`.
2. Use `split-generated.js` to create per-server files for entries you accept.
3. Curate files (remove false positives, add env examples).
4. Update `mcp-servers.json` aggregator if you want this set centrally referenced.
5. Commit and push.

## Security & maintenance notes
- Do not commit API keys, private keys, or other secrets. Use `.env` or secret manager.
- Review auto-generated entries for false positives; the scanner uses heuristics.
- Consider restricting the GitHub Action to open a PR instead of pushing directly.

## Contributing
- Add curated MCP server files under `mcp-servers/servers/`.
- If you add a new server, update `mcp-servers.json` or run `split-servers.js` to update the per-server files automatically.
- Open a PR with changes and include usage instructions for any server that requires special env vars or setup.

## Troubleshooting
- If Node <18, either upgrade Node or polyfill `fetch`.
- If the GitHub Action should create PRs instead of pushing, I can change the workflow to use a branch + create-pull-request action.
