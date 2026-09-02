import { readdirSync, readFileSync } from 'node:fs';
const files = readdirSync('.').filter(f => f.endsWith('.dc.html'));
const doc = Object.fromEntries(files.map(f => [f, readFileSync(f, 'utf8')]));
const all = Object.values(doc).join('\n');
const strip = (s) => s.replace(/&middot;|&mdash;|&ndash;|&rsquo;|&ldquo;|&rdquo;/g, ' ');

const where = (re) => {
  const m = {};
  for (const [f, c] of Object.entries(doc)) {
    for (const x of strip(c).matchAll(re)) {
      const v = x[0].trim();
      (m[v] ??= new Set()).add(f.replace('.dc.html',''));
    }
  }
  return m;
};
const show = (label, m, filter = () => true) => {
  console.log(`\n### ${label}`);
  Object.entries(m).sort((a,b)=>b[1].size-a[1].size).filter(([k,v])=>filter(k,v))
    .forEach(([k,v]) => console.log(`  ${k.padEnd(26)} ${v.size}x  ${[...v].slice(0,7).join(' ')}${v.size>7?' …':''}`));
};

/* 1. register size claims */
show('register-size numbers', where(/\b(248|249|250|254|261|2,?000|312|486|820)\b/g));

/* 2. people */
const names = ['Budi Halim','Melisa Halim','Gavriel Halim','Kayla Halim','Yohanes Halim',
 'Dedi Prasetyo','Intan Prasetyo','Rafael Prasetyo','Tigor Simanjuntak','Ruth Simanjuntak',
 'Andreas Wibowo','Grace Sutanto','Fandi Tobing','Sinta Rahmat','Hendra Lie','Maruli Nainggolan',
 'Samuel Kartono','Esther Manullang','Rio Panjaitan','Yohana Tanudjaja','Lidya Suryani',
 'Rian Wijaya','Rina Kusuma','Daniel Halim'];
const nm = {};
for (const n of names) for (const [f,c] of Object.entries(doc)) if (c.includes(n)) (nm[n] ??= new Set()).add(f.replace('.dc.html',''));
show('people', nm);

/* 3. phone numbers */
show('phone numbers', where(/0[1-9][0-9]{2}-[0-9]{4}-[0-9]{4}/g));

/* 4. dates */
show('dates', where(/\b(?:\d{1,2}\s)?(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/g));

/* 5. group + church names */
show('groups and churches', where(/\b(Anugerah|Damai|Harapan|Sukacita|Young Adults|Grace Community Church|Immanuel Church|Bethania Church|Bethany Church|Zion Church)\b/g));
