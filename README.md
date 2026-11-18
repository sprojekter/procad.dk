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

Formularen bruges tre steder:
- som ark, der glider op fra knappen "Send fil" i bunden på mobil eller "Få et tilbud" i headeren på computer;
- indlejret på `/kontakt/`;
- indlejret øverst på hver ydelsesside.

Den har to trin: **1. Hvad skal laves** (ydelse, beskrivelse **eller** fil **eller** link, tidsplan) og **2. Hvem er du** (navn, e-mail, evt. telefon). Der er ingen samtykke-afkrydsning; der står i stedet en linje om behandling af oplysninger, da behandlingen sker for at besvare henvendelsen.

- **På Simply (standard ved deploy):** `PUBLIC_FORM_ENDPOINT=/api/tilbud.php` sættes automatisk af workflowet. PHP-maileren tager op til 15 MB og 15 filer, har honeypot og tidstjek mod spam og kræver `api/config.php` (se Deploy).
- **Andre steder (Pages/Vercel/Netlify):** FormSubmit `https://formsubmit.co/kontakt@procad.dk`. Første gang sendes en aktiveringsmail, som skal klikkes. Grænsen er 10 MB.

Ved succes sendes brugeren til `/tak/`, og `generate_lead` lægges i `dataLayer`.

## Lyst og mørkt tema

Sitet følger brugerens systemindstilling (lyst/mørkt) og har en temaknap i headeren; valget huskes i browseren. Farverne er CSS-variabler i `src/styles/global.css` (`:root` = lyst, `:root[data-theme="dark"]` = mørkt). Brug altid variablerne – aldrig faste farver – så begge temaer virker.

## 3D-model og fotos

- Forsidens 3D-model (`src/components/Model3D.astro` + `src/scripts/bracket3d.ts`, three.js) indlæses kun på computer (≥1024 px), efter siden er færdig, og kun med WebGL. På mobil, med datasparetilstand eller "reducer bevægelse" vises stregtegningen.
- Ydelsesbillederne er midlertidige fotos fra Unsplash (gratis licens) – se `src/data/photos.ts`. De hentes ved build (`npm run photos`) og ligger lokalt på serveren, så der kaldes ikke eksterne servere før samtykke. Erstat dem med egne billeder ved at ændre `image.src` i `src/content/ydelser/*.md`.

## Deploy – Simply.com webhotel (automatisk fra GitHub)

**Upload ikke hele projektmappen til Simply.** Mappen er kildekode. Webserveren skal kun have det færdigbyggede site (indholdet af `dist/`), og det klarer GitHub automatisk.

Sådan virker det: Når kunden har godkendt, kører du **Actions → "Deploy til Simply.com" → Run workflow** og skriver `UDGIV`. Workflowet `.github/workflows/deploy-simply.yml` bygger sitet og uploader kun ændrede filer til `public_html/` via krypteret FTP (FTPS). Almindelige push opdaterer kun forhåndsvisningen på GitHub Pages – intet går live af sig selv.

### Engangsopsætning (ca. 15 min)

1. **Simply-kontrolpanel → Webhotel → FTP:** notér FTP-server, brugernavn og adgangskode. Opret evt. en separat FTP-bruger kun til deploy.
2. **GitHub → repoet → Settings → Secrets and variables → Actions:**
   - Under *Secrets*: `SIMPLY_FTP_HOST`, `SIMPLY_FTP_USER`, `SIMPLY_FTP_PASSWORD`
   - Under *Variables* (valgfrit):
     - `SIMPLY_SERVER_DIR`: standard er `./public_html/`. Ret hvis Simply viser en anden webrod, fx `./procad.dk/public_html/`.
     - `PUBLIC_GTM_ID`
     - `BLOCK_PLACEHOLDERS=true`: stopper deploy, så længe der står `[UDFYLD]` på sitet. Slå den til før lancering.
3. **Formularens mailopsætning:** kopiér `public/api/config.sample.php` til `config.php`, udfyld modtager- og afsenderadresse, og upload den **manuelt én gang** via Simplys filhåndtering/FTP til `public_html/api/config.php`. Den ligger aldrig i Git, og deploy overskriver den aldrig.
4. **Opret mailkontoen** `noreply@procad.dk` hos Simply (bruges som afsender), og tjek at domænets SPF-record inkluderer Simply. Ellers kan tilbudsmails havne i spam.
5. **Slå SSL til** (Let's Encrypt, gratis) i kontrolpanelet.
6. GitHub → **Actions → "Deploy til Simply.com" → Run workflow**, skriv `UDGIV`. Første upload tager et par minutter.
7. **Test:**
   - https://procad.dk, at http sendes videre til https, og www til uden www.
   - Send en tilbudsforespørgsel med en fil på 10–15 MB.
   - 404-siden.
   - Mobil og mørkt tema.
8. **Hvis store filer fejler:** upload en fil `info.php` med `<?php phpinfo();` til `api/`, og tjek `upload_max_filesize`/`post_max_size`. **Slet filen igen bagefter.** Simply tillader normalt de værdier, `public/api/.htaccess` sætter (16M/20M). Ellers ret grænsen i Simply-kontrolpanelet under PHP-indstillinger.

### Hvorfor ikke bare uploade mappen eller hoste lokalt?

- **Hele mappen ville ikke virke.** Der er ingen `index.html` i roden, kun `.astro`-kildefiler.
- **Det kan lække filer:** `.git`-historik, `.env`, docs og `node_modules` (op til flere hundrede MB).
- **Lokal hosting** (fra egen pc) kræver, at pc'en altid er tændt. Det giver også fast IP, sikkerhedsopdateringer og ingen SLA. Det er et webhotel til ~30 kr./md. bedre til.

### GitHub Pages (kun forhåndsvisning)

`.github/workflows/deploy.yml` opdaterer forhåndsvisningen ved hvert push til `main` (kræver Settings → Pages → Source: **GitHub Actions**). Forhåndsvisningen er sat til `noindex`, så Google ikke indekserer en kopi. Formularen bruger FormSubmit der (10 MB).

### Vercel/Netlify (alternativ)

`vercel.json` og `netlify.toml` ligger klar. Peg DNS i Simply derhen, men **rør ikke MX-records** (e-mail). Formularen skal så bruge FormSubmit, da PHP ikke kører der.

## Google Tag Manager, GA4 og Consent Mode v2

- Sæt `PUBLIC_GTM_ID`. Indtil brugeren har givet samtykke, indlæses GTM **ikke** ("basic" Consent Mode – den sikre løsning i Danmark).
- Standardsamtykke sættes til `denied` for alle fire Consent Mode v2-signaler, og opdateres når brugeren vælger.
- Konvertering: opret i GTM en trigger på Custom Event `generate_lead` og brug den til GA4-hændelsen `generate_lead` og Google Ads-konverteringen.
- Brugeren kan altid ændre valget via "Cookie-indstillinger" i footeren.

Se `docs/05-seo-og-marketing.md` for trin-for-trin-opsætning.

## Kvalitet

Mål: Lighthouse 95+ i alle fire kategorier. Fonte er self-hostede via `@fontsource`, ingen tredjepartsscripts før samtykke, billeder i AVIF/WebP, alt statisk HTML.
