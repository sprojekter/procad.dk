# 4. Billeder og video – specifikationer og AI-prompts

**Princip:** rigtige fotos af ejeren og rigtigt arbejde slår altid AI-billeder. Brug AI-prompts til stemningsbilleder og som midlertidige pladsholdere – aldrig som "før/efter" i en case, der præsenteres som ægte, og aldrig som portræt.

Alle billeder lægges i `public/images/<mappe>/` som JPG/PNG og konverteres med `npm run images`. Prompts er på engelsk, da Higgsfield AI og lignende værktøjer giver bedst resultat sådan.

## Hero-video (valgfri – erstatter/supplerer den animerede tegning)

| | Desktop | Mobil |
|---|---|---|
| Format | 16:9, 1920×1080 | 9:16, 1080×1920 |
| Længde | 5–8 sek., sømløst loop | 5–8 sek., sømløst loop |
| Fil | MP4 (H.264) + WebM, maks. 2,5 MB, ingen lyd | MP4 + WebM, maks. 2 MB |
| Placering | `public/images/hero/hero-16x9.mp4` | `public/images/hero/hero-9x16.mp4` |
| Poster | `hero-16x9.jpg` (første frame) | `hero-9x16.jpg` |

**Motiv:** En linjetegning af et pladeemne tegnes på skærmen og glider over i det rigtige, laserskårne og bukkede emne på en arbejdsbænk.

**Prompt (16:9):**
> Slow cinematic dolly shot over a steel workbench: a thin black CAD line drawing of a bent sheet metal bracket with dimension arrows gradually materializes on white paper, then the same bracket appears as a real laser-cut and press-brake-bent steel part lying on the drawing, soft daylight from the side, subtle orange accent light, shallow depth of field, precise industrial mood, no people, no text, seamless 6-second loop

**Prompt (9:16):** samme, tilføj: *vertical framing, part centered in lower third*.

Indsæt i `src/pages/index.astro` i stedet for `<HeroDrawing />`:
```html
<video autoplay muted loop playsinline poster="/images/hero/hero-16x9.jpg" class="hero-video">
  <source src="/images/hero/hero-9x16.mp4" type="video/mp4" media="(max-width: 640px)" />
  <source src="/images/hero/hero-16x9.webm" type="video/webm" />
  <source src="/images/hero/hero-16x9.mp4" type="video/mp4" />
</video>
```
Respektér reduced motion: vis kun poster-billedet, hvis `prefers-reduced-motion` er sat.

## Ydelsessider (4 billeder)

Fælles: **3:2, 1600×1067 px**, JPG/PNG, `public/images/ydelser/`. Ingen personer, et lille orange element må gerne indgå.

| Fil | Motiv | Prompt |
|---|---|---|
| `arbejdstegninger.jpg` | Print af arbejdstegning med svejsesymboler på stålbord | Close-up of a printed technical engineering drawing of a welded steel bracket on a workshop steel table, dimension lines, weld symbols, title block corner visible, a steel ruler and pencil beside it, soft daylight, shallow depth of field, neutral greys with a small orange accent, realistic photo, no people |
| `filklargoering.jpg` | Skærm med udfoldning + færdigbukket emne | A laser-cut and press-brake-bent stainless steel sheet metal part on a workbench in front of a monitor showing its flat pattern CAD drawing with dashed bend lines, industrial workshop softly blurred, cool daylight, crisp metal reflections, small orange accent, realistic, no people |
| `3d-modellering.jpg` | Gammel papirtegning + 3D-model på skærm | Split composition: an old yellowed paper engineering drawing with pencil corrections on the left, a monitor showing a clean grey 3D CAD model of the same machined steel part on the right, calipers on the desk, natural light, realistic, one orange accent, no people |
| `teknisk-dokumentation.jpg` | Samlingstegning med stykliste + ringbind | Top-down photo of a printed exploded-view assembly drawing with balloon numbers and a bill of materials table, next to a black ring binder and a pen on a light grey desk, crisp even lighting, one orange sticky tab, realistic, no people |

Når filen findes, tilføj `src: /images/ydelser/<fil>.jpg` under `image:` i ydelsens `.md`-fil.

## Cases – før/efter (2 pr. case)

Fælles: **4:3, 1600×1200 px**, `public/images/cases/`. Brug **rigtige** billeder af kundens materiale og din tegning (med tilladelse, anonymisér kundedata). Prompts i case-filerne er kun til eksempel-cases.

| Case | Før | Efter |
|---|---|---|
| Beslag fra håndskitse | Foto af skitsen på pap | Eksport af færdig arbejdstegning (PNG) |
| Papirtegning til 3D | Scanning/foto af gammel tegning | Render/skærmbillede af 3D-model |
| Produktidé | Papmodel og skitser | Færdigt emne på tegningen |

Tip til "efter": eksportér tegningen som PNG i 3200×2400 og beskær til et udsnit med mål og tegningshoved – det ser skarpt ud og viser kvaliteten.

## Portræt af ejeren

| | |
|---|---|
| Format | 4:5, 1200×1500 px, JPG |
| Fil | `public/images/om/portraet.jpg` |
| Motiv | Ejeren i arbejdstøj ved kantpresser, svejsebord eller arbejdsplads med skærm. Kigger mod kameraet, naturligt lys, rolig baggrund |
| **Vigtigt** | **Skal være et rigtigt foto.** Et AI-portræt undergraver troværdigheden, som er hele pointen med /om/ |

Prompt kun til moodboard/fotobrief (ikke til brug på sitet):
> Environmental portrait of a Danish metal workshop craftsman in his 30s–40s wearing a dark work shirt, standing next to a press brake, arms relaxed, looking at the camera with a calm confident expression, natural window light, shallow depth of field, muted greys with a subtle orange accent, documentary photography style

## Open Graph-billede

`public/og.png` (1200×630) er lavet. Opdatér når det endelige logo er valgt.
