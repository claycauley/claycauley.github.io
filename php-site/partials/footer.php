    <footer class="site-footer" role="contentinfo">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 py-14 lg:py-16">
        <!-- Footer top: 3-column grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-ink-800">
          <!-- Brand column -->
          <div>
            <a
              href="index.php"
              class="inline-flex items-baseline mb-4 group"
              aria-label="Clay — Home">
              <span
                class="font-heading font-bold text-fluid-2xl text-ink-50 leading-none transition-colors group-hover:text-flame-400"
                >Clay</span>
              <span
                class="font-heading font-bold text-fluid-2xl text-flame-500 leading-none"
                >.</span>
            </a>
            <p class="text-fluid-sm text-ink-400 leading-relaxed mb-6">
              Web UI/UX Designer &amp; Front-End Developer crafting modern
              digital experiences.
            </p>
            <div class="flex gap-3">
              <a
                href="http://linkedin.com/in/clay-cauley"
                class="social-btn"
                aria-label="LinkedIn"
                target="_blank"
                ><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i
              ></a>
            </div>
          </div>

          <!-- Navigation column -->
          <div>
            <h4
              class="font-heading font-semibold text-fluid-xs text-ink-200 uppercase tracking-[0.15em] mb-5">
              Navigate
            </h4>
            <ul class="flex flex-col gap-3" role="list">
              <li><a href="index.php"    class="footer-link">Home</a></li>
              <li><a href="about.php"    class="footer-link">About</a></li>
              <li><a href="projects.php" class="footer-link">Projects</a></li>
              <li><a href="contact.php"  class="footer-link">Contact</a></li>
            </ul>
          </div>

          <!-- Contact column -->
          <div>
            <h4
              class="font-heading font-semibold text-fluid-xs text-ink-200 uppercase tracking-[0.15em] mb-5">
              Get In Touch
            </h4>
            <ul class="flex flex-col gap-4" role="list">
              <li>
                <a
                  href="mailto:hello@claydesigns.cc"
                  class="footer-link flex items-center gap-3 group">
                  <i
                    class="fa-solid fa-envelope text-flame-700 group-hover:text-flame-500 transition-colors w-4 text-center shrink-0"
                    aria-hidden="true"
                  ></i>
                  hello@claydesigns.cc
                </a>
              </li>
              <li>
                <a
                  href="contact.php"
                  class="footer-link flex items-center gap-3 group">
                  <i
                    class="fa-solid fa-comment-dots text-flame-700 group-hover:text-flame-500 transition-colors w-4 text-center shrink-0"
                    aria-hidden="true"
                  ></i>
                  Start a project
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Footer bottom -->
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8">
          <p class="text-fluid-xs text-ink-500">
            &copy; <span id="footer-year"><?= date(
                "Y",
            ) ?></span> Clay. All rights reserved.
          </p>
          <p class="text-fluid-xs text-ink-500">
            Designed &amp; Built by Clay
            <i
              class="fa-solid fa-heart text-flame-700 ml-1"
              aria-label="with love"
            ></i>
          </p>
        </div>
      </div>
    </footer>

    <script src="js/main.js"></script>
  </body>
</html>
