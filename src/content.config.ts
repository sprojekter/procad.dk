import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const media = z.object({
  src: z.string().optional(),          // fx /images/ydelser/arbejdstegninger.jpg – tom = pladsholder
  alt: z.string(),
  spec: z.string().optional(),
  motif: z.string().optional(),
  prompt: z.string().optional(),       // AI-billedprompt (Higgsfield m.fl.)
});

// Ydelser: én markdown-fil pr. ydelse i src/content/ydelser/. Filnavnet bliver URL'en.
const ydelser = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ydelser' }),
  schema: z.object({
    title: z.string(),
    navTitle: z.string(),
    navDescription: z.string(),
    order: z.number(),
    metaTitle: z.string(),
    metaDescription: z.string().max(170),
    keywords: z.array(z.string()),
    problem: z.string(),
    h1: z.string(),
    intro: z.string(),
    deliverables: z.array(z.string()),
    formats: z.array(z.string()).default([]),
    image: media,
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

// Cases: én markdown-fil pr. case i src/content/cases/.
const cases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    metaDescription: z.string().max(170),
    summary: z.string(),
    customer: z.string(),           // fx "Smedeværksted på Sjælland" (kun navn med tilladelse)
    industry: z.string(),
    service: z.string(),            // id på en ydelse, fx "arbejdstegninger"
    year: z.number(),
    example: z.boolean().default(false), // true = eksempel/skabelon, vises med markering
    featured: z.boolean().default(false),
    order: z.number().default(99),
    challenge: z.string(),
    solution: z.string(),
    result: z.string(),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    before: media,
    after: media,
    gallery: z.array(media).default([]),
    quote: z.object({ text: z.string(), name: z.string(), role: z.string() }).optional(),
  }),
});

export const collections = { ydelser, cases };
