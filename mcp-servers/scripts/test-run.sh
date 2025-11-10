#!/usr/bin/env bash
set -euo pipefail
# Test runner for generate-mcp-config.js
# Usage: ./mcp-servers/scripts/test-run.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Running generator script..."
node "$ROOT_DIR/scripts/generate-mcp-config.js"

OUT="$ROOT_DIR/generated-mcp-servers.json"
if [ -f "$OUT" ]; then
  echo "Generated file: $OUT"
  if command -v jq >/dev/null 2>&1; then
    jq '.' "$OUT"
  else
    cat "$OUT"
  fi
else
  echo "No generated file at $OUT"
  exit 1
fi
