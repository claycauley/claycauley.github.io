<?php
$pageTitle = "Contact | Clay";
$pageDescription = "Contact Clay — Web Designer &amp; Front-End Developer.";
$currentPage = "contact";
$extraHead =
    '<script src="https://www.google.com/recaptcha/api.js?render=6LfX2RctAAAAAN5DxWTBLJfVTVmbtyJuNVWtMagZ" async defer></script><style>.grecaptcha-badge{visibility:hidden!important;}</style>';
include "partials/header.php";
?>

<main id="main-content">
  <!-- ================================================================
       HERO — Page header
       ================================================================ -->
  <section
    class="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden"
    aria-label="Contact page header">
    <!-- Decorative background -->
    <div class="absolute inset-0" aria-hidden="true">
      <div class="absolute inset-0 grid-lines opacity-25"></div>
      <div
        class="absolute top-0 right-1/4 w-[600px] h-[500px] flame-glow opacity-20"
      ></div>
      <div
        class="absolute bottom-0 left-1/3 w-[400px] h-[300px] flame-glow opacity-10"
      ></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
      <div class="max-w-3xl">
        <p class="section-label mb-5 fade-in-up">Let's Connect</p>
        <h1
          class="font-heading font-bold text-fluid-display text-ink-50 leading-[1.04] tracking-tight mb-6 fade-in-up"
          data-delay="1">
          Start the<br />
          <span class="text-flame-500">Conversation.</span>
        </h1>
        <p
          class="text-fluid-xl text-ink-400 leading-relaxed max-w-xl mb-10 fade-in-up"
          data-delay="2">
          Have a project in mind, a question about some of my work or previous experience? Or if you just want to say hello.
          Fill out the form and I'll get back to you quickly.
        </p>

        <!-- Quick-info pills -->
        <div class="flex flex-wrap gap-3 fade-in-up" data-delay="3">
          <div
            class="flex items-center gap-2 bg-ink-900/80 backdrop-blur-sm border border-ink-800 rounded-full px-4 py-2">
            <span
              class="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0"
              aria-hidden="true"
            ></span>
            <span
              class="font-heading font-semibold text-fluid-xs text-ink-200"
              >Available for new projects</span>
          </div>
          <div
            class="flex items-center gap-2 bg-ink-900/80 backdrop-blur-sm border border-ink-800 rounded-full px-4 py-2">
            <i
              class="fa-solid fa-clock text-flame-600 text-xs"
              aria-hidden="true"
            ></i>
            <span
              class="font-heading font-semibold text-fluid-xs text-ink-200"
              >Replies quickly</span>
          </div>
          <div
            class="flex items-center gap-2 bg-ink-900/80 backdrop-blur-sm border border-ink-800 rounded-full px-4 py-2">
            <i
              class="fa-solid fa-location-dot text-flame-600 text-xs"
              aria-hidden="true"
            ></i>
            <span
              class="font-heading font-semibold text-fluid-xs text-ink-200"
              >Remote &amp; On-site</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="section-divider" role="separator" aria-hidden="true"></div>

  <!-- ================================================================
       FORM + SIDEBAR
       ================================================================ -->
  <section class="section" aria-labelledby="contact-form-heading">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <div class="flex flex-col lg:flex-row gap-5 lg:gap-5 items-start">
        <!-- ── FORM COLUMN ── -->
        <div class="flex-1 w-full min-w-0 fade-in-up">
          <h2 id="contact-form-heading" class="sr-only">
            Send me a message
          </h2>

          <!-- Form card -->
          <div
            class="p-6 lg:p-10 rounded-3xl border border-ink-800"
            style="
              background: linear-gradient(135deg, #1a1210 0%, #1f1614 100%);
            ">
            <!-- ── Success state (hidden until form submits) ── -->
            <div
              id="form-success"
              class="contact-success"
              role="status"
              aria-live="polite"
              tabindex="-1">
              <div
                class="w-16 h-16 rounded-2xl bg-green-400/10 border border-green-400/20 flex items-center justify-center">
                <i
                  class="fa-solid fa-check text-green-400 text-2xl"
                  aria-hidden="true"
                ></i>
              </div>
              <h3 class="font-heading font-bold text-fluid-2xl text-ink-50">
                Message Sent!
              </h3>
              <p
                class="text-fluid-base text-ink-400 max-w-sm leading-relaxed">
                Thanks for reaching out. I'll personally review your message
                and get back to you within 24&nbsp;hours.
              </p>
              <button
                type="button"
                id="reset-form-btn"
                class="btn-outline mt-2">
                <i
                  class="fa-solid fa-rotate-left text-xs"
                  aria-hidden="true"
                ></i>
                Send Another Message
              </button>
            </div>

            <!-- ── The form ── -->
            <!-- ── The form ── -->
            <form id="contact-form" novalidate aria-label="Contact form">
              <div class="flex flex-col gap-6">
                <!-- Row 1: Name + Email side-by-side -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <!-- Full Name -->
                  <div class="contact-field">
                    <label for="field-name" class="contact-label">
                      Full Name
                      <span
                        class="required-dot"
                        aria-hidden="true"
                        title="Required"
                      ></span>
                    </label>
                    <input
                      type="text"
                      id="field-name"
                      name="name"
                      class="contact-input"
                      placeholder="Your full name"
                      autocomplete="name"
                      required
                      aria-required="true"
                      aria-describedby="error-name"
                    />
                    <p
                      id="error-name"
                      class="contact-error"
                      role="alert"
                      aria-live="polite">
                      <i
                        class="fa-solid fa-circle-exclamation text-xs shrink-0"
                        aria-hidden="true"
                      ></i>
                      <span
                        >Please enter your full name (min. 2
                        characters)</span>
                    </p>
                  </div>

                  <!-- Email Address -->
                  <div class="contact-field">
                    <label for="field-email" class="contact-label">
                      Email Address
                      <span
                        class="required-dot"
                        aria-hidden="true"
                        title="Required"
                      ></span>
                    </label>
                    <input
                      type="email"
                      id="field-email"
                      name="email"
                      class="contact-input"
                      placeholder="you@example.com"
                      autocomplete="email"
                      required
                      aria-required="true"
                      aria-describedby="error-email"
                    />
                    <p
                      id="error-email"
                      class="contact-error"
                      role="alert"
                      aria-live="polite">
                      <i
                        class="fa-solid fa-circle-exclamation text-xs shrink-0"
                        aria-hidden="true"
                      ></i>
                      <span>Please enter a valid email address</span>
                    </p>
                  </div>
                </div>
                <!-- /Row 1 -->

                <!-- Subject -->
                <div class="contact-field">
                  <label for="field-subject" class="contact-label">
                    Subject
                    <span
                      class="required-dot"
                      aria-hidden="true"
                      title="Required"
                    ></span>
                  </label>
                  <input
                    type="text"
                    id="field-subject"
                    name="subject"
                    class="contact-input"
                    placeholder="What's this about?"
                    required
                    aria-required="true"
                    aria-describedby="error-subject"
                  />
                  <p
                    id="error-subject"
                    class="contact-error"
                    role="alert"
                    aria-live="polite">
                    <i
                      class="fa-solid fa-circle-exclamation text-xs shrink-0"
                      aria-hidden="true"
                    ></i>
                    <span>Please enter a subject line</span>
                  </p>
                </div>

                <!-- Message -->
                <div class="contact-field">
                  <label for="field-message" class="contact-label">
                    Message
                    <span
                      class="required-dot"
                      aria-hidden="true"
                      title="Required"
                    ></span>
                  </label>
                  <div class="relative">
                    <textarea
                      id="field-message"
                      name="message"
                      class="contact-input"
                      rows="6"
                      placeholder="Tell me about your project, timeline, budget, and any specific requirements…"
                      required
                      aria-required="true"
                      aria-describedby="error-message char-count"
                      maxlength="2000"
                    ></textarea>
                    <span
                      id="char-count"
                      class="absolute bottom-3 right-3 text-fluid-xs text-ink-500 font-heading font-medium pointer-events-none select-none"
                      aria-live="polite"
                      aria-atomic="true"
                      >0 / 2000</span>
                  </div>
                  <p
                    id="error-message"
                    class="contact-error"
                    role="alert"
                    aria-live="polite">
                    <i
                      class="fa-solid fa-circle-exclamation text-xs shrink-0"
                      aria-hidden="true"
                    ></i>
                    <span
                      >Please enter your message (min. 20 characters)</span>
                  </p>
                </div>

                <!-- Privacy note — disclosure text required by Google when hiding the badge -->
                <p class="text-fluid-xs text-ink-500 leading-relaxed -mt-1">
                  <i
                    class="fa-solid fa-lock text-flame-800 mr-1.5"
                    aria-hidden="true"
                  ></i>
                  Your information is kept private. This site is protected
                  by reCAPTCHA and the Google
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener"
                    class="underline hover:text-ink-500 transition-colors"
                    >Privacy Policy</a>
                  and
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noopener"
                    class="underline hover:text-ink-500 transition-colors"
                    >Terms of Service</a>
                  apply.
                </p>

                <!-- Submit row -->
                <div
                  class="flex items-center justify-between gap-4 flex-wrap pt-1">
                  <button
                    type="submit"
                    id="submit-btn"
                    class="btn-primary"
                    aria-describedby="submit-status">
                    <span id="btn-label">Send Message</span>
                    <i
                      id="btn-icon"
                      class="fa-solid fa-paper-plane text-xs"
                      aria-hidden="true"
                    ></i>
                  </button>
                  <p
                    id="submit-status"
                    class="text-fluid-xs text-ink-400"
                    aria-live="polite"
                    aria-atomic="true"
                  ></p>
                </div>
              </div>
              <!-- /flex flex-col gap-6 -->
            </form>
          </div>
          <!-- /form card -->
        </div>
        <!-- /form column -->

        <!-- ── SIDEBAR COLUMN ── -->
        <div
          class="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-5 lg:sticky lg:top-24 fade-in-up"
          data-delay="1">
          <!-- Availability card -->
          <div class="p-6 rounded-2xl bg-ink-900 border border-ink-800">
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center shrink-0">
                <span
                  class="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse block"
                  aria-hidden="true"
                ></span>
              </div>
              <h3
                class="font-heading font-semibold text-fluid-base text-ink-100">
                Currently Available
              </h3>
            </div>
            <p class="text-fluid-sm text-ink-500 leading-relaxed mb-4">
              Open to freelance, contract, and full-time opportunities.
              Let's talk about how I can help.
            </p>
            <ul class="flex flex-col gap-2.5" role="list">
              <li
                class="flex items-center gap-3 text-fluid-xs text-ink-400">
                <i
                  class="fa-solid fa-check text-flame-500 text-xs w-4 shrink-0 text-center"
                  aria-hidden="true"
                ></i>
                Freelance UI/UX &amp; Web Design
              </li>
              <li
                class="flex items-center gap-3 text-fluid-xs text-ink-400">
                <i
                  class="fa-solid fa-check text-flame-500 text-xs w-4 shrink-0 text-center"
                  aria-hidden="true"
                ></i>
                Contract &amp; Full-Time Roles
              </li>
              <li
                class="flex items-center gap-3 text-fluid-xs text-ink-400">
                <i
                  class="fa-solid fa-check text-flame-500 text-xs w-4 shrink-0 text-center"
                  aria-hidden="true"
                ></i>
                Consulting &amp; Design Review
              </li>
            </ul>
          </div>

          <!-- Direct contact card -->
          <div class="p-6 rounded-2xl bg-ink-900 border border-ink-800">
            <h3
              class="font-heading font-semibold text-fluid-xs text-ink-400 uppercase tracking-[0.15em] mb-4">
              Prefer Direct Contact?
            </h3>
            <!-- PLACEHOLDER: Replace with your real email -->
            <a
              href="mailto:hello@claydesigns.cc"
              class="flex items-center gap-3 group">
              <div
                class="w-9 h-9 rounded-xl bg-flame-500/10 flex items-center justify-center shrink-0 group-hover:bg-flame-500/20 transition-colors duration-200">
                <i
                  class="fa-solid fa-envelope text-flame-500 text-xs"
                  aria-hidden="true"
                ></i>
              </div>
              <div>
                <p class="text-fluid-xs text-ink-400 mb-0.5">Email</p>
                <p
                  class="font-heading font-semibold text-fluid-sm text-ink-200 group-hover:text-flame-400 transition-colors duration-200">
                  hello@claydesigns.cc
                </p>
              </div>
            </a>
          </div>

          <!-- Social links card -->
          <div class="p-6 rounded-2xl bg-ink-900 border border-ink-800">
            <h3
              class="font-heading font-semibold text-fluid-xs text-ink-400 uppercase tracking-[0.15em] mb-4">
              Find Me Online
            </h3>
            <div class="flex flex-col gap-3">
              <!-- PLACEHOLDER: Update href values -->
              <a
                href="https://www.linkedin.com/in/clay-cauley"
                class="flex items-center gap-3 group"
                target="_blank">
                <div
                  class="w-9 h-9 rounded-xl bg-ink-800 flex items-center justify-center shrink-0 group-hover:bg-[#0A66C2]/20 transition-colors duration-200">
                  <i
                    class="fa-brands fa-linkedin-in text-ink-500 group-hover:text-[#0A66C2] transition-colors duration-200 text-xs"
                    aria-hidden="true"
                  ></i>
                </div>
                <span
                  class="font-heading font-semibold text-fluid-sm text-ink-400 group-hover:text-ink-100 transition-colors duration-200"
                  >LinkedIn</span>
              </a>
              <!-- <a href="#" class="flex items-center gap-3 group">
                <div
                  class="w-9 h-9 rounded-xl bg-ink-800 flex items-center justify-center shrink-0 group-hover:bg-ink-700 transition-colors duration-200">
                  <i
                    class="fa-brands fa-github text-ink-500 group-hover:text-ink-100 transition-colors duration-200 text-xs"
                    aria-hidden="true"
                  ></i>
                </div>
                <span
                  class="font-heading font-semibold text-fluid-sm text-ink-400 group-hover:text-ink-100 transition-colors duration-200"
                  >GitHub</span>
              </a> -->
              <!-- <a href="#" class="flex items-center gap-3 group">
                <div
                  class="w-9 h-9 rounded-xl bg-ink-800 flex items-center justify-center shrink-0 group-hover:bg-[#EA4C89]/20 transition-colors duration-200">
                  <i
                    class="fa-brands fa-dribbble text-ink-500 group-hover:text-[#EA4C89] transition-colors duration-200 text-xs"
                    aria-hidden="true"
                  ></i>
                </div>
                <span
                  class="font-heading font-semibold text-fluid-sm text-ink-400 group-hover:text-ink-100 transition-colors duration-200"
                  >Dribbble</span>
              </a> -->
            </div>
          </div>

          <!-- What happens next -->
          <div class="p-6 rounded-2xl bg-ink-900 border border-ink-800">
            <h3
              class="font-heading font-semibold text-fluid-xs text-ink-400 uppercase tracking-[0.15em] mb-5">
              What Happens Next?
            </h3>
            <ol class="flex flex-col gap-5" role="list">
              <li class="flex items-start gap-3">
                <span
                  class="w-7 h-7 rounded-full bg-flame-500/10 border border-flame-500/30 flex items-center justify-center shrink-0 text-flame-500 font-heading font-bold text-fluid-xs mt-0.5"
                  aria-hidden="true"
                  >1</span>
                <div>
                  <p
                    class="font-heading font-semibold text-fluid-sm text-ink-200 mb-0.5">
                    I read your message
                  </p>
                  <p class="text-fluid-xs text-ink-400 leading-relaxed">
                    I personally review every inquiry — no bots, no
                    copy-paste replies.
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="w-7 h-7 rounded-full bg-flame-500/10 border border-flame-500/30 flex items-center justify-center shrink-0 text-flame-500 font-heading font-bold text-fluid-xs mt-0.5"
                  aria-hidden="true"
                  >2</span>
                <div>
                  <p
                    class="font-heading font-semibold text-fluid-sm text-ink-200 mb-0.5">
                    I reply within 24 hours
                  </p>
                  <p class="text-fluid-xs text-ink-400 leading-relaxed">
                    You'll get a thoughtful response — usually much sooner.
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="w-7 h-7 rounded-full bg-flame-500/10 border border-flame-500/30 flex items-center justify-center shrink-0 text-flame-500 font-heading font-bold text-fluid-xs mt-0.5"
                  aria-hidden="true"
                  >3</span>
                <div>
                  <p
                    class="font-heading font-semibold text-fluid-sm text-ink-200 mb-0.5">
                    We schedule a call
                  </p>
                  <p class="text-fluid-xs text-ink-400 leading-relaxed">
                    If it's a good fit, we'll jump on a quick discovery call
                    to nail down the details.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
        <!-- /sidebar -->
      </div>
    </div>
  </section>
</main>

<?php include "partials/footer.php"; ?>
