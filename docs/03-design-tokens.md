# 3. Design tokens (v2)

Den fulde brandmanual ligger som Design System i Claude (link i `LÆS-MIG.md`) og som PDF i kundemappen. Tokens er defineret i `src/styles/global.css`.

## Retning

Moderne og roligt, inspireret af Apple, Linear, Resend og Zaro: én font (Inter), masser af luft, 1 px linjer, bløde hjørner, lave skygger. Orange er en accent, ikke en flade. Det eneste, der fanger blikket, er hero-illustrationen: en isometrisk stregtegning af et bukket beslag over sin udfoldning.

## Farver

| Token | Hex | Brug |
|---|---|---|
| `--c-ink` | #0E0E10 | Overskrifter, primærknap, mørke sektioner |
| `--c-body` | #2B2B30 | Brødtekst |
| `--c-muted` | #6B6B70 | Sekundær tekst (4,9:1 på paper) |
| `--c-paper` | #F7F7F5 | Sidebaggrund |
| `--c-white` | #FFFFFF | Kort |
| `--c-line` / `--c-line-strong` | #E7E6E2 / #D6D4CE | 1 px linjer |
| `--c-field` | #8C8A84 | Kant på formularfelter (3,4:1) |
| `--c-orange` | #FF7621 | Accent – aldrig tekst på lys baggrund |
| `--c-orange-soft` | #FFE7D6 | Markering bag tekst |

## Typografi

Inter Variable (self-hostet via `@fontsource-variable/inter`) og JetBrains Mono til tekniske detaljer.
H1 64–80 px / 600 / −4 %, H2 56 px / 600 / −3,5 %, H3 20–24 px / 600, lead 20 px, brødtekst 17 px / 1,6.

## Spacing, radius og skygger

- Spacing: 4 px-basis. Sektioner 72–144 px lodret.
- Radius: 8 (tags), 12 (knapper og felter), 20 (kort), 28 (paneler), pille 999.
- Skygger: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, alle lave og bløde.

## Bevægelse

Hero-illustrationen glider roligt ind, og trinmarkøren skifter hvert 3. sekund. Enkelte elementer glider diskret ind ved scroll. Alt slås fra ved `prefers-reduced-motion`.
