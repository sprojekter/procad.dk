// Spørgsmål og svar – formuleret som kundens egne spørgsmål.
// `home: true` vises som uddrag på forsiden. Ret [UDFYLD]-steder før lancering.
export interface FaqItem { q: string; a: string; cat: 'pris' | 'levering' | 'filer' | 'fortrolighed' | 'samarbejde'; home?: boolean }

export const faqCategories: Record<FaqItem['cat'], string> = {
  pris: 'Pris',
  levering: 'Leveringstid',
  filer: 'Filformater og standarder',
  fortrolighed: 'Fortrolighed og NDA',
  samarbejde: 'Samarbejde',
};

export const faq: FaqItem[] = [
  {
    cat: 'pris', home: true,
    q: 'Hvad koster en arbejdstegning?',
    a: 'Det afhænger af emnets kompleksitet og hvad du har i forvejen. Du får altid en fast pris, før jeg går i gang. En enkel pladedel med få bukninger koster typisk [UDFYLD: fra X kr.] ekskl. moms. Løbende opgaver kan køre på timepris: [UDFYLD: X kr./time ekskl. moms].',
  },
  {
    cat: 'pris',
    q: 'Hvad er med i prisen?',
    a: 'Tegningen eller filerne i de aftalte formater, kontrol af mål og mindre rettelser inden for opgaven [UDFYLD: fx op til 2 rettelsesrunder]. Ændringer i selve designet efter levering prissættes særskilt – det får du at vide på forhånd.',
  },
  {
    cat: 'levering', home: true,
    q: 'Hvor hurtigt kan I levere?',
    a: 'Du får svar på din forespørgsel inden for 24 timer på hverdage. Enkle tegninger og DXF-filer leveres typisk på [UDFYLD: 1–3 hverdage]. Større opgaver aftaler vi en dato for. Har produktionen travlt, så skriv det – hasteopgaver kan ofte lade sig gøre.',
  },
  {
    cat: 'filer', home: true,
    q: 'Hvilke filformater kan I levere?',
    a: 'PDF, DXF, DWG, STEP og IGES – og native filer fra [UDFYLD: SolidWorks/Inventor/AutoCAD]. DXF-filer leveres i 1:1 med lukkede konturer og lag til skæring, gravering og buk, så de kan gå direkte i laser-, plasma- eller vandskæreren.',
  },
  {
    cat: 'filer',
    q: 'Hvad skal jeg sende for at få en pris?',
    a: 'Det du har: en skitse med mål, et foto, en gammel tegning, en PDF eller en 3D-fil. Skriv gerne materiale, tykkelse, antal og hvilken maskine delen skal laves på. Mangler der noget, spørger jeg.',
  },
  {
    cat: 'filer', home: true,
    q: 'Kan I udfolde en kompleks pladedel?',
    a: 'Ja. Jeg laver udfoldninger og bukkeplaner ud fra jeres egne værdier for bukkeradius, K-faktor og værktøj, så målene passer på jeres kantpresser – ikke kun i teorien.',
  },
  {
    cat: 'filer',
    q: 'Kan I bruge vores tegningsramme og standarder?',
    a: 'Ja. Jeg tegner gerne i jeres egen tegningsramme med logo, tegningsnummerering, lag og linjetyper. Tegningerne følger DS/EN ISO – fx ISO 128 for tegningsregler, ISO 2768 for generelle tolerancer, ISO 1101 for geometriske tolerancer og ISO 2553 for svejsesymboler.',
  },
  {
    cat: 'fortrolighed', home: true,
    q: 'Skriver I under på en NDA?',
    a: 'Ja. Send jeres egen fortrolighedsaftale, eller brug min standard-NDA [UDFYLD: link/vedhæftning]. Filer og tegninger deles ikke med andre og slettes efter aftale, når opgaven er afsluttet.',
  },
  {
    cat: 'fortrolighed',
    q: 'Hvem ejer tegningerne og filerne?',
    a: 'Det gør du. Når fakturaen er betalt, overgår rettighederne til tegninger og filer til dig [UDFYLD: bekræft i handelsbetingelser]. Jeg viser kun dit projekt som case, hvis du har sagt ja.',
  },
  {
    cat: 'samarbejde',
    q: 'Kan I hjælpe, hvis vi kun mangler kapacitet i en periode?',
    a: 'Ja. Mange tegnestuer og værksteder har travlt i perioder. Så kan jeg tage produktionstegningerne, mens jeres egne folk modellerer – eller tage hele opgaver. Det kan køre på timepris eller som en timebank.',
  },
  {
    cat: 'samarbejde',
    q: 'Arbejder I kun med metal?',
    a: 'Metalbearbejdning er mit speciale – pladearbejde, svejste konstruktioner og CNC-bearbejdede emner. Andre opgaver kan også lade sig gøre; skriv og spørg.',
  },
  {
    cat: 'samarbejde',
    q: 'Jeg har en produktidé, men ingen tegninger. Kan I hjælpe?',
    a: 'Ja. Mange starter med en skitse på et stykke papir. Jeg hjælper dig fra idé til 3D-model og produktionsklare tegninger, så du kan få pris fra et værksted og få lavet en prototype.',
  },
];
