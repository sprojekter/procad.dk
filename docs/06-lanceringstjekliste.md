# 6. Lanceringstjekliste

## Indhold
- [ ] Alle `[UDFYLD]` er erstattet (søg i projektet efter `UDFYLD` – se `08-det-skal-ejeren-levere.md`)
- [ ] Endeligt logo er valgt; `logo.svg`, `logo-hvid.svg`, `favicon.svg` og `og.png` er opdateret
- [ ] Portræt af ejeren er lagt ind på /om/
- [ ] Mindst 3 cases med rigtige før/efter-billeder (eller eksempel-cases tydeligt markeret)
- [ ] Priser på /priser/ og i FAQ er bekræftet
- [ ] Privatlivspolitik og cookiepolitik er gennemlæst og dateret
- [ ] Al tekst er korrekturlæst

## Domæne og DNS (Simply.com)
- [ ] **A:** sitet ligger på Simply-webhotellet, ELLER A/CNAME peger på Vercel/Netlify
- [ ] `www.procad.dk` virker og viderestiller til `procad.dk`
- [ ] MX-records er uændrede – e-mail virker stadig (send en testmail ind og ud)
- [ ] SPF/DKIM er sat op for procad.dk, så formularmails ikke ender i spam
- [ ] TXT-record til Search Console er tilføjet

## SSL
- [ ] `https://procad.dk` har gyldigt certifikat
- [ ] `http://` viderestiller til `https://`
- [ ] Ingen "mixed content"-advarsler i browserkonsollen

## Formular
- [ ] `config.php` er uploadet (Simply) eller `PUBLIC_FORM_ENDPOINT` er sat (Vercel/Netlify)
- [ ] Test: udfyld alle felter + upload PDF, DXF, STEP og et foto (~10 MB) → mail modtages med vedhæftninger
- [ ] Test: for store filer (> 25 MB) giver en forståelig fejl
- [ ] Test: tomme felter giver fejlbeskeder ved felterne
- [ ] Test fra mobil
- [ ] Svar-til (Reply-To) i mailen er kundens adresse
- [ ] Omdirigering til /tak/ virker

## Analytics og samtykke
- [ ] `PUBLIC_GTM_ID` er sat, og sitet er bygget igen
- [ ] Cookiebanneret vises ved første besøg; "Kun nødvendige" indlæser ingen Google-scripts
- [ ] "Accepter alle" indlæser GTM; GA4 Realtime viser besøget
- [ ] Indsendt formular giver `generate_lead` i GA4 (DebugView) og i Google Ads
- [ ] "Cookie-indstillinger" i footeren åbner banneret igen

## Search Console og Google
- [ ] Domæne-ejendom verificeret
- [ ] Sitemap indsendt
- [ ] Google Business Profile oprettet og verificeret

## Kvalitet
- [ ] Lighthouse (Chrome DevTools, mobil) ≥ 95 i Performance, Accessibility, Best Practices og SEO på forside, én ydelsesside og /kontakt/
- [ ] Navigation kan bruges med tastatur alene (Tab, Enter, Escape lukker menu)
- [ ] Siderne ser rigtige ud i Chrome, Safari (iPhone) og Edge
- [ ] 404-siden virker (`/findes-ikke/`)
- [ ] Del forsiden på LinkedIn/Facebook → OG-billede vises (tjek evt. med LinkedIn Post Inspector)
- [ ] Alle links i footer og menu virker
