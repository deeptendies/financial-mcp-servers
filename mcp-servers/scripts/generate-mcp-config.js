#!/usr/bin/env node
/**
 * generate-mcp-config.js
 *
 * Scans the npm registry for packages that look like MCP servers related to
 * finance/stock and emits a JSON config at mcp-servers/generated-mcp-servers.json.
 *
 * Requires Node.js v18+ (uses global fetch).
 */

const fs = require('fs');
const OUT_PATH = 'mcp-servers/generated-mcp-servers.json';

// --- Configuration ---
const SEARCH_TERMS = [
  'mcp stock server',
  'mcp finance server',
  'mcp crypto server',
  'mcp market server'
];
const PACKAGE_SUFFIX = '-mcp-server';
const PAGE_SIZE = 100; // registry page size per request
const KEYWORDS = ['finance','stock','crypto','coin','market','quote','price','trading','wealth','fmp','alpha','yahoo'];
// ---------------------

function normalizeKey(packageName) {
  // remove leading @ and convert scoped name to a safe key: @scope/name -> scope-name
  let key = packageName.startsWith('@') ? packageName.slice(1).replace('/', '-') : packageName;
  if (key.endsWith(PACKAGE_SUFFIX)) {
    key = key.substring(0, key.length - PACKAGE_SUFFIX.length);
  }
  return key;
}

async function searchNpm(term) {
  const url = `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(term)}&size=${PAGE_SIZE}`;
  console.log(`Searching npm for: "${term}"`);
  try {
    const r = await fetch(url);
    if (!r.ok) {
      console.warn(`  npm search returned ${r.status} ${r.statusText}`);
      return [];
    }
    const data = await r.json();
    return data.objects || [];
  } catch (err) {
    console.error('  Failed to fetch npm search:', err.message);
    return [];
  }
}

function matchesKeywords(pkg) {
  const name = (pkg.name || '').toLowerCase();
  const desc = (pkg.description || '').toLowerCase();
  const kws = Array.isArray(pkg.keywords) ? pkg.keywords.join(' ').toLowerCase() : '';
  return KEYWORDS.some(k => name.includes(k) || desc.includes(k) || kws.includes(k));
}

(async function main() {
  const found = new Map();

  for (const term of SEARCH_TERMS) {
    const results = await searchNpm(term);
    for (const item of results) {
      const pkg = item.package || {};
      const name = pkg.name;
      if (!name) continue;

      // prefer explicit package name suffix match, or fallback to keyword match
      const suffixMatch = name.toLowerCase().endsWith(PACKAGE_SUFFIX);
      const keywordMatch = matchesKeywords(pkg);

      if (!suffixMatch && !keywordMatch) continue;

      if (found.has(name)) continue;

      found.set(name, {
        name,
        version: pkg.version,
        description: pkg.description || '',
        keywords: pkg.keywords || [],
        links: pkg.links || {}
      });
    }
  }

  // Build config object
  const mcpConfig = {};
  for (const [packageName, meta] of found.entries()) {
    const key = normalizeKey(packageName);
    mcpConfig[key] = {
      command: "npx",
      args: [
        "-y",
        packageName
      ],
      disabled: false,
      autoApprove: [],
      env: {}
    };
  }

  fs.mkdirSync('mcp-servers', { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(mcpConfig, null, 2), 'utf8');
  console.log(`Wrote ${Object.keys(mcpConfig).length} entries to ${OUT_PATH}`);
})();
