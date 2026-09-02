import { writeFileSync, readFileSync } from 'node:fs';
import { CSS } from './style.mjs';
import { APP_JS } from './app.mjs';

/* Reuse the register data already written for the static version. */
const src = readFileSync(new URL('./build.mjs', import.meta.url), 'utf8');
const from = src.indexOf('const CAPS = [') + 'const CAPS = '.length;
const to = src.indexOf('\n];', from) + 2;
const CAPS = eval('(' + src.slice(from, to) + ')');

const state = {
  v: 1,
  savedAt: '2026-08-28',
  base: '',
  caps: CAPS.map((c) => ({
    id: c.id,
    name: c.name,
    what: c.what.replace(/&rsquo;/g, '\u2019').replace(/&mdash;/g, '\u2014'),
    frs: c.frs.map((f) => ({
      t: f[0].replace(/&rsquo;/g, '\u2019').replace(/&mdash;/g, '\u2014'),
      rel: f[1],
      ev: f[2].replace(/&middot;/g, '\u00b7'),
      not: f[3] === 'n',
      on: true,
      note: (f[4] || '').replace(/&rsquo;/g, '’').replace(/&mdash;/g, '—'),
    })),
  })),
};

const frs = state.caps.flatMap((c) => c.frs);

/* The published source is a fragment: the Artifact tool wraps it. The page's
   own renderDocument() emits the full document, and both must look the same,
   so the CSS carries its own reset and nothing depends on the wrapper. */
const page = `<title>Jemaat Capability Register</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<style id="css">${CSS}</style>
<script type="application/json" id="state">${JSON.stringify(state)}</script>
<div id="root"></div>
<script id="app">${APP_JS}</script>
`;

writeFileSync(new URL('./jemaat-capability-register.html', import.meta.url), page, 'utf8');
console.log(`wrote editable register — ${state.caps.length} CAP, ${frs.length} FR, ${frs.filter(f=>f.not).length} must-not, ${(page.length/1024).toFixed(0)} KB`);
