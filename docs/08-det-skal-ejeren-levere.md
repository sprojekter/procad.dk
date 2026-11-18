# 8. Det skal ejeren levere

Udfyld listen og send den tilbage (eller ret direkte i filerne). Alle steder er markeret **[UDFYLD]** i koden – søg efter ordet i VS Code (Ctrl+Shift+F) for at finde dem.

## Firma og kontakt → `src/data/site.ts`

- [ ] Fulde navn og fornavn
- [ ] E-mailadresse (bekræft `kontakt@procad.dk`)
- [ ] Telefonnummer
- [ ] CVR-nummer
- [ ] Adresse, postnr., by (vises på /kontakt/ – eller skal kun byen stå der?)
- [ ] Åbningstider / hvornår du kan kontaktes (`src/pages/kontakt.astro`)
- [ ] LinkedIn-side (valgfri)

## Software og formater

- [ ] Hvilke CAD-programmer bruger du? (nu står der SolidWorks, Inventor, AutoCAD)
- [ ] Hvilke filformater og versioner leverer du? (fx DXF R2013, STEP AP214) → `filklargoering.md`

## Baggrund og erfaring → `src/pages/om.astro` + forsiden

- [ ] 2–3 sætninger om din baggrund til forsiden ("Tegnet af en, der har stået ved maskinen")
- [ ] Din historie: uddannelse, værksteder, maskiner du har arbejdet med, antal år
- [ ] Hvorfor startede du ProCAD?
- [ ] Tidslinje: uddannelse, ansættelser, kurser/certificeringer
- [ ] Typiske emner, du har tegnet (`arbejdstegninger.md`, sidste afsnit)

## Priser og vilkår → `src/pages/priser.astro`, `src/data/faq.ts`, `src/data/process.ts`

- [ ] Timepris (ekskl. moms)
- [ ] Timebank: antal timer og pris
- [ ] "Fra"-pris for en enkel arbejdstegning
- [ ] 4 eksempelpriser i tabellen på /priser/
- [ ] Typisk leveringstid på enkle opgaver (nu: 1–3 hverdage)
- [ ] Antal rettelsesrunder inkluderet (nu: op til 2)
- [ ] Rettigheder: overgår tegninger/filer til kunden ved betaling?
- [ ] Standard-NDA (link eller vedhæftning)

## Cases → `src/content/cases/`

For hver case (mindst 3):
- [ ] Kundens tilladelse til at vise opgaven (og evt. navn)
- [ ] Før-billede (skitse, gammel tegning, foto)
- [ ] Efter-billede (din tegning/model – anonymisér kundedata)
- [ ] Udfordring, løsning, resultat med dine egne ord
- [ ] Leveringstid og hvad der blev leveret
- [ ] Evt. citat fra kunden

## Billeder → se `04-billeder-og-video.md`

- [ ] Portræt af dig (rigtigt foto, 4:5)
- [ ] 4 billeder til ydelsessiderne (eller godkend AI-genererede)
- [ ] Evt. hero-video

## Logo → se `07-logo.md`

- [ ] Vælg: nyt forslag ("Det bukkede P") eller det oprindelige logo
- [ ] Ved det oprindelige: lever det som SVG

## Juridisk → `privatlivspolitik.astro`, `cookiepolitik.astro`

- [ ] Hvor længe gemmes forespørgsler, der ikke bliver til en opgave? (forslag: 12 måneder)
- [ ] Hvor længe gemmes kundens filer efter en opgave?
- [ ] Liste over leverandører (hosting, mail, Google, evt. Formspree/Basin)
- [ ] Datoer for "senest opdateret"

## Konti og adgang (til opsætning)

- [ ] Adgang til Simply.com-kontrolpanel (DNS, FTP, e-mail)
- [ ] Google-konto til GA4, Tag Manager, Search Console, Business Profile og Ads
- [ ] Valg af hosting: (a) Simply.com-webhotel eller (b) Vercel/Netlify
