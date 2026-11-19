// Henter de midlertidige Unsplash-fotos ned i public/images/, så sitet ikke kontakter
// Unsplash (tredjepart) før cookie-samtykke. Køres automatisk i GitHub Actions.
// Lokalt: npm run photos. Fejler et download, springes det over (siden viser en pladsholder).
// Kreditering og links: src/data/photos.ts. [UDFYLD] Erstat med ProCADs egne billeder, når de findes.
import { mkdir, writeFile, access } from 'node:fs/promises';

const U = (id) => `https://images.unsplash.com/photo-${id}`;
// [fil (uden endelse), foto, bredde/højde-forhold]
const photos = [
  // Ydelser (16:10)
  ['ydelser/arbejdstegninger', U('1581092160562-40aa08e78837'), 0.625],
  ['ydelser/filklargoering', U('1738162837451-2041c1418f54'), 0.625],
  ['ydelser/3d-modellering', U('1769147339214-076740872485'), 0.625],
  ['ydelser/teknisk-dokumentation', U('1769152683420-f4eff91cb30b'), 0.625],
  // Cases: før/efter (4:3)
  ['cases/beslag-fra-haandskitse-foer', U('1505569127510-bde1536937bc'), 0.75],
  ['cases/beslag-fra-haandskitse-efter', U('1727522974676-c2f9c32ee692'), 0.75],
  ['cases/papirtegning-til-3d-foer', U('1603901622056-0a5bee231395'), 0.75],
  ['cases/papirtegning-til-3d-efter', U('1581092580497-e0d23cbdf1dc'), 0.75],
  ['cases/produktide-til-produktion-foer', U('1761322572550-967ea8c0bfd9'), 0.75],
  ['cases/produktide-til-produktion-efter', U('1531053326607-9d349096d887'), 0.75],
  // Om (4:5)
  ['om/arbejdsplads', U('1764740109279-c7a8abd78821'), 1.25],
];

const root = new URL('../public/images/', import.meta.url);
for (const [name, url, ratio] of photos) {
  const sub = name.split('/')[0];
  await mkdir(new URL(`${sub}/`, root), { recursive: true });
  for (const [w, suffix] of [[1600, ''], [800, '-800'], [400, '-400']]) {
    const width = ratio > 1 ? Math.round(w * 0.75) : w; // stående billeder behøver ikke 1600 bredt
    const file = new URL(`${name}${suffix}.webp`, root);
    try { await access(file); continue; } catch {}
    try {
      const res = await fetch(`${url}?fm=webp&fit=crop&crop=entropy&q=72&w=${width}&h=${Math.round(width * ratio)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(file, Buffer.from(await res.arrayBuffer()));
      console.log('✓', `${name}${suffix}.webp`);
    } catch (e) {
      console.warn('⚠ kunne ikke hente', name, w, e.message);
    }
  }
}
