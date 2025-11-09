#!/usr/bin/env node
// fetch and filter npm search results for "mcp"
const https = require('https');
const fs = require('fs');
const url = 'https://registry.npmjs.org/-/v1/search?text=mcp&size=250';
const outPath = 'mcp-servers/npm_filtered.json';
const keywords = ['finance','stock','crypto','coin','market','quote','price','trading','wealth','fmp','alpha','yahoo'];

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const objs = parsed.objects || [];
      const matches = objs.filter(o => {
        const p = o.package || {};
        const name = (p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const kws = Array.isArray(p.keywords) ? p.keywords.join(' ').toLowerCase() : '';
        return keywords.some(k => name.includes(k) || desc.includes(k) || kws.includes(k));
      }).map(o => {
        const p = o.package || {};
        return {
          name: p.name,
          version: p.version,
          description: p.description,
          keywords: p.keywords || [],
          links: p.links || {}
        };
      });
      fs.mkdirSync('mcp-servers', { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify(matches, null, 2), 'utf8');
      console.log(`Saved ${matches.length} filtered packages to ${outPath}`);
    } catch (err) {
      console.error('Failed to parse npm response:', err.message);
      process.exit(2);
    }
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
  process.exit(1);
});
