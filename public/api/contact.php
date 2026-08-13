<?php
/**
 * Recharga Chargine — contact form endpoint.
 *
 * The site is a static export, so there is no Node runtime on the host. This
 * is the one server-side piece, and Hostinger runs PHP natively on every plan.
 *
 * Delivery: mail() to admin@rechargachargine.com. Because the site and the
 * mailbox sit on the same Hostinger account, that is a local delivery — the
 * most reliable path available, with no third-party API key to leak or expire.
 *
 * Security posture:
 *  - every field re-validated here regardless of what the browser did
 *  - CR/LF stripped from anything that reaches a mail header (injection)
 *  - honeypot field, and a file-based per-IP rate limit
 *  - nothing the sender types is ever echoed back as HTML
 *  - same-origin enforced by Origin/Referer when the browser sends one
 */

declare(strict_types=1);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Where enquiries are delivered. */
const MAIL_TO = 'admin@rechargachargine.com';

/**
 * Envelope sender. MUST be an address on this domain or the mail server will
 * refuse it / it will be marked as spoofed. Create this mailbox (or an alias)
 * in hPanel alongside the admin one.
 */
const MAIL_FROM = 'website@rechargachargine.com';
const MAIL_FROM_NAME = 'Recharga Chargine Website';

/** Hosts allowed to post here. */
const ALLOWED_HOSTS = [
    'rechargachargine.com',
    'www.rechargachargine.com',
    'localhost',
    '127.0.0.1',
];

/** Rate limit: max submissions per IP per window. */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 600; // seconds

const LIMITS = [
    'name'         => 120,
    'organisation' => 160,
    'email'        => 254,
    'message'      => 4000,
];

const INTERESTS = [
    'oem'      => 'OEM / manufacturer',
    'investor' => 'Investor',
    'press'    => 'Press',
    'other'    => 'Something else',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/** Collapses CR/LF and tabs so a value can never forge a mail header. */
function safe_header(string $value): string
{
    return trim(preg_replace('/[\r\n\t]+/', ' ', $value) ?? '');
}

/**
 * RFC 5322 quoted display name.
 *
 * safe_header() already removes the CR/LF needed to inject a header, but a
 * bare name containing ':' or '@' is still malformed and can be mis-parsed by
 * some agents. Quoting it makes the header unambiguous whatever was typed.
 */
function quoted_name(string $value): string
{
    $clean = safe_header($value);
    // Strip characters that have no business in a display name at all.
    $clean = preg_replace('/["\\\\]/', '', $clean) ?? '';
    return '"' . $clean . '"';
}

function field(array $src, string $key): string
{
    $raw = $src[$key] ?? '';
    if (!is_string($raw)) {
        return '';
    }
    // Strip null bytes and normalise whitespace at the edges.
    return trim(str_replace("\0", '', $raw));
}

function client_ip(): string
{
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'] as $key) {
        if (!empty($_SERVER[$key])) {
            $candidate = explode(',', (string) $_SERVER[$key])[0];
            $candidate = trim($candidate);
            if (filter_var($candidate, FILTER_VALIDATE_IP)) {
                return $candidate;
            }
        }
    }
    return 'unknown';
}

/**
 * File-based fixed-window rate limit. Best effort by design: it stops casual
 * flooding without needing a database on shared hosting.
 */
function rate_limited(string $ip): bool
{
    $dir = sys_get_temp_dir() . '/recharga-contact';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    if (!is_dir($dir) || !is_writable($dir)) {
        return false; // never block a genuine enquiry over a storage problem
    }

    $file = $dir . '/' . sha1($ip) . '.json';
    $now = time();
    $state = ['count' => 0, 'reset' => $now + RATE_LIMIT_WINDOW];

    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        return false;
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            return false;
        }
        $contents = stream_get_contents($handle);
        if (is_string($contents) && $contents !== '') {
            $decoded = json_decode($contents, true);
            if (is_array($decoded) && isset($decoded['count'], $decoded['reset'])) {
                $state = $decoded;
            }
        }

        if ($now >= (int) $state['reset']) {
            $state = ['count' => 0, 'reset' => $now + RATE_LIMIT_WINDOW];
        }

        $state['count'] = (int) $state['count'] + 1;

        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($state));
        fflush($handle);

        return $state['count'] > RATE_LIMIT_MAX;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

/** Occasionally clear out stale rate-limit files so /tmp does not grow. */
function sweep_rate_limit_dir(): void
{
    if (random_int(1, 50) !== 1) {
        return;
    }
    $dir = sys_get_temp_dir() . '/recharga-contact';
    foreach (glob($dir . '/*.json') ?: [] as $path) {
        if (is_file($path) && filemtime($path) < time() - (RATE_LIMIT_WINDOW * 4)) {
            @unlink($path);
        }
    }
}

// ---------------------------------------------------------------------------
// Request handling
// ---------------------------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['status' => 'error', 'message' => 'Method not allowed.']);
}

// Same-origin check. Only enforced when the browser actually sent an origin,
// so server-to-server tests and older clients are not broken by it.
$origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
if ($origin !== '') {
    $host = parse_url($origin, PHP_URL_HOST);
    if (!is_string($host) || !in_array(strtolower($host), ALLOWED_HOSTS, true)) {
        respond(403, ['status' => 'error', 'message' => 'Request blocked.']);
    }
}

// Accept both JSON and classic form encoding.
$input = $_POST;
$contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
if (str_contains($contentType, 'application/json')) {
    $body = file_get_contents('php://input') ?: '';
    if (strlen($body) > 64000) {
        respond(413, ['status' => 'error', 'message' => 'That message is too large.']);
    }
    $decoded = json_decode($body, true);
    $input = is_array($decoded) ? $decoded : [];
}

$successMessage = 'Thank you — your message is with us. We read every enquiry and will reply personally.';

// Honeypot. Return the success shape so a bot cannot tell it was caught.
if (field($input, 'website') !== '') {
    respond(200, ['status' => 'success', 'message' => $successMessage]);
}

$name         = field($input, 'name');
$organisation = field($input, 'organisation');
$email        = field($input, 'email');
$interest     = field($input, 'interest');
$message      = field($input, 'message');

$errors = [];

if (mb_strlen($name) < 2) {
    $errors['name'] = 'Please tell us your name.';
} elseif (mb_strlen($name) > LIMITS['name']) {
    $errors['name'] = 'That name is too long.';
}

if (mb_strlen($organisation) > LIMITS['organisation']) {
    $errors['organisation'] = 'That organisation name is too long.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > LIMITS['email']) {
    $errors['email'] = 'Please enter a valid email address.';
}

if (!array_key_exists($interest, INTERESTS)) {
    $errors['interest'] = 'Please choose the option that fits best.';
}

if (mb_strlen($message) < 10) {
    $errors['message'] = 'A sentence or two of context helps us reply well.';
} elseif (mb_strlen($message) > LIMITS['message']) {
    $errors['message'] = 'Please keep this under 4,000 characters.';
}

if ($errors !== []) {
    respond(422, [
        'status'  => 'error',
        'message' => 'Please check the highlighted fields.',
        'errors'  => $errors,
    ]);
}

sweep_rate_limit_dir();

if (rate_limited(client_ip())) {
    respond(429, [
        'status'  => 'error',
        'message' => "That's a few messages in quick succession — please try again shortly.",
    ]);
}

// ---------------------------------------------------------------------------
// Compose and send
// ---------------------------------------------------------------------------

$interestLabel = INTERESTS[$interest];
$safeName      = safe_header($name);
$safeOrg       = safe_header($organisation);
$safeEmail     = safe_header($email);

$subject = sprintf(
    'Recharga Chargine enquiry — %s%s · %s',
    $safeName,
    $safeOrg !== '' ? " ({$safeOrg})" : '',
    $interestLabel
);

// Plain text only: nothing the sender typed is ever rendered as HTML.
$body = implode("\n", [
    'New enquiry from the Recharga Chargine website.',
    '',
    'Name:         ' . $safeName,
    'Organisation: ' . ($safeOrg !== '' ? $safeOrg : '—'),
    'Email:        ' . $safeEmail,
    'Interest:     ' . $interestLabel,
    'Received:     ' . gmdate('Y-m-d H:i:s') . ' UTC',
    '',
    'Message:',
    '--------',
    str_replace("\r\n", "\n", $message),
    '',
    '--',
    'Reply directly to this email to reach the sender.',
]);

$headers = implode("\r\n", [
    'From: ' . quoted_name(MAIL_FROM_NAME) . ' <' . MAIL_FROM . '>',
    // Replying in a mail client goes straight back to the enquirer.
    'Reply-To: ' . quoted_name($safeName) . ' <' . $safeEmail . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: Recharga Chargine Website',
    'Auto-Submitted: auto-generated',
]);

$sent = @mail(
    MAIL_TO,
    // Encode the subject so non-ASCII (em dashes, accents) survives transit.
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $body,
    $headers,
    '-f' . MAIL_FROM
);

if (!$sent) {
    error_log('[contact] mail() failed for ' . $safeEmail);
    respond(500, [
        'status'  => 'error',
        'message' => "We couldn't send that just now. Please email admin@rechargachargine.com directly.",
    ]);
}

respond(200, ['status' => 'success', 'message' => $successMessage]);
