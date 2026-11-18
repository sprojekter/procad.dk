<?php
/**
 * ProCAD – tilbudsformular (Simply.com webhotel / enhver PHP 8+ host)
 *
 * Modtager multipart/form-data fra QuoteForm, validerer, tjekker spam
 * og sender en mail med vedhæftede filer til ejeren.
 *
 * Opsætning: kopiér config.sample.php til config.php (samme mappe) og udfyld.
 * config.php ligger IKKE i git – upload den manuelt via FTP.
 */

declare(strict_types=1);
date_default_timezone_set('Europe/Copenhagen');

$config = [
    'to'               => 'kontakt@procad.dk',
    'from'             => 'noreply@procad.dk',   // skal være en adresse på jeres eget domæne
    'subject_prefix'   => '[procad.dk] Tilbudsforespørgsel',
    'max_total_bytes'  => 15 * 1024 * 1024,   // base64 i mail ≈ +35 %; større filer via link
    'min_seconds'      => 3,                      // tidsfælde mod bots
    'turnstile_secret' => '',                     // udfyld for at aktivere Cloudflare Turnstile
    'allowed_origins'  => ['https://procad.dk', 'https://www.procad.dk'],
];
if (is_file(__DIR__ . '/config.php')) {
    $config = array_merge($config, require __DIR__ . '/config.php');
}

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond(bool $ok, string $error = '', int $code = 200): never
{
    global $wantsJson;
    http_response_code($ok ? 200 : $code);
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error], JSON_UNESCAPED_UNICODE);
    } elseif ($ok) {
        header('Location: /tak/', true, 303);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        echo '<!doctype html><meta charset="utf-8"><title>Fejl</title><p>' . htmlspecialchars($error) . '</p><p><a href="/kontakt/">Tilbage til formularen</a></p>';
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Kun POST er tilladt.', 405);
}

// Grundlæggende origin-tjek (beskytter mod formularer på andre domæner)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, $config['allowed_origins'], true)) {
    respond(false, 'Ugyldig afsender.', 403);
}

// Hvis uploads overstiger post_max_size, er $_POST tom
if (empty($_POST) && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    respond(false, 'Filerne er for store. Maks. 15 MB i alt – brug et link til større filer.', 413);
}

// --- Spam: honeypot + tidsfælde ---
if (!empty($_POST['_gotcha']) || !empty($_POST['_honey'])) {
    respond(true); // lad som om alt gik godt
}
$ts = (int)($_POST['_ts'] ?? 0);
$elapsed = time() * 1000 - $ts;
// Kun "for hurtig" tæller som spam. Negativ tid = brugerens ur går foran serveren → lad den passere.
if ($ts > 0 && $elapsed >= 0 && $elapsed < $config['min_seconds'] * 1000) {
    respond(true);
}

// --- Turnstile (valgfri) ---
if ($config['turnstile_secret'] !== '') {
    $token = $_POST['cf-turnstile-response'] ?? '';
    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_POSTFIELDS => http_build_query([
            'secret' => $config['turnstile_secret'],
            'response' => $token,
            'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
        ]),
    ]);
    $res = json_decode((string)curl_exec($ch), true);
    curl_close($ch);
    if (empty($res['success'])) {
        respond(false, 'Spamtjekket fejlede. Genindlæs siden og prøv igen.', 400);
    }
}

// --- Validering ---
$clean = static fn(string $k, int $max = 300): string =>
    trim(mb_substr(str_replace(["\r", "\0"], '', (string)($_POST[$k] ?? '')), 0, $max));

$navn        = $clean('Navn', 120);
$firma       = $clean('Firma', 160);
$email       = $clean('email', 200);
$telefon     = $clean('Telefon', 40);
$ydelse      = $clean('Ydelse', 60);
$dato        = $clean('Tidsplan', 40);
$beskrivelse = trim(mb_substr((string)($_POST['Beskrivelse'] ?? ''), 0, 8000));
$side        = $clean('Side', 200);
$link        = $clean('Link', 500);
$kontaktform = $clean('Kontakt', 40);

$errors = [];
if ($navn === '') $errors[] = 'navn';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'e-mail';
$harFiler = false;
foreach ($_FILES as $fx) { $e = is_array($fx['error']) ? $fx['error'] : [$fx['error']]; if (in_array(UPLOAD_ERR_OK, $e, true)) $harFiler = true; }
if ($beskrivelse === '' && $link === '' && !$harFiler) $errors[] = 'beskrivelse, fil eller link';
if ($errors) {
    respond(false, 'Udfyld venligst: ' . implode(', ', $errors) . '.', 422);
}

// --- Filer ---
$allowedExt = ['pdf', 'dxf', 'dwg', 'step', 'stp', 'iges', 'igs', 'jpg', 'jpeg', 'png', 'heic', 'heif', 'webp', 'zip'];
$attachments = [];
$total = 0;
// Normalisér alle filfelter (attachment1, attachment2 … eller filer[]) til én liste
$incoming = [];
foreach ($_FILES as $field) {
    if (is_array($field['name'])) {
        foreach ($field['name'] as $i => $n) {
            $incoming[] = ['name' => $n, 'error' => $field['error'][$i], 'size' => $field['size'][$i], 'tmp' => $field['tmp_name'][$i]];
        }
    } else {
        $incoming[] = ['name' => $field['name'], 'error' => $field['error'], 'size' => $field['size'], 'tmp' => $field['tmp_name']];
    }
}
if (count($incoming) > 15) respond(false, 'Maks. 15 filer pr. forespørgsel.', 422);
foreach ($incoming as $i => $fil) {
    if ($fil['error'] === UPLOAD_ERR_NO_FILE) continue;
    if ($fil['error'] !== UPLOAD_ERR_OK) respond(false, 'En fil kunne ikke uploades. Prøv igen eller send den på mail.', 400);
    $name = basename((string)$fil['name']);
    $ext  = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExt, true)) respond(false, "Filtypen .$ext er ikke tilladt.", 415);
    $total += (int)$fil['size'];
    if ($total > $config['max_total_bytes']) respond(false, 'Filerne fylder mere end 15 MB. Indsæt et link (fx WeTransfer) i stedet.', 413);
    if (!is_uploaded_file($fil['tmp'])) continue;
    $safe = preg_replace('/[^A-Za-z0-9._-]+/', '_', $name) ?: "fil-$i.$ext";
    $attachments[] = ['name' => $safe, 'data' => (string)file_get_contents($fil['tmp'])];
}

// --- Mail ---
$ydelser = [
    'arbejdstegninger' => 'Arbejdstegninger',
    'filklargoering' => 'Filklargøring (DXF/STEP)',
    '3d-modellering' => '3D-modellering',
    'teknisk-dokumentation' => 'Teknisk dokumentation',
    'andet' => 'Andet / ved ikke',
];
$ydelseTxt = $ydelser[$ydelse] ?? ($ydelse ?: 'Ikke valgt');

$body  = "Ny tilbudsforespørgsel fra procad.dk\n";
$body .= str_repeat('=', 40) . "\n\n";
$body .= "Navn:        $navn\n";
$body .= "Firma:       " . ($firma ?: '-') . "\n";
$body .= "E-mail:      $email\n";
$body .= "Telefon:     " . ($telefon ?: '-') . "\n";
$body .= "Ydelse:      $ydelseTxt\n";
$body .= "Tidsplan:    " . ($dato ?: '-') . "\n";
$body .= "Svar via:    " . ($kontaktform ?: '-') . "\n";
$body .= "Fil-link:    " . ($link ?: '-') . "\n";
$body .= "Sendt fra:   " . ($side ?: '-') . "\n";
$body .= "Filer:       " . (count($attachments) ? implode(', ', array_column($attachments, 'name')) : 'ingen') . "\n\n";
$body .= "Beskrivelse:\n" . str_repeat('-', 40) . "\n$beskrivelse\n\n";
$body .= "Modtaget: " . date('d-m-Y H:i') . "\n";

$subject  = $config['subject_prefix'] . ' – ' . $navn . ($firma ? " ($firma)" : '');
$encSubj  = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$boundary = 'procad_' . bin2hex(random_bytes(12));

$headers  = "From: ProCAD hjemmeside <{$config['from']}>\r\n";
$headers .= "Reply-To: " . mb_encode_mimeheader(preg_replace('/[\r\n<>"]/', '', $navn), 'UTF-8', 'B') . " <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

$msg  = "--$boundary\r\n";
$msg .= "Content-Type: text/plain; charset=UTF-8\r\n";
$msg .= "Content-Transfer-Encoding: base64\r\n\r\n";
$msg .= chunk_split(base64_encode($body)) . "\r\n";
foreach ($attachments as $a) {
    $msg .= "--$boundary\r\n";
    $msg .= "Content-Type: application/octet-stream; name=\"{$a['name']}\"\r\n";
    $msg .= "Content-Transfer-Encoding: base64\r\n";
    $msg .= "Content-Disposition: attachment; filename=\"{$a['name']}\"\r\n\r\n";
    $msg .= chunk_split(base64_encode($a['data'])) . "\r\n";
}
$msg .= "--$boundary--";

$sent = mail($config['to'], $encSubj, $msg, $headers, '-f' . $config['from']);
if (!$sent) {
    error_log('ProCAD formular: mail() fejlede for ' . $email);
    respond(false, 'Mailen kunne ikke sendes fra serveren.', 500);
}
respond(true);
