import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

/*
 * Repackage the published canvas.
 *
 * jemaat-mobile.html carries the whole editable document inside one JSON
 * script block: every .dc.html source plus canvas.json. gen.mjs writes those
 * files; this puts them back into the page without touching the editor code
 * around them, so the artifact can be republished to the same URL.
 *
 * `<` is escaped as < exactly as the runtime writes it - the artboards
 * contain </script>, which would otherwise close the block early.
 */
const dir = new URL('./', import.meta.url);
const pagePath = new URL('./jemaat-mobile.html', import.meta.url);
const html = readFileSync(pagePath, 'utf8');

const re = /(<script type="application\/json" id="appifact-doc">\n?)([\s\S]*?)(\n?<\/script>)/;
const match = html.match(re);
if (!match) throw new Error('appifact-doc block not found');

const document = JSON.parse(match[2]);

const files = {};
for (const name of readdirSync(dir).sort()) {
  if (name.endsWith('.dc.html')) files[name] = readFileSync(new URL(`./${name}`, dir), 'utf8');
}
files['canvas.json'] = readFileSync(new URL('./canvas.json', dir), 'utf8');
document.content.files = files;

const payload = JSON.stringify(document).replace(/</g, '\\u003c');
writeFileSync(pagePath, html.replace(re, (_all, open, _body, close) => open + payload + close), 'utf8');

console.log('packed', Object.keys(files).length - 1, 'artboards + canvas.json');
