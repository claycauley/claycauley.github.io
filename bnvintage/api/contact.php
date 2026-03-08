<?php
/**
 * BN Vintage — Contact Form Handler
 *
 * Receives JSON from the front-end, verifies the reCAPTCHA v3
 * token with Google, sanitises inputs, and sends an email.
 *
 * ⚠️  CONFIGURATION — update the constants below before deploying.
 */

// =============================================
// Configuration
// =============================================

// ⚠️  DEV MODE — set to true for local testing.
//     Skips email sending and logs submissions to a local file.
//     ‼️  Set to false before deploying to production!
define('DEV_MODE', false);

define('RECAPTCHA_SECRET_KEY', '6LfFpYMsAAAAAPT9WYKBTDSQvJd5rGUIw5d6Q4_M');   // <-- your reCAPTCHA v3 secret key
define('RECAPTCHA_SCORE_THRESHOLD', 0.5);                 // 0.0 (bot) → 1.0 (human)
define('MAIL_TO', 'clay.cauley87@gmail.com');             // <-- where form emails go
define('MAIL_SUBJECT', 'New Contact Form Submission — BN Vintage');

// =============================================
// Headers
// =============================================
header('Content-Type: application/json; charset=utf-8');

// Allow cross-origin requests in dev mode (different ports on localhost)
if (DEV_MODE) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');

    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

// =============================================
// Parse JSON body
// =============================================
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid request body.']);
    exit;
}

// =============================================
// Extract & sanitise fields
// =============================================
$name    = trim(filter_var($data['name']    ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
$email   = trim(filter_var($data['email']   ?? '', FILTER_SANITIZE_EMAIL));
$message = trim(filter_var($data['message'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
$token   = trim($data['g-recaptcha-response'] ?? '');

// =============================================
// Validate required fields
// =============================================
if ($name === '' || $email === '' || $message === '' || $token === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Invalid email address.']);
    exit;
}

// =============================================
// Verify reCAPTCHA v3 token with Google
// =============================================
$recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify';

$recaptchaPayload = http_build_query([
    'secret'   => RECAPTCHA_SECRET_KEY,
    'response' => $token,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
]);

$context = stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => 'Content-Type: application/x-www-form-urlencoded',
        'content' => $recaptchaPayload,
        'timeout' => 10,
    ],
]);

$recaptchaResult = @file_get_contents($recaptchaUrl, false, $context);

if ($recaptchaResult === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not verify reCAPTCHA. Please try again.']);
    exit;
}

$recaptchaJson = json_decode($recaptchaResult, true);

// Check success flag
if (empty($recaptchaJson['success'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'reCAPTCHA verification failed.']);
    exit;
}

// Check the action matches what we expect
if (($recaptchaJson['action'] ?? '') !== 'contact') {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'reCAPTCHA action mismatch.']);
    exit;
}

// Check the score (v3-specific)
$score = (float) ($recaptchaJson['score'] ?? 0);

if ($score < RECAPTCHA_SCORE_THRESHOLD) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Request flagged as suspicious. Please try again.']);
    exit;
}

// =============================================
// Send email (or log in dev mode)
// =============================================
$emailBody  = "Name:    {$name}\n";
$emailBody .= "Email:   {$email}\n";
$emailBody .= "Score:   {$score}\n\n";
$emailBody .= "Message:\n{$message}\n";

if (DEV_MODE) {
    // In dev mode, write to a local log file instead of sending email
    $logEntry  = str_repeat('=', 50) . "\n";
    $logEntry .= "Date:    " . date('Y-m-d H:i:s') . "\n";
    $logEntry .= $emailBody;
    $logEntry .= str_repeat('=', 50) . "\n\n";

    $logFile = __DIR__ . '/submissions.log';
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);

    echo json_encode(['success' => true, 'dev' => 'Logged to submissions.log (email skipped)']);
    exit;
}

$headers  = "From: {$name} <{$email}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$mailSent = mail(MAIL_TO, MAIL_SUBJECT, $emailBody, $headers);

if (!$mailSent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send the message. Please try again later.']);
    exit;
}

// =============================================
// Success
// =============================================
echo json_encode(['success' => true]);
