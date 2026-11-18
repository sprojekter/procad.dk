// Laver .avif og .webp ved siden af alle .jpg/.jpeg/.png i public/images/
// Kør: npm run images   (kræver at `npm install` er kørt)
// Store originaler skaleres ned til maks. 2000 px bredde.
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = new URL('../public/images/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const MAX_W = 2000;

async function* walk(dir) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    if ((await stat(p)).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let n = 0;
for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
  const base = file.slice(0, -ext.length);
  const img = sharp(file).rotate().resize({ width: MAX_W, withoutEnlargement: true });
  await img.clone().avif({ quality: 55 }).toFile(`${base}.avif`);
  await img.clone().webp({ quality: 78 }).toFile(`${base}.webp`);
  n++;
  console.log('✓', file.replace(ROOT, ''));
}
console.log(n ? `${n} billede(r) optimeret.` : 'Ingen billeder fundet i public/images/.');
