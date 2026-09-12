<?php
/**
 * mailer.config.example.php
 * ---------------------------------------------------------------------------
 * Template for mailer.php's local configuration. Copy this file to
 * `mailer.config.php` (same directory) and fill in the real values.
 *
 *   cp mailer.config.example.php mailer.config.php
 *
 * `mailer.config.php` is gitignored — it must NEVER be committed. It holds
 * live credentials (SMTP password, reCAPTCHA secret) that should never be
 * exposed in source control.
 * ---------------------------------------------------------------------------
 */

return [
    // Hostinger email account password used to send mail via SMTP.
    "smtp_password" => "REPLACE_WITH_HOSTINGER_SMTP_PASSWORD",

    // reCAPTCHA v3 secret key (server-side; paired with the site key used
    // in contact.php's <script> tag, which is safe to expose publicly).
    "recaptcha_secret" => "REPLACE_WITH_RECAPTCHA_V3_SECRET_KEY",
];
