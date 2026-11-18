<?php
// Kopiér denne fil til config.php og udfyld. config.php må ikke committes til git.
return [
    'to'               => 'kontakt@procad.dk',
    'from'             => 'noreply@procad.dk',
    'turnstile_secret' => '', // Cloudflare Turnstile secret key (valgfri)
    // Tilføj Simplys midlertidige domæne her under test, fx 'https://procad.dk.web.simply.com'
    'allowed_origins'  => ['https://procad.dk', 'https://www.procad.dk'],
];
