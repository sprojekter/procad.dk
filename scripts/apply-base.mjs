// Efter build: tilføjer base-stien (fx /procad.dk) foran interne links i HTML,
// når sitet ligger i en undermappe på GitHub Pages. Gør intet, når SITE_BASE er tom.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const base = (process.env.SITE_BASE || '').replace(/\/$/, '');
if (!base) { console.log('Ingen base-sti – springer over.'); process.exit(0); }

const esc = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re = new RegExp(`(\\s(?:href|src|action|srcset|poster)=")\\/(?!\\/|${esc.slice(1)}\\/)`, 'g');

async function* walk(dir) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    if ((await stat(p)).isDirectory()) yield* walk(p);
    else if (p.endsWith('.html')) yield p;
  }
}
let n = 0;
for await (const f of walk('dist')) {
  const s = await readFile(f, 'utf8');
  const out = s.replace(re, `$1${base}/`);
  if (out !== s) { await writeFile(f, out); n++; }
}
console.log(`Base-sti ${base} tilføjet i ${n} HTML-filer.`);
