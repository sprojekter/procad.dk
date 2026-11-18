// Centrale oplysninger om ProCAD. Ret her – så opdateres hele sitet.
// Alt markeret [UDFYLD] skal ejeren levere/bekræfte før lancering.

export const site = {
  name: 'ProCAD',
  url: 'https://procad.dk', // canonical peger altid på det rigtige domæne
  tagline: 'Lad dine idéer blive til virkelighed',
  description:
    'Produktionsklare CAD-tegninger, DXF/STEP-filer og teknisk dokumentation til metalbearbejdning. Fast pris og svar inden for 24 timer.',

  email: 'kontakt@procad.dk', // [UDFYLD] bekræft adresse
  phone: '42 71 22 71',
  phoneHref: 'tel:+4542712271',
  cvr: '35272089',
  // Adressen vises bevidst ikke på sitet (privat bopæl). Kun land bruges i schema.
  address: {
    country: 'DK',
  },
  owner: {
    name: '[UDFYLD: Fornavn Efternavn]',
    firstName: '[UDFYLD: Fornavn]',
    role: 'Indehaver og CAD-tegner',
  },
  linkedin: '', // [UDFYLD] fx https://www.linkedin.com/company/procad-dk

  // [UDFYLD] Bekræft hvilke programmer der faktisk bruges
  software: ['SolidWorks', 'Inventor', 'AutoCAD'],
  formatsIn: ['PDF', 'DXF', 'DWG', 'STEP', 'IGES', 'Skitse/foto'],
  formatsOut: ['PDF', 'DXF', 'DWG', 'STEP', 'IGES'],
  responseHours: 24,

  // Tilbudsformularen. Standard: FormSubmit (gratis, virker på GitHub Pages, filer op til 10 MB).
  // På Simply.com kan den sættes til '/api/tilbud.php' (PHP, filer op til 25 MB).
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT || 'https://formsubmit.co/sinanp2020@hotmail.com', // MIDLERTIDIG (test/forhåndsvisning) – skift til kundens mail før lancering
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
  gtmId: import.meta.env.PUBLIC_GTM_ID || '',
};

export const mainNav = [
  { href: '/cases/', label: 'Cases' },
  { href: '/proces/', label: 'Proces' },
  { href: '/priser/', label: 'Priser' },
  { href: '/om/', label: 'Om' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/kontakt/', label: 'Kontakt' },
];
