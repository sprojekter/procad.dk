# ProCAD – procad.dk

Hjemmeside for ProCAD: CAD-tegninger og teknisk dokumentation til metalbearbejdning.
Bygget med **Astro 5 + Tailwind CSS 4** som et statisk site. Indhold (ydelser og cases) ligger i Markdown, så det er let at rette og udvide.

> Alt markeret **[UDFYLD]** skal ejeren levere eller bekræfte før lancering. Se `docs/08-det-skal-ejeren-levere.md`.

---

## Kom i gang

Kræver [Node.js 20+](https://nodejs.org) (LTS anbefales).

```bash
npm install        # installér afhængigheder (første gang)
npm run dev        # udviklingsserver på http://localhost:4321
npm run build      # byg det færdige site til mappen dist/
npm run preview    # se det byggede site lokalt
npm run images     # lav AVIF/WebP af billeder i public/images/
npm run check      # typetjek af koden (valgfrit)
```

Kopiér `.env.example` til `.env` og udfyld (GTM-id, formular-endpoint, Turnstile).

## Mappestruktur

```
src/
  content/
    ydelser/          ← én .md-fil pr. ydelse (filnavn = URL)
    cases/            ← én .md-fil pr. case
  data/
    site.ts           ← firmaoplysninger, telefon, e-mail, software, menu
    faq.ts            ← spørgsmål og svar
    process.ts        ← de 5 procestrin
  components/         ← header, footer, formular, cookiebanner m.m.
  layouts/BaseLayout.astro  ← <head>, SEO, schema, Consent Mode
  pages/              ← sider (forside, om, kontakt, priser …)
  styles/global.css   ← design tokens og fælles stilarter
public/
  api/tilbud.php      ← formular-mailer til Simply.com
  images/             ← billeder (cases/, ydelser/, om/, hero/)
  logo.svg, favicon.svg, og.png, robots.txt, .htaccess
docs/                 ← analyse, wireframes, tokens, billeder, SEO, tjeklister
```

## Redigér tekst

| Hvad | Hvor |
|---|---|
| Telefon, e-mail, CVR, adresse, navn, software | `src/data/site.ts` |
| Ydelsessider | `src/content/ydelser/*.md` |
| FAQ | `src/data/faq.ts` |
| Proces | `src/data/process.ts` |
| Forsiden | `src/pages/index.astro` |
| Om, Priser, Kontakt, politikker | `src/pages/*.astro` |

Teksten i `.md`-filerne er almindelig Markdown. Øverst (mellem `---`) står felter som titel, meta-beskrivelse og søgeord – ret værdierne, men behold feltnavnene.

## Tilføj en case

1. Kopiér `src/content/cases/beslag-fra-haandskitse.md` til fx `src/content/cases/rammestel-til-transportbaand.md`. Filnavnet bliver URL'en: `/cases/rammestel-til-transportbaand/`.
2. Ret felterne. Sæt `example: false` og `featured: true`, hvis casen skal på forsiden (de 3 med lavest `order` vises).
3. Læg billeder i `public/images/cases/`, fx `rammestel-foer.jpg` og `rammestel-efter.jpg`, og skriv stierne i `before.src` og `after.src`:
   ```yaml
   before:
     src: /images/cases/rammestel-foer.jpg
     alt: Håndskitse af rammestellet
   ```
4. Kør `npm run images` (laver .avif/.webp) og derefter `npm run build`.
5. Slet de tre eksempel-cases, når der er rigtige cases nok.

**Husk:** kundens navn og billeder må kun vises med tilladelse.

## Tilføj en ydelse

Kopiér en fil i `src/content/ydelser/`, giv den et nyt filnavn (uden æøå, fx `svejsetegninger.md`) og ret indholdet. Den kommer automatisk i menuen, på /ydelser/, i footeren og i formularens valgliste. Tilføj også navnet i `$ydelser` i `public/api/tilbud.php`, så mailen viser det pæne navn.

## Billeder

- Læg originaler (JPG/PNG) i `public/images/...` og kør `npm run images`.
- Komponenten `Media` viser automatisk AVIF → WebP → JPG og lazy-loader billeder.
- Uden billede vises en pladsholder med specifikation. Se `docs/04-billeder-og-video.md` for formater og AI-prompts.

## Tilbudsformularen

Formularen sender som almindelig formular (med filer) til `PUBLIC_FORM_ENDPOINT`. Ved succes sendes brugeren til `/tak/`, og `generate_lead` lægges i `dataLayer`.

**Standard: FormSubmit (virker på GitHub Pages, Vercel og Netlify – gratis, ingen konto):**
1. Sæt variablen `PUBLIC_FORM_ENDPOINT` til `https://formsubmit.co/DIN@EMAIL.DK`
   (GitHub: Settings → Secrets and variables → Actions → Variables. Lokalt: `.env`).
2. Byg/push, og send én testforespørgsel fra sitet.
3. FormSubmit sender en **aktiveringsmail** til adressen – klik på linket. Først derefter kommer forespørgsler igennem (filer fra før aktivering gemmes ikke).
4. Valgfrit: FormSubmit giver dig bagefter en tilfældig kode, som kan bruges i stedet for e-mailen i URL'en.
Grænse: 10 MB filer i alt pr. forespørgsel (formularen viser en måler og advarer).

**Simply.com (PHP 8.1+, op til 25 MB):** sæt `PUBLIC_FORM_ENDPOINT=/api/tilbud.php`, kopiér `public/api/config.sample.php` til `config.php`, udfyld og upload via FTP.

UX: ydelse vælges med knapper, filer kan trækkes ind og fjernes enkeltvis, felter valideres, når man forlader dem, og en kladde gemmes lokalt i browseren, hvis siden lukkes.

## Lyst og mørkt tema

Sitet følger brugerens systemindstilling (lyst/mørkt) og har en temaknap i headeren; valget huskes i browseren. Farverne er CSS-variabler i `src/styles/global.css` (`:root` = lyst, `:root[data-theme="dark"]` = mørkt). Brug altid variablerne – aldrig faste farver – så begge temaer virker.

## 3D-model og fotos

- Forsidens 3D-model (`src/components/Model3D.astro` + `src/scripts/bracket3d.ts`, three.js) indlæses først, når den er synlig. Uden WebGL eller med "reducer bevægelse" vises stregtegningen.
- Ydelsesbillederne er midlertidige fotos fra Unsplash (gratis licens) – se `src/data/photos.ts`. Erstat dem med egne billeder ved at ændre `image.src` i `src/content/ydelser/*.md`.

## Deploy

### Mulighed A – Simply.com webhotel via FTP

1. `npm run build`
2. Åbn FileZilla (eller anden FTP-klient). FTP-oplysninger findes i Simply.com-kontrolpanelet under **Webhotel → FTP**.
3. Upload **indholdet** af `dist/` til `public_html/` (ikke selve mappen `dist`). Husk de skjulte filer `.htaccess` og `api/.htaccess`.
4. Upload `api/config.php` (se ovenfor).
5. Slå SSL til i kontrolpanelet (Let's Encrypt er gratis hos Simply).
6. Test: https://procad.dk, http→https, www→uden www, formularen, 404-siden.

Ved opdateringer: byg igen og upload `dist/` igen (overskriv). Slet gamle filer i `_astro/` en gang imellem.

### Mulighed B – Vercel eller Netlify med DNS fra Simply.com

1. Push repoet til GitHub.
2. **Vercel:** "Add New Project" → vælg repoet → framework Astro registreres automatisk.
   **Netlify:** "Add new site" → "Import from Git" → `netlify.toml` sørger for resten.
3. Sæt miljøvariabler (`PUBLIC_GTM_ID`, `PUBLIC_FORM_ENDPOINT`, `PUBLIC_TURNSTILE_SITE_KEY`).
4. Tilføj domænet `procad.dk` og `www.procad.dk` i Vercel/Netlify.
5. I Simply.com-kontrolpanelet → **DNS**: ret records som Vercel/Netlify angiver. Typisk:
   - Vercel: `A @ 76.76.21.21` og `CNAME www cname.vercel-dns.com`
   - Netlify: `A @ 75.2.60.5` og `CNAME www <dit-site>.netlify.app`
   (Brug altid de værdier, platformen viser – de kan ændre sig.)
   **Rør ikke MX-records**, så e-mail hos Simply bliver ved med at virke.
6. Vent på DNS (minutter til få timer). SSL udstedes automatisk.
7. Hver gang der pushes til `main`, bygges og udgives sitet automatisk.

### Mulighed C – GitHub Pages (gratis, god til forhåndsvisning)

Workflowet `.github/workflows/deploy.yml` bygger og udgiver sitet ved hvert push til `main`.

1. GitHub → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Uden eget domæne ligger sitet på `https://sprojekter.github.io/procad.dk/` (base-stien sættes automatisk).
3. Eget domæne: opret filen `public/CNAME` med indholdet `procad.dk`, og sæt i Simply.com → DNS:
   `A @ 185.199.108.153`, `A @ 185.199.109.153`, `A @ 185.199.110.153`, `A @ 185.199.111.153` og `CNAME www sprojekter.github.io`.
   Skriv domænet under Settings → Pages → Custom domain, og slå **Enforce HTTPS** til.
4. PHP kører ikke på GitHub Pages: sæt formularen til Formspree/Basin under
   **Settings → Secrets and variables → Actions → Variables** → `PUBLIC_FORM_ENDPOINT`.
   Samme sted kan `PUBLIC_GTM_ID` og `PUBLIC_TURNSTILE_SITE_KEY` sættes.

## Google Tag Manager, GA4 og Consent Mode v2

- Sæt `PUBLIC_GTM_ID`. Indtil brugeren har givet samtykke, indlæses GTM **ikke** ("basic" Consent Mode – den sikre løsning i Danmark).
- Standardsamtykke sættes til `denied` for alle fire Consent Mode v2-signaler, og opdateres når brugeren vælger.
- Konvertering: opret i GTM en trigger på Custom Event `generate_lead` og brug den til GA4-hændelsen `generate_lead` og Google Ads-konverteringen.
- Brugeren kan altid ændre valget via "Cookie-indstillinger" i footeren.

Se `docs/05-seo-og-marketing.md` for trin-for-trin-opsætning.

## Kvalitet

Mål: Lighthouse 95+ i alle fire kategorier. Fonte er self-hostede via `@fontsource`, ingen tredjepartsscripts før samtykke, billeder i AVIF/WebP, alt statisk HTML.
