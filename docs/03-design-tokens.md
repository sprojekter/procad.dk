# 3. Design tokens

Defineret i `src/styles/global.css` (CSS-variabler + Tailwind `@theme`).

## Retning

**Tegningsarket.** Sitet ser ud som en præcis arbejdstegning: fint gitter, tynde sorte linjer, målepile, koordinater og tegningshoved. Logoets sekskant og tykke konturer går igen i små detaljer (badges, procestrin, knapkanter, hård forskudt skygge). Orange bruges sparsomt – som "markeringen" en tegner sætter på det vigtige.

Ét element må være det spektakulære: **den animerede arbejdstegning i hero**, der tegnes op én gang. Alt andet er roligt.

## Farver

| Token | Hex | Brug |
|---|---|---|
| `--c-orange` | `#FF7621` | CTA-baggrund, accenter, bukkelinje, fokusring. **Aldrig** som brødtekst på hvid |
| `--c-black` | `#000000` | Konturer, overskrifter, tekst på orange |
| `--c-graphite` | `#111111` | Brødtekst, mørke sektioner |
| `--c-white` | `#FFFFFF` | Baggrund |
| `--c-paper` | `#F4F4F2` | Lyse flader, tegningspapir |
| `--c-rule` | `#DCDCD6` | Gitterlinjer (hver 5.) og skillelinjer |
| `--c-steel` | `#55595D` | Sekundær tekst på lys baggrund |
| `--c-steel-light` | `#A9ADB1` | Sekundær tekst på mørk baggrund |

### Kontrast (WCAG 2.1)

| Forgrund / baggrund | Ratio | AA |
|---|---|---|
| Sort på orange (knapper) | 7,87:1 | ✓ |
| Hvid på orange | 2,67:1 | ✗ – bruges ikke |
| Grafit på hvid | 18,88:1 | ✓ |
| Grafit på papir | 17,15:1 | ✓ |
| Stål på hvid | 7,06:1 | ✓ |
| Stål på papir | 6,41:1 | ✓ |
| Lys stål på grafit | 8,36:1 | ✓ |
| Orange på grafit | 7,07:1 | ✓ (ikoner/accenter) |
| Fejlrød #B00020 på hvid | 7,33:1 | ✓ |

## Typografi

| Rolle | Font | Vægt |
|---|---|---|
| Overskrifter | Barlow Condensed | 600, 700 |
| Brødtekst | DM Sans | 400, 500, 700 |
| Teknisk (mål, formater, tegningshoved) | IBM Plex Mono | 400, 500 |

Self-hostet via `@fontsource`. Skala (~1,25):

| Token | Størrelse |
|---|---|
| `--fs-xs` | 13 px |
| `--fs-sm` | 15 px |
| `--fs-base` | 17 px (linjehøjde 1,6) |
| `--fs-lg` | 20 px (lead) |
| `--fs-xl` | 24 px |
| `--fs-2xl` | 28–36 px |
| `--fs-3xl` | 34–52 px |
| `--fs-4xl` | 42–76 px (H1) |

Linjelængde: maks. 68 tegn (`--measure`). Overskrifter: linjehøjde 1,02, `text-wrap: balance`.

## Spacing

4 px-basis: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px (`--sp-1` … `--sp-32`).
Sektioner: `--section-y` = 64–120 px afhængigt af skærm.
Container: maks. 1216 px, sidemargen 16–40 px.

## Radius

| Token | Værdi | Brug |
|---|---|---|
| `--radius-none` | 0 | Alt strukturelt: knapper, rammer, kort – tegninger har skarpe hjørner |
| `--radius-field` | 2 px | Formularfelter |
| Sekskant | – | Badges, ikoner, procestrin, logo |

## Skygger

| Token | Værdi | Brug |
|---|---|---|
| `--shadow-hard` | `4px 4px 0 #000` | Hover på primærknap, hero-tegning, formularer |
| `--shadow-hard-orange` | `4px 4px 0 #FF7621` | Cookiebanner, hover på case-kort |

Ingen bløde/slørede skygger.

## Linjer

`--stroke` 2 px (rammer, knapper), `--stroke-heavy` 3 px (accenter). Stiplet = bukkelinje/forløb.

## Bevægelse

- Hero-tegningen tegnes op én gang (≈ 2,5 s).
- Procestrin og case-billeder glider diskret ind ved scroll (`.reveal`).
- Alt slås fra ved `prefers-reduced-motion: reduce`.
