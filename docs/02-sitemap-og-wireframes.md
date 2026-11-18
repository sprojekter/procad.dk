# 2. Sitemap og wireframes

## Sitemap

```
/                                   Forside
├── /ydelser/                       Oversigt over ydelser
│   ├── /ydelser/arbejdstegninger/
│   ├── /ydelser/filklargoering/    DXF/STEP til laser, kantbuk, CNC
│   ├── /ydelser/3d-modellering/
│   └── /ydelser/teknisk-dokumentation/
├── /cases/                         Portefølje
│   └── /cases/[slug]/              Udfordring → løsning → resultat
├── /proces/                        Sådan arbejder jeg
├── /priser/                        Sådan prissætter jeg (mønster 10)
├── /om/                            Om ProCAD og ejeren
├── /faq/                           Pris, levering, filformater, NDA
├── /kontakt/                       Tilbudsformular + direkte kontakt
├── /tak/                           Bekræftelse (noindex)
├── /privatlivspolitik/
├── /cookiepolitik/
└── /404
```

Alle sider: sticky header med "Få tilbud", footer med kontakt og "Cookie-indstillinger", afsluttende CTA-sektion (ingen blindgyder). Undersider har brødkrummer.

## Fælles elementer

```
┌──────────────────────────────────────────────────────────────┐
│ [⬡P PROCAD]   Ydelser▾ Cases Proces Priser Om FAQ Kontakt [Få tilbud] │  sticky
└──────────────────────────────────────────────────────────────┘
  Ydelser▾ = mega-menu: 4 ydelser med kort beskrivelse + "Se alle ydelser"
  Mobil: [Menu]-knap → fuld liste, ydelser som undermenu, "Få tilbud" i bunden
```

## Forside

```
┌ HERO (tegningspapir-gitter) ─────────────────────────────────┐
│ ■ Venter produktionen på tegninger?   │ ┌─ animeret ark ────┐ │
│ PRODUKTIONSKLARE CAD-TEGNINGER        │ │ sidebillede,      │ │
│ TIL METALBEARBEJDNING                 │ │ udfoldning, mål,  │ │
│ Lead (værkstedstroværdighed)          │ │ tegningshoved     │ │
│ [Få et tilbud] [Se cases]             │ └───────────────────┘ │
├ TILLIDSBJÆLKE (grafit) ──────────────────────────────────────┤
│ ⬡ Software  ⬡ Filformater  ⬡ Svar inden 24 t  ⬡ NDA ved behov │
├ YDELSER: 2×2 tegningstabel (delte linjer, ikke kort) ────────┤
├ PROCES: 5 sekskanter på en stiplet linje ────────────────────┤
├ CASES: 3 × før|efter ────────────────────────────────────────┤
├ HVORFOR PROCAD: ark med baggrund + 3 samarbejdsformer A/B/C ─┤
├ FAQ-uddrag (5 spørgsmål, accordion) ─────────────────────────┤
└ CTA (grafit): "Send din tegning, skitse eller fil" + formular ┘
```

## Ydelsesside (= Google Ads-landingsside)

```
Mobil (formular over folden):        Desktop:
┌──────────────────────┐   ┌───────────────────────────┬─────────────────┐
│ brødkrummer          │   │ brødkrummer               │ ┌ Få en fast  ┐ │
│ ■ Problem            │   │ ■ Problem                 │ │ pris        │ │
│ H1                   │   │ H1                        │ │ navn, mail, │ │
│ kort lead            │   │ lead                      │ │ tlf, besk., │ │
│ ┌ Få en fast pris ─┐ │   │ ⬡24t ⬡fast pris ⬡NDA     │ │ upload      │ │
│ │ formular         │ │   └───────────────────────────┴─────────────────┘
│ └──────────────────┘ │   Indhold (prosa)            │ "Du får"-ark + billede
│ indhold …            │   Eksempler (cases) · FAQ · CTA (→ #tilbud)
└──────────────────────┘
```
Én handling: alle knapper på siden peger på formularen (#tilbud).

## /cases/[slug]

Brødkrummer → H1 + resumé → tegningshoved (kunde, branche, leveret, materiale, år) → før | efter → Udfordring · Løsning · Resultat → evt. citat → galleri → link til ydelsen → CTA.

## /proces/

5 trin i detaljer (venstre) + sticky "Det er godt at sende med" og samarbejdsformer (højre) → CTA.

## /om/

Portræt (4:5) + tegningshoved med fakta (sticky) | historie, hvorfor ProCAD, hvad du kan forvente, uddannelse og erfaring → CTA.

## /priser/

Tre prismodeller side om side (fast pris fremhævet i orange) → hvad påvirker prisen / hvad er med → eksempeltabel → CTA.

## /faq/

Emne-knapper (Pris, Levering, Filformater og standarder, Fortrolighed, Samarbejde) → grupper med accordion → CTA.

## /kontakt/

Fuld formular (venstre) | direkte kontakt, firmaoplysninger og løfter (højre).
