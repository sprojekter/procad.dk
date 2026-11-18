# 5. SEO og fremtidig markedsføring

## Teknisk SEO (er bygget ind)

- Unik `<title>` og meta description på alle sider
- Canonical-tag på alle sider (`https://procad.dk/...` med afsluttende `/`)
- Open Graph + Twitter-kort med `og.png`
- `sitemap-index.xml` genereres automatisk ved build (uden /tak/ og 404)
- `robots.txt` (blokerer /api/ og /tak/)
- Schema.org (JSON-LD):
  - `ProfessionalService` (Organization) på alle sider
  - `Service` på hver ydelsesside
  - `FAQPage` på /faq/, forsiden og ydelsessider med FAQ
  - `BreadcrumbList` på alle undersider
  - `Person` på /om/
- Pæne danske URL'er uden æøå (`/ydelser/filklargoering/`)
- Statisk HTML, self-hostede fonte, lazy-loadede AVIF/WebP-billeder

## Søgeordsforslag pr. side

Volumen er lav i Danmark for nicheord – det er fint. Køberne er få, men har høj købsintention. Bekræft volumen i Google Ads' søgeordsplanlægger, når kontoen er oprettet.

| Side | Primært søgeord | Sekundære |
|---|---|---|
| Forside | CAD-tegner metal | CAD-konsulent, tegnestue metal, CAD-tegninger til produktion, teknisk tegner freelance |
| /ydelser/arbejdstegninger/ | arbejdstegninger | arbejdstegning metal, produktionstegninger, teknisk tegning metal, svejsetegning |
| /ydelser/filklargoering/ | DXF-filer til laserskæring | DXF klargøring, udfoldning pladedel, bukkeplan, STEP-fil til CNC, DXF til plasmaskæring |
| /ydelser/3d-modellering/ | 3D-modellering | konvertering af tegninger til CAD, skitse til CAD, digitalisering af gamle tegninger, 3D-model reservedel |
| /ydelser/teknisk-dokumentation/ | stykliste | teknisk dokumentation, samlingsvejledning, tegningsunderlag CE |
| /priser/ | pris CAD-tegning | hvad koster en arbejdstegning, CAD-tegner timepris |
| /cases/ | CAD-tegning eksempel | før og efter CAD |
| /om/ | CAD-tegner [by] | freelance CAD-tegner Danmark |

Lokal SEO: tilføj by/region i /om/ og Google Business Profile.

## Google Ads-klar

Hver ydelsesside er en landingsside:
- Én handling: alle knapper peger på formularen på siden (`#tilbud`)
- Formularen ligger over folden på mobil (kort version: navn, firma, e-mail, telefon, beskrivelse, upload)
- Problem-overskrift matcher annoncens søgeord
- Hurtig indlæsning (statisk side)

**Forslag til første kampagne:** én søgekampagne med fire annoncegrupper (én pr. ydelse), eksakt/frase-match på søgeordene ovenfor, geografi Danmark, budget [UDFYLD]. Negative søgeord: *gratis, kursus, uddannelse, job, løn, download, program*.

## GA4 + Google Tag Manager (Consent Mode v2)

1. Opret GA4-ejendom og GTM-container (Web) på [tagmanager.google.com](https://tagmanager.google.com).
2. Sæt `PUBLIC_GTM_ID=GTM-XXXXXXX` (i `.env` eller hos Vercel/Netlify) og byg igen.
3. I GTM:
   - **Admin → Container settings → Enable consent overview.**
   - Tag: *Google tag* med GA4-måle-id, trigger *Initialization – All Pages*. Consent: kræver `analytics_storage`.
   - Trigger: *Custom Event* = `generate_lead`.
   - Tag: *GA4 Event* `generate_lead` med parametre `ydelse` og `side` (Data Layer Variables) → trigger ovenfor.
   - Tag: *Google Ads Conversion Tracking* → samme trigger. Consent: kræver `ad_storage`.
   - Tag: *Conversion Linker* → All Pages.
4. I GA4: markér `generate_lead` som **nøglebegivenhed** (konvertering).
5. Test med GTM Preview: afvis cookies → intet indlæses. Accepter → GA4 indlæses, og formularen sender `generate_lead`.

Sitet sender også `consent_update` og (på /tak/) `lead_thankyou_view` til dataLayer.

## Tjekliste: Google Business Profile

- [ ] Opret profil på [business.google.com](https://business.google.com) med navnet **ProCAD**
- [ ] Kategori: *Ingeniør* / *Tegnestue* (vælg den mest præcise) + sekundær *Konsulent*
- [ ] Servicevirksomhed uden fysisk butik: skjul adresse, angiv serviceområde (Danmark eller regioner)
- [ ] Telefon, website `https://procad.dk`, åbningstider
- [ ] Beskrivelse (750 tegn) med søgeordene: arbejdstegninger, DXF, 3D-modellering, metal
- [ ] Ydelser: tilføj de fire ydelser med beskrivelse
- [ ] Billeder: logo, portræt, 3–5 billeder af arbejde (før/efter)
- [ ] Verificér profilen (video eller postkort)
- [ ] Bed de første 3–5 tilfredse kunder om en anmeldelse
- [ ] Læg et opslag op ved hver ny case

## Tjekliste: Google Search Console

- [ ] Tilføj ejendom af typen **Domæne** (`procad.dk`) på [search.google.com/search-console](https://search.google.com/search-console)
- [ ] Verificér via TXT-record i Simply.com → DNS
- [ ] Indsend sitemap: `https://procad.dk/sitemap-index.xml`
- [ ] Tjek "Sider" efter 3–7 dage: alle vigtige sider skal være indekseret
- [ ] Brug URL-inspektion → "Anmod om indeksering" på forsiden og ydelsessiderne
- [ ] Tjek "Forbedringer": brødkrummer og FAQ uden fejl
- [ ] Forbind Search Console med GA4 (GA4 → Admin → Produktlinks)
