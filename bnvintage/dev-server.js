/**
 * BN Vintage — Local Dev Server (Node.js)
 *
 * Mimics api/contact.php so you can test the contact form locally
 * without PHP. Validates fields, verifies reCAPTCHA v3 with Google,
 * and logs submissions to api/submissions.log.
 *
 * Usage:  node dev-server.js
 * Runs on http://localhost:8000
 *
 * ⚠️  This is for LOCAL TESTING only. Do NOT deploy this file.
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────
const PORT = 8000;
const RECAPTCHA_SECRET = '6LfFpYMsAAAAAPT9WYKBTDSQvJd5rGUIw5d6Q4_M';
const SCORE_THRESHOLD = 0.5;
const LOG_FILE = path.join(__dirname, 'api', 'submissions.log');

// ── Helpers ───────────────────────────────────────────
function jsonResponse(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

function verifyRecaptcha(token) {
  return new Promise((resolve, reject) => {
    const postData = `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`;

    const req = https.request(
      {
        hostname: 'www.google.com',
        path: '/recaptcha/api/siteverify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error('Invalid JSON from Google'));
          }
        });
      }
    );

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ── Server ────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // Only handle POST /api/contact.php
  if (req.method !== 'POST' || !req.url.startsWith('/api/contact')) {
    console.log(`⚠️  ${req.method} ${req.url} → 404 (only POST /api/contact.php is handled)`);
    jsonResponse(res, 404, { success: false, error: 'Not found.' });
    return;
  }

  console.log(`\n📨  Incoming POST ${req.url}`);

  // Read body
  let body = '';
  for await (const chunk of req) body += chunk;

  let data;
  try {
    data = JSON.parse(body);
  } catch {
    jsonResponse(res, 400, { success: false, error: 'Invalid JSON.' });
    return;
  }

  const name = (data.name || '').trim();
  const email = (data.email || '').trim();
  const message = (data.message || '').trim();
  const token = (data['g-recaptcha-response'] || '').trim();

  // Validate
  if (!name || !email || !message || !token) {
    jsonResponse(res, 422, { success: false, error: 'All fields are required.' });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    jsonResponse(res, 422, { success: false, error: 'Invalid email address.' });
    return;
  }

  // Verify reCAPTCHA v3
  let recaptcha;
  try {
    recaptcha = await verifyRecaptcha(token);
  } catch (err) {
    console.error('reCAPTCHA verification error:', err.message);
    jsonResponse(res, 500, { success: false, error: 'Could not verify reCAPTCHA.' });
    return;
  }

  if (!recaptcha.success) {
    console.log('❌  reCAPTCHA failed:', JSON.stringify(recaptcha, null, 2));
    jsonResponse(res, 403, { success: false, error: 'reCAPTCHA verification failed.' });
    return;
  }

  if (recaptcha.action !== 'contact') {
    jsonResponse(res, 403, { success: false, error: 'reCAPTCHA action mismatch.' });
    return;
  }

  const score = recaptcha.score || 0;
  if (score < SCORE_THRESHOLD) {
    jsonResponse(res, 403, { success: false, error: 'Request flagged as suspicious.' });
    return;
  }

  // Log submission (instead of sending email)
  const divider = '='.repeat(50);
  const logEntry = [
    divider,
    `Date:    ${new Date().toISOString()}`,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Score:   ${score}`,
    '',
    `Message:`,
    message,
    divider,
    '',
    '',
  ].join('\n');

  fs.appendFileSync(LOG_FILE, logEntry, 'utf8');

  console.log(`\n✅  Submission received from ${name} <${email}> (score: ${score})`);
  console.log(`   Logged to: ${LOG_FILE}\n`);

  jsonResponse(res, 200, {
    success: true,
    dev: `Logged to submissions.log (score: ${score})`,
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀  BN Vintage dev server running at http://localhost:${PORT}`);
  console.log(`   Accepting POST requests at http://localhost:${PORT}/api/contact.php`);
  console.log(`   Submissions will be logged to: ${LOG_FILE}`);
  console.log(`\n   Press Ctrl+C to stop.\n`);
});
