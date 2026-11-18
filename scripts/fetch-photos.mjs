// Henter de midlertidige Unsplash-fotos ned i public/images/ydelser/, så sitet ikke
// kontakter Unsplash (tredjepart) før cookie-samtykke. Køres automatisk i GitHub Actions.
// Lokalt: npm run photos. Fejler et download, springes det over (siden viser en pladsholder).
import { mkdir, writeFile, access } from 'node:fs/promises';

const photos = {
  arbejdstegninger: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
  filklargoering: 'https://images.unsplash.com/photo-1738162837451-2041c1418f54',
  '3d-modellering': 'https://images.unsplash.com/photo-1769147339214-076740872485',
  'teknisk-dokumentation': 'https://images.unsplash.com/photo-1769152683420-f4eff91cb30b',
};
const dir = new URL('../public/images/ydelser/', import.meta.url);
await mkdir(dir, { recursive: true });

for (const [slug, url] of Object.entries(photos)) {
  for (const [w, suffix] of [[1600, ''], [800, '-800']]) {
    const file = new URL(`${slug}${suffix}.webp`, dir);
    try { await access(file); continue; } catch {}
    try {
      const res = await fetch(`${url}?auto=format&fm=webp&fit=crop&q=72&w=${w}&h=${Math.round(w * 0.625)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(file, Buffer.from(await res.arrayBuffer()));
      console.log('✓', `${slug}${suffix}.webp`);
    } catch (e) {
      console.warn('⚠ kunne ikke hente', slug, w, e.message);
    }
  }
}
