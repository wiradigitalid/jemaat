import { readdirSync, readFileSync } from 'node:fs';
const files = readdirSync('.').filter(f => f.endsWith('.dc.html'));
const all = files.map(f => readFileSync(f, 'utf8')).join('\n');

const count = (re, label, keep = 99) => {
  const m = {};
  for (const x of all.matchAll(re)) { const v = x[1].trim(); m[v] = (m[v] || 0) + 1; }
  const rows = Object.entries(m).sort((a, b) => b[1] - a[1]);
  console.log(`\n${label} — ${rows.length} distinct`);
  rows.slice(0, keep).forEach(([v, n]) => console.log(`   ${String(n).padStart(4)}  ${v}`));
};

count(/border-radius:([^;"]+)/g, 'border-radius');
count(/font-size:([^;"]+)/g, 'font-size');
count(/font-weight:([^;"]+)/g, 'font-weight');
count(/(?:^|[;"])height:(\d+px)/g, 'fixed height');
count(/line-height:([^;"]+)/g, 'line-height');

// palette: every hex used
const hex = {};
for (const x of all.matchAll(/#[0-9A-Fa-f]{3,8}/g)) { const v = x[0].toUpperCase(); hex[v] = (hex[v] || 0) + 1; }
console.log(`\npalette — ${Object.keys(hex).length} distinct hex`);
Object.entries(hex).sort((a, b) => b[1] - a[1]).forEach(([v, n]) => console.log(`   ${String(n).padStart(4)}  ${v}`));
