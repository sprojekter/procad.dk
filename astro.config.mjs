// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Alle URL'er ender på "/" (fx /ydelser/arbejdstegninger/).
// Det virker ens på Simply.com (Apache), Vercel og Netlify.
export default defineConfig({
  site: process.env.SITE_URL || 'https://procad.dk',
  base: process.env.SITE_BASE || undefined,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !/\/(tak|404)\/?$/.test(page),
      i18n: { defaultLocale: 'da', locales: { da: 'da-DK' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  // Henter næste side, når musen hviler på et link (hurtigere sideskift)
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
