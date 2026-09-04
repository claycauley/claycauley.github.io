<?php
$pageTitle = "Clay | Web Designer &amp; Front-End Developer";
$pageDescription =
    "Clay — Web Designer &amp; Front-End Developer crafting modern, high-performance digital experiences.";
$currentPage = "home";
include "partials/header.php";
?>

<main id="main-content">
  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     HERO SECTION
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
  <section
    id="hero"
    class="relative min-h-screen flex items-center pt-[4.5rem] lg:pt-20 overflow-hidden"
    aria-label="Introduction">
    <!-- Background: grid lines + glow blobs -->
    <div
      class="absolute inset-0 grid-lines pointer-events-none"
      aria-hidden="true"
    ></div>
    <div
      class="absolute top-1/3 right-1/4 w-[500px] h-[500px] flame-glow opacity-25 pointer-events-none"
      aria-hidden="true"
    ></div>
    <div
      class="absolute bottom-1/4 left-1/6 w-72 h-72 flame-glow opacity-10 pointer-events-none"
      aria-hidden="true"
    ></div>

    <div
      class="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <!-- Layout: photo on top mobile / text-left photo-right desktop -->
      <div
        class="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
        <!-- ── Photo Column ── -->
        <div class="relative shrink-0 fade-in-up">
          <!-- Orange glow behind photo -->
          <div
            class="absolute inset-0 translate-x-6 translate-y-6 rounded-3xl bg-flame-500 opacity-20 blur-3xl pointer-events-none"
            aria-hidden="true"
          ></div>

          <!-- Photo frame -->
          <div
            class="relative w-64 h-80 sm:w-72 sm:h-96 lg:w-[360px] lg:h-[460px] rounded-3xl overflow-hidden border border-ink-700 shadow-2xl">
            <!-- PLACEHOLDER: Replace with your photo -->
            <img
              src="dist/img/profile.webp"
              alt="Clay — Web Designer & Front-End Developer"
              class="w-full h-full object-cover object-top"
              width="360"
              height="460"
            />
            <!-- Subtle bottom gradient -->
            <div
              class="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-950/60 to-transparent pointer-events-none"
            ></div>
          </div>

          <!-- Decorative corner accent -->
          <div
            class="absolute -bottom-5 -right-5 w-20 h-20 rounded-2xl border-2 border-flame-500/40 pointer-events-none"
            aria-hidden="true"
          ></div>

          <!-- Decorative dot grid -->
          <div
            class="absolute -top-8 -left-8 w-20 h-20 dot-grid opacity-50 pointer-events-none"
            aria-hidden="true"
          ></div>

          <!-- Available badge -->
          <div
            class="absolute -bottom-3 left-6 flex items-center gap-2 bg-ink-900 border border-ink-700 rounded-full px-4 py-2 shadow-xl">
            <span
              class="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0"
            ></span>
            <span
              class="font-heading font-semibold text-fluid-xs text-ink-100"
              >Available for work</span>
          </div>
        </div>

        <!-- ── Text Column ── -->
        <div class="flex-1 text-center md:text-left">
          <!-- Eyebrow label -->
          <p
            class="section-label justify-center md:justify-start mb-5 fade-in-up">
            Web UI/UX Designer &amp; Front-End Developer
          </p>

          <!-- Heading -->
          <h1
            class="font-heading font-bold leading-[1.05] tracking-tight mb-5 fade-in-up"
            data-delay="1">
            <span class="block text-fluid-display text-ink-50"
              >Hello, I'm</span>
            <span class="block text-fluid-display text-flame-500"
              >Clay.</span>
          </h1>

          <!-- Subtitle tagline -->
          <p
            class="font-heading font-medium text-fluid-xl text-ink-300 mb-6 fade-in-up"
            data-delay="1">
            I build things people
            <em class="not-italic text-flame-400">love</em> to use.
          </p>

          <!-- Bio blurb -->
          <!-- PLACEHOLDER: Replace with your actual bio -->
          <p
            class="text-fluid-base text-ink-400 leading-relaxed mb-10 max-w-xl mx-auto md:mx-0 fade-in-up"
            data-delay="2">
            I'm a web UI/UX designer with front-end development experience
            and a passion for creating beautifully accessible digital
            experiences. Seeing a project through, from design idea to
            completion, and building websites that look great, load fast,
            and work for everyone.
          </p>

          <!-- Stats row -->
          <div
            class="flex flex-wrap gap-8 justify-center md:justify-start mb-10 fade-in-up"
            data-delay="2">
            <div class="text-center md:text-left">
              <div
                class="font-heading font-bold text-fluid-4xl text-flame-500 leading-none">
                15+
              </div>
              <!-- PLACEHOLDER: Update number -->
              <div
                class="text-fluid-xs text-ink-500 mt-1 uppercase tracking-widest">
                Years Experience
              </div>
            </div>
            <div class="hidden sm:block w-px bg-ink-800 self-stretch"></div>
            <div class="text-center md:text-left">
              <div
                class="font-heading font-bold text-fluid-4xl text-flame-500 leading-none">
                50+
              </div>
              <!-- PLACEHOLDER: Update number -->
              <div
                class="text-fluid-xs text-ink-500 mt-1 uppercase tracking-widest">
                Projects Delivered
              </div>
            </div>
            <div class="hidden sm:block w-px bg-ink-800 self-stretch"></div>
            <div class="text-center md:text-left">
              <div
                class="font-heading font-bold text-fluid-4xl text-flame-500 leading-none">
                20+
              </div>
              <!-- PLACEHOLDER: Update number -->
              <div
                class="text-fluid-xs text-ink-500 mt-1 uppercase tracking-widest">
                Brands Partnered
              </div>
            </div>
          </div>

          <!-- CTAs -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start fade-in-up"
            data-delay="3">
            <a href="projects.php" class="btn-primary">
              View My Work
              <i
                class="fa-solid fa-arrow-right text-xs"
                aria-hidden="true"
              ></i>
            </a>
            <a href="about.php" class="btn-outline"> About Me </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll hint -->
    <div
      class="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-50 pointer-events-none"
      aria-hidden="true">
      <span
        class="font-body text-ink-500 text-fluid-xs tracking-[0.2em] uppercase"
        >Scroll</span>
      <i
        class="fa-solid fa-chevron-down text-flame-500 text-xs animate-bounce"
      ></i>
    </div>
  </section>

  <!-- Divider -->
  <div class="section-divider" role="separator" aria-hidden="true"></div>

  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     WHAT I DO — Services
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
  <section
    id="what-i-do"
    class="section"
    aria-labelledby="services-heading">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <!-- Section header -->
      <div class="text-center mb-14 fade-in-up">
        <p class="section-label justify-center">What I Do</p>
        <h2 id="services-heading" class="section-title mt-3">
          From Concept to<br />
          <span class="text-flame-500">Pixel Perfect Code</span>
        </h2>
        <!-- PLACEHOLDER: Replace with your services intro copy -->
        <p class="section-subtitle max-w-2xl mx-auto">
          Using strategic thinking with hands-on designing, I create layouts
          that engage users and help visitors navigate in a way that makes
          sense.
        </p>
      </div>

      <!-- Services grid -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        <!-- Card 1 -->
        <div class="service-card fade-in-up">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-flame-500/10">
            <i
              class="fa-solid fa-pen-ruler text-flame-500 text-xl"
              aria-hidden="true"
            ></i>
          </div>
          <h3
            class="font-heading font-semibold text-fluid-xl text-ink-50 mb-3">
            Web Design
          </h3>
          <!-- PLACEHOLDER -->
          <p class="text-fluid-sm text-ink-500 leading-relaxed">
            Visually compelling, user-centered designs that communicate the
            brand story and guide visitors toward meaningful action.
          </p>
        </div>

        <!-- Card 2 -->
        <div class="service-card fade-in-up" data-delay="1">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-flame-500/10">
            <i
              class="fa-solid fa-code text-flame-500 text-xl"
              aria-hidden="true"
            ></i>
          </div>
          <h3
            class="font-heading font-semibold text-fluid-xl text-ink-50 mb-3">
            Front-End Dev
          </h3>
          <!-- PLACEHOLDER -->
          <p class="text-fluid-sm text-ink-500 leading-relaxed">
            Clean, semantic HTML, modern CSS, and performant JavaScript that
            brings designs to life with precision and care.
          </p>
        </div>

        <!-- Card 3 -->
        <div class="service-card fade-in-up" data-delay="2">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-flame-500/10">
            <i
              class="fa-solid fa-object-group text-flame-500 text-xl"
              aria-hidden="true"
            ></i>
          </div>
          <h3
            class="font-heading font-semibold text-fluid-xl text-ink-50 mb-3">
            UI/UX Design
          </h3>
          <!-- PLACEHOLDER -->
          <p class="text-fluid-sm text-ink-500 leading-relaxed">
            Intuitive user experiences grounded in research and validated
            through testing. Every interaction is intentional.
          </p>
        </div>

        <!-- Card 4 -->
        <div class="service-card fade-in-up" data-delay="3">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-flame-500/10">
            <i
              class="fa-brands fa-accessible-icon text-flame-500 text-xl"
              aria-hidden="true"
            ></i>
          </div>
          <h3
            class="font-heading font-semibold text-fluid-xl text-ink-50 mb-3">
            Accessibility
          </h3>
          <!-- PLACEHOLDER -->
          <p class="text-fluid-sm text-ink-500 leading-relaxed">
            Clean code is the foundation of accessibility. Ensuring all
            elements are properly labeled and structured for assistive
            technologies.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Divider -->
  <div class="section-divider" role="separator" aria-hidden="true"></div>

  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     MY PROCESS
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
  <section id="process" class="section" aria-labelledby="process-heading">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <!-- Section header — two-column layout on desktop -->
      <div class="flex flex-col lg:flex-row lg:items-end gap-8 mb-14">
        <div class="flex-1 fade-in-up">
          <p class="section-label">My Process</p>
          <h2 id="process-heading" class="section-title mt-3">
            How I Turn Ideas<br />
            <span class="text-flame-500">Into Reality</span>
          </h2>
        </div>
        <!-- PLACEHOLDER: Replace with your process intro copy -->
        <p
          class="lg:max-w-xs xl:max-w-sm text-fluid-base text-ink-500 leading-relaxed fade-in-up">
          Every great project starts with a clear plan. Researching and
          coming up with a thoughtful process is how I ensure the best
          results — and the best experience for users.
        </p>
      </div>

      <!-- Steps grid -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        <!-- Step 1 -->
        <div class="process-step fade-in-up">
          <div class="absolute -top-4 left-6">
            <span
              class="inline-block px-3 py-1 rounded-full font-heading font-bold text-sm bg-flame-500 text-ink-950"
              >01</span>
          </div>
          <div class="mt-4">
            <h3
              class="font-heading font-semibold text-fluid-xl text-ink-50 mb-3">
              Discover
            </h3>
            <!-- PLACEHOLDER -->
            <p class="text-fluid-sm text-ink-500 leading-relaxed">
              Finding out who you are and what you want to accomplish is
              always the first step. You can't design without without an end
              goal in mind.
            </p>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="process-step fade-in-up" data-delay="1">
          <div class="absolute -top-4 left-6">
            <span
              class="inline-block px-3 py-1 rounded-full font-heading font-bold text-sm bg-flame-500/20 text-flame-400"
              >02</span>
          </div>
          <div class="mt-4">
            <h3
              class="font-heading font-semibold text-fluid-xl text-ink-50 mb-3">
              Design
            </h3>
            <!-- PLACEHOLDER -->
            <p class="text-fluid-sm text-ink-500 leading-relaxed">
              Wireframes, prototypes, and high-fidelity mockups. Working
              together and iterating upon feedback until every detail is
              correct.
            </p>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="process-step fade-in-up" data-delay="2">
          <div class="absolute -top-4 left-6">
            <span
              class="inline-block px-3 py-1 rounded-full font-heading font-bold text-sm bg-flame-500/20 text-flame-400"
              >03</span>
          </div>
          <div class="mt-4">
            <h3
              class="font-heading font-semibold text-fluid-xl text-ink-50 mb-3">
              Develop
            </h3>
            <!-- PLACEHOLDER -->
            <p class="text-fluid-sm text-ink-500 leading-relaxed">
              Clean, accessible, performance-optimized code. Or developer
              ready Figma files. Built for speed, scalability, and a smooth
              handoff.
            </p>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="process-step fade-in-up" data-delay="3">
          <div class="absolute -top-4 left-6">
            <span
              class="inline-block px-3 py-1 rounded-full font-heading font-bold text-sm bg-flame-500/20 text-flame-400"
              >04</span>
          </div>
          <div class="mt-4">
            <h3
              class="font-heading font-semibold text-fluid-xl text-ink-50 mb-3">
              Launch
            </h3>
            <!-- PLACEHOLDER -->
            <p class="text-fluid-sm text-ink-500 leading-relaxed">
              Thorough QA and post-launch monitoring. I'm here to support
              your growth. Not leave you high and dry when the project is
              done.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom CTA banner -->
      <div
        class="mt-14 p-8 lg:p-12 rounded-3xl border border-ink-800 flex flex-col lg:flex-row items-center justify-between gap-8 fade-in-up overflow-hidden relative"
        style="
          background: linear-gradient(135deg, #1f1614 0%, #2a1810 100%);
        ">
        <!-- Decorative glow -->
        <div
          class="absolute -right-16 -top-16 w-64 h-64 flame-glow opacity-30 pointer-events-none"
          aria-hidden="true"
        ></div>

        <div class="relative text-center lg:text-left">
          <h3
            class="font-heading font-bold text-fluid-3xl text-ink-50 mb-2">
            Ready to start your project?
          </h3>
          <!-- PLACEHOLDER -->
          <p class="text-fluid-base text-ink-500">
            Let's talk about what you're building.
          </p>
        </div>

        <div class="relative flex flex-col sm:flex-row gap-4 shrink-0">
          <a href="contact.php" class="btn-primary">
            Start a Conversation
            <i
              class="fa-solid fa-arrow-right text-xs"
              aria-hidden="true"
            ></i>
          </a>
          <a href="projects.php" class="btn-outline"> See My Work </a>
        </div>
      </div>
    </div>
  </section>
</main>

<?php include "partials/footer.php"; ?>
