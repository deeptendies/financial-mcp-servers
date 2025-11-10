#!/usr/bin/env node
/**
 * split-generated.js
 *
 * Read mcp-servers/generated-mcp-servers.json and write each entry
 * to mcp-servers/servers/<name>.json so generated entries live as individual files.
 *
 * Usage:
 *   node mcp-servers/scripts/split-generated.js
 */

const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'generated-mcp-servers.json');
const outDir = path.join(__dirname, '..', 'servers');

if (!fs.existsSync(src)) {
  console.error('Source file not found:', src);
  process.exit(1);
}

const raw = fs.readFileSync(src, 'utf8');
let parsed;
try {
  parsed = JSON.parse(raw);
} catch (err) {
  console.error('Failed to parse JSON:', err.message);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const names = Object.keys(parsed);
if (names.length === 0) {
  console.log('No entries found in generated-mcp-servers.json');
  process.exit(0);
}

for (const name of names) {
  const cfg = parsed[name];
  // Use the same format as other per-server files, include "name"
  const outObj = Object.assign({ name }, cfg);
  const safeName = name.replace(/[\/@]/g, '-'); // avoid path chars
  const filePath = path.join(outDir, `${safeName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(outObj, null, 2), 'utf8');
  console.log('Wrote', filePath);
}

console.log(`Done — wrote ${names.length} files to ${outDir}`);
