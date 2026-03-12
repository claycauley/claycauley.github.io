/**
 * BN Vintage — Main Script
 * Handles contact-form validation, reCAPTCHA v3, and submission.
 */

'use strict';

// ⚠️ Must match the site key loaded in index.html
const RECAPTCHA_SITE_KEY = '6LfFpYMsAAAAALNoPc-2mOkjHfnpSPegkIfruIJ6';

// ⚠️ DEV MODE — set to true when testing locally, false for production
const DEV_MODE = false;

// When DEV_MODE is true, the form posts to PHP's built-in dev server.
// When false, it uses the relative path (same-origin on your live host).
const FORM_ENDPOINT = DEV_MODE
  ? 'http://localhost:8000/api/contact.php'
  : 'api/contact.php';

document.addEventListener('DOMContentLoaded', () => {
  // ---- Auto-update footer year ----
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  const form       = document.getElementById('contactForm');
  const heading    = document.querySelector('.contact__heading');
  const subheading = document.querySelector('.contact__subheading');
  const result     = document.getElementById('contactResult');
  const resultText = document.getElementById('resultText');
  const retryBtn   = document.getElementById('retryBtn');
  const submitBtn  = form ? form.querySelector('.contact__submit') : null;

  // Input elements
  const nameInput    = form ? form.elements['name'] : null;
  const emailInput   = form ? form.elements['email'] : null;
  const messageInput = form ? form.elements['message'] : null;

  if (!form) return;

  // ---- Retry button — show the form again ----
  retryBtn.addEventListener('click', () => {
    result.classList.remove('is-visible');
    retryBtn.style.display = 'none';
    resultText.textContent = '';
    resultText.className = 'contact__result-text';

    heading.classList.remove('is-hidden');
    subheading.classList.remove('is-hidden');
    form.classList.remove('is-hidden');
    resetButton();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();


    clearErrors();

    // ---- Gather values ----
    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const message = messageInput.value.trim();

    // ---- Validate & highlight empty / invalid fields ----
    let hasError = false;

    if (!name) {
      nameInput.classList.add('is-error');
      hasError = true;
    }

    if (!email || !isValidEmail(email)) {
      emailInput.classList.add('is-error');
      hasError = true;
    }

    if (!message) {
      messageInput.classList.add('is-error');
      hasError = true;
    }

    if (hasError) return;

    // ---- Disable button while processing ----
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // ---- reCAPTCHA v3 — get token invisibly ----
    let recaptchaToken;
    try {
      recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: 'contact',
      });
    } catch (err) {
      console.error('reCAPTCHA error:', err);
      heading.classList.add('is-hidden');
      subheading.classList.add('is-hidden');
      form.classList.add('is-hidden');
      resultText.textContent = 'reCAPTCHA verification failed. Please refresh and try again.';
      resultText.classList.add('contact__result-text--error');
      retryBtn.style.display = '';
      result.classList.add('is-visible');
      resetButton();
      return;
    }

    // ---- Submit to backend ----
    try {
      const payload = {
        name,
        email,
        message,
        'g-recaptcha-response': recaptchaToken,
      };

      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ---- SUCCESS: hide form, show message ----
        heading.classList.add('is-hidden');
        subheading.classList.add('is-hidden');
        form.classList.add('is-hidden');
        form.reset();

        resultText.textContent = 'Thank you! Your message has been sent. Someone will be in touch soon.';
        result.classList.add('is-visible');
      } else {
        // ---- FAIL: hide form, show error + retry ----
        heading.classList.add('is-hidden');
        subheading.classList.add('is-hidden');
        form.classList.add('is-hidden');

        resultText.textContent = data.error || 'Something went wrong. Please try again.';
        resultText.classList.add('contact__result-text--error');
        retryBtn.style.display = '';
        result.classList.add('is-visible');
      }
    } catch (err) {
      console.error('Form submission error:', err);

      heading.classList.add('is-hidden');
      subheading.classList.add('is-hidden');
      form.classList.add('is-hidden');

      resultText.textContent = 'A network error occurred. Please try again later.';
      resultText.classList.add('contact__result-text--error');
      retryBtn.style.display = '';
      result.classList.add('is-visible');
    }
  });

  // ---- Helpers ----
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function clearErrors() {
    [nameInput, emailInput, messageInput].forEach((el) =>
      el.classList.remove('is-error')
    );
  }

  function resetButton() {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }

  // ---- Clear error glow when user starts typing ----
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('is-error');
    });
  });
});
