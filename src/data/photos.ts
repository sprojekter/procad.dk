// Midlertidige fotos fra Unsplash (gratis Unsplash-licens, kræver ikke kreditering).
// [UDFYLD] Erstat med ProCADs egne billeder, når de findes – se docs/04-billeder-og-video.md.
export const photos = {
  laser: {
    src: 'https://images.unsplash.com/photo-1738162837451-2041c1418f54',
    alt: 'Laserskærer skærer en stålplade med gnister',
    credit: 'Cemrecan Yurtman / Unsplash',
    page: 'https://unsplash.com/photos/a-machine-that-is-cutting-a-piece-of-metal-qk2i7n39-B0',
  },
  caliper: {
    src: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
    alt: 'Skydelære på en teknisk tegning',
    credit: 'ThisisEngineering / Unsplash',
    page: 'https://unsplash.com/photos/engineer-measuring-technical-drawings-on-desk-WDCE0T4khsE',
  },
  parts: {
    src: 'https://images.unsplash.com/photo-1769147339214-076740872485',
    alt: 'To bearbejdede metaldele på tekniske tegninger',
    credit: 'EnCata PD / Unsplash',
    page: 'https://unsplash.com/photos/two-metal-mechanical-parts-on-engineering-blueprints-SRqJ3eli-4I',
  },
  components: {
    src: 'https://images.unsplash.com/photo-1769152683420-f4eff91cb30b',
    alt: 'Metalkomponenter på tekniske tegninger',
    credit: 'EnCata PD / Unsplash',
    page: 'https://unsplash.com/photos/metal-components-resting-on-engineering-blueprints-qCmbTEsdvOw',
  },
} as const;

// Øvrige midlertidige fotos (cases og Om) – hentes af scripts/fetch-photos.mjs.
export const morePhotos = [
  { file: 'cases/beslag-fra-haandskitse-foer', page: 'https://unsplash.com/photos/person-sketching-on-notebook-using-pen-ee5yWSeHPuw' },
  { file: 'cases/beslag-fra-haandskitse-efter', page: 'https://unsplash.com/photos/technical-drawings-of-geometric-shapes-and-projections-ZOHihCKWmfU' },
  { file: 'cases/papirtegning-til-3d-foer', page: 'https://unsplash.com/photos/architectural-blueprints-with-drafting-tools-Yn8D5B8C-eY' },
  { file: 'cases/papirtegning-til-3d-efter', page: 'https://unsplash.com/photos/black-flat-screen-computer-monitor-hoivM01c-vg' },
  { file: 'cases/produktide-til-produktion-foer', page: 'https://unsplash.com/photos/open-notebook-with-pen-and-pencils-on-desk-n9AaeihA9HI' },
  { file: 'cases/produktide-til-produktion-efter', page: 'https://unsplash.com/photos/man-welding-a-black-metal-GAEvM4qvlBk' },
  { file: 'om/arbejdsplads', page: 'https://unsplash.com/photos/desk-with-laptop-blueprints-and-tools-0dhIl78b__o' },
] as const;
