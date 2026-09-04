/* ==========================================================================
   CLAY PORTFOLIO — main.js
   ========================================================================== */

(function () {
  "use strict";

  /* -----------------------------------------------------------------------
     HEADER — scroll state
     ----------------------------------------------------------------------- */
  const header = document.getElementById("site-header");

  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Run on load in case page is already scrolled
  }

  /* -----------------------------------------------------------------------
     SCROLL HINT — fade out when scrolled, restore at top
     ----------------------------------------------------------------------- */
  const scrollHints = document.querySelectorAll(".scroll-hint");

  if (scrollHints.length) {
    const onScrollHint = () => {
      const hide = window.scrollY > 50;
      scrollHints.forEach((el) => el.classList.toggle("is-scrolled", hide));
    };
    window.addEventListener("scroll", onScrollHint, { passive: true });
    onScrollHint(); // Run on load
  }

  /* -----------------------------------------------------------------------
     MOBILE MENU
     ----------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileOverlay = document.getElementById("mobile-overlay");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileClose = document.getElementById("mobile-close");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function openMenu() {
    if (!hamburgerBtn || !mobileOverlay || !mobileDrawer) return;
    hamburgerBtn.classList.add("open");
    mobileOverlay.classList.add("open");
    mobileDrawer.classList.add("open");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    // Move focus to the close button
    if (mobileClose) mobileClose.focus();
  }

  function closeMenu() {
    if (!hamburgerBtn || !mobileOverlay || !mobileDrawer) return;
    hamburgerBtn.classList.remove("open");
    mobileOverlay.classList.remove("open");
    mobileDrawer.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    hamburgerBtn.focus();
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      mobileDrawer.classList.contains("open") ? closeMenu() : openMenu();
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", closeMenu);
  }

  mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      mobileDrawer &&
      mobileDrawer.classList.contains("open")
    ) {
      closeMenu();
    }
  });

  // Trap focus inside drawer while open
  if (mobileDrawer) {
    mobileDrawer.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !mobileDrawer.classList.contains("open")) return;
      const focusable = mobileDrawer.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* -----------------------------------------------------------------------
     SCROLL ANIMATIONS — IntersectionObserver
     ----------------------------------------------------------------------- */
  const fadeEls = document.querySelectorAll(".fade-in-up");

  if ("IntersectionObserver" in window && fadeEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    fadeEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: make all visible immediately
    fadeEls.forEach((el) => el.classList.add("visible"));
  }

  /* -----------------------------------------------------------------------
     ACTIVE NAV LINK — highlight current page
     ----------------------------------------------------------------------- */
  const currentFile = window.location.pathname.split("/").pop() || "index.php";
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
    const href = (link.getAttribute("href") || "").split("/").pop();
    if (href === currentFile || (currentFile === "" && href === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* -----------------------------------------------------------------------
     DYNAMIC COPYRIGHT YEAR
     ----------------------------------------------------------------------- */
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------------------
     SMOOTH SCROLL — anchor links
     ----------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 80;
        const top =
          target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* -----------------------------------------------------------------------
     CONTACT FORM — Validation, reCAPTCHA bridge, and submission
     ----------------------------------------------------------------------- */
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    // Field definitions — element + error element + validation rule
    const fields = {
      name: {
        el: document.getElementById("field-name"),
        error: document.getElementById("error-name"),
        validate: (v) => v.trim().length >= 2,
      },
      email: {
        el: document.getElementById("field-email"),
        error: document.getElementById("error-email"),
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      },
      subject: {
        el: document.getElementById("field-subject"),
        error: document.getElementById("error-subject"),
        validate: (v) => v.trim().length >= 1,
      },
      message: {
        el: document.getElementById("field-message"),
        error: document.getElementById("error-message"),
        validate: (v) => v.trim().length >= 20,
      },
    };

    const submitBtn = document.getElementById("submit-btn");
    const btnLabel = document.getElementById("btn-label");
    const btnIcon = document.getElementById("btn-icon");
    const submitStatus = document.getElementById("submit-status");
    const formSuccess = document.getElementById("form-success");
    const resetFormBtn = document.getElementById("reset-form-btn");
    const textarea = document.getElementById("field-message");
    const charCount = document.getElementById("char-count");

    // ── Helpers ─────────────────────────────────────────────────────────

    function markError(field) {
      if (!field.el) return;
      field.el.classList.add("error");
      field.el.classList.remove("valid");
      field.el.setAttribute("aria-invalid", "true");
      if (field.error) field.error.classList.add("visible");
    }

    function markValid(field) {
      if (!field.el) return;
      field.el.classList.remove("error");
      field.el.classList.add("valid");
      field.el.removeAttribute("aria-invalid");
      if (field.error) field.error.classList.remove("visible");
    }

    function validateField(key) {
      const field = fields[key];
      if (!field || !field.el) return true;
      const ok = field.validate(field.el.value);
      ok ? markValid(field) : markError(field);
      return ok;
    }

    function validateAllFields() {
      const results = Object.keys(fields).map((key) => validateField(key));
      return results.every(Boolean);
    }

    function setButtonState(state) {
      if (!submitBtn) return;
      if (state === "loading") {
        submitBtn.setAttribute("data-state", "loading");
        submitBtn.setAttribute("aria-disabled", "true");
        if (btnLabel) btnLabel.textContent = "Sending…";
        if (btnIcon) btnIcon.className = "fa-solid fa-spinner fa-spin text-xs";
        if (submitStatus) submitStatus.textContent = "";
      } else if (state === "success") {
        submitBtn.setAttribute("data-state", "success");
        if (btnLabel) btnLabel.textContent = "Sent!";
        if (btnIcon) btnIcon.className = "fa-solid fa-check text-xs";
      } else {
        // idle
        submitBtn.removeAttribute("data-state");
        submitBtn.removeAttribute("aria-disabled");
        if (btnLabel) btnLabel.textContent = "Send Message";
        if (btnIcon) btnIcon.className = "fa-solid fa-paper-plane text-xs";
      }
    }

    // ── Real-time validation (blur = full check; input = clear error only) ─

    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      if (!field.el) return;

      // Validate when user leaves the field (only if they typed something)
      field.el.addEventListener("blur", () => {
        if (field.el.value.length > 0) validateField(key);
      });

      // As soon as the error clears, re-validate on every keystroke
      field.el.addEventListener("input", () => {
        if (field.el.classList.contains("error")) validateField(key);
      });
    });

    // ── Live character counter ───────────────────────────────────────────

    if (textarea && charCount) {
      textarea.addEventListener("input", () => {
        const len = textarea.value.length;
        charCount.textContent = `${len} / 2000`;
        charCount.style.color = len > 1900 ? "#e8621e" : "";
      });
    }

    // ── reCAPTCHA v3 site key — must match the key in the <script> src ─────
    const RECAPTCHA_V3_SITE_KEY = "6LfX2RctAAAAAN5DxWTBLJfVTVmbtyJuNVWtMagZ";

    // ── Submit handler ───────────────────────────────────────────────────

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateAllFields()) {
        const firstInvalid = contactForm.querySelector(".contact-input.error");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      setButtonState("loading");

      // v3: grecaptcha.ready wraps grecaptcha.execute — fully silent, no widget
      if (window.grecaptcha && typeof window.grecaptcha.ready === "function") {
        window.grecaptcha.ready(function () {
          window.grecaptcha
            .execute(RECAPTCHA_V3_SITE_KEY, { action: "contact" })
            .then(function (token) {
              submitFormData(token);
            })
            .catch(function () {
              // Token generation failed — submit without token (PHP will decide)
              submitFormData(null);
            });
        });
      } else {
        // reCAPTCHA script not loaded yet — submit without token
        submitFormData(null);
      }
    });

    // ── Form submission logic ────────────────────────────────────────────

    function submitFormData(recaptchaToken) {
      const payload = {
        name: document.getElementById("field-name").value.trim(),
        email: document.getElementById("field-email").value.trim(),
        subject: document.getElementById("field-subject").value.trim(),
        message: document.getElementById("field-message").value.trim(),
        "g-recaptcha-response": recaptchaToken || "",
      };

      fetch("mailer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          // Guard against non-JSON responses (PHP fatal errors, etc.)
          return res.text().then((text) => {
            try {
              const data = JSON.parse(text);
              return { ok: res.ok, data };
            } catch (_) {
              // Log the raw PHP output to the browser console for debugging
              console.error("contact.php raw response:", text);
              return {
                ok: false,
                data: { error: "Server error — please email me directly." },
              };
            }
          });
        })
        .then(({ ok, data }) => {
          if (ok) {
            showSuccess();
          } else {
            showFormError(
              data.error || "Something went wrong — please try again.",
            );
          }
        })
        .catch(() => {
          showFormError(
            "Network error — please check your connection and try again.",
          );
        });
    }

    // ── Outcome helpers ──────────────────────────────────────────────────

    function showSuccess() {
      contactForm.style.display = "none";
      if (formSuccess) {
        formSuccess.classList.add("visible");
        formSuccess.focus();
      }
      setButtonState("idle");
    }

    function showFormError(message) {
      setButtonState("idle");
      if (submitStatus) {
        submitStatus.textContent =
          message || "Something went wrong. Please try again.";
      }
    }

    // ── Reset (Send Another Message button inside success state) ─────────

    if (resetFormBtn) {
      resetFormBtn.addEventListener("click", () => {
        contactForm.reset();
        contactForm.style.display = "";

        if (formSuccess) formSuccess.classList.remove("visible");
        if (charCount) charCount.textContent = "0 / 2000";
        if (submitStatus) submitStatus.textContent = "";

        // Clear all field validation classes
        Object.values(fields).forEach((field) => {
          if (!field.el) return;
          field.el.classList.remove("error", "valid");
          field.el.removeAttribute("aria-invalid");
          if (field.error) field.error.classList.remove("visible");
        });

        setButtonState("idle");

        // Move focus back to the first field
        const firstField = document.getElementById("field-name");
        if (firstField) firstField.focus();
      });
    }
  } // end if (contactForm)
})();
