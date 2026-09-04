<?php
$pageTitle = "Projects | Clay";
$pageDescription = "Projects by Clay — Web Designer &amp; Front-End Developer.";
$currentPage = "projects";
include "partials/header.php";
?>

<main id="main-content">
  <!-- ================================================================
       HERO
       ================================================================ -->
  <section
    id="projects-hero"
    class="relative min-h-screen flex items-center pt-[4.5rem] lg:pt-20 overflow-hidden"
    aria-label="Projects overview">
    <!-- Background treatments -->
    <div
      class="absolute inset-0 grid-lines pointer-events-none"
      aria-hidden="true"
    ></div>
    <div
      class="absolute top-1/2 right-1/4 -translate-y-1/2 w-[640px] h-[640px] flame-glow opacity-20 pointer-events-none"
      aria-hidden="true"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-80 h-80 flame-glow opacity-10 pointer-events-none"
      aria-hidden="true"
    ></div>

    <div
      class="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <!-- LEFT: Editorial text -->
        <div class="flex-1 text-center lg:text-left">
          <p
            class="section-label justify-center lg:justify-start mb-6 fade-in-up">
            Featured Work
          </p>

          <h1
            class="font-heading font-bold leading-[1.04] tracking-tight mb-6 fade-in-up"
            data-delay="1">
            <span class="block text-fluid-display text-ink-50"
              >Projects</span>
            <span class="block text-fluid-display text-ink-50"
              >That Push Me</span>
            <span class="block text-fluid-display text-flame-500"
              >Forward.</span>
          </h1>

          <!-- PLACEHOLDER: Update intro copy -->
          <p
            class="text-fluid-lg text-ink-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 fade-in-up"
            data-delay="2">
            From brand-defining redesigns, personal projects and simple site updates, this is a curated selection of the work I'm genuinely proud to put my name on.
          </p>

          <!-- Quick stats -->
          <div
            class="flex flex-wrap gap-8 justify-center lg:justify-start mb-10 fade-in-up"
            data-delay="2">
            <div class="text-center lg:text-left">
              <div
                class="font-heading font-bold text-fluid-4xl text-flame-500 leading-none">
                5
              </div>
              <div
                class="text-fluid-xs text-ink-500 mt-1 uppercase tracking-widest">
                Featured Projects
              </div>
            </div>
            <div class="hidden sm:block w-px bg-ink-800 self-stretch"></div>
            <div class="text-center lg:text-left">
              <!-- PLACEHOLDER: Update number -->
              <div
                class="font-heading font-bold text-fluid-4xl text-flame-500 leading-none">
                50+
              </div>
              <div
                class="text-fluid-xs text-ink-500 mt-1 uppercase tracking-widest">
                Total Projects
              </div>
            </div>
            <div class="hidden sm:block w-px bg-ink-800 self-stretch"></div>
            <div class="text-center lg:text-left">
              <!-- PLACEHOLDER: Update number -->
              <div
                class="font-heading font-bold text-fluid-4xl text-flame-500 leading-none">
                15+
              </div>
              <div
                class="text-fluid-xs text-ink-500 mt-1 uppercase tracking-widest">
                Brands Worked With
              </div>
            </div>
          </div>

          <!-- Jump-to links -->
          <!-- PLACEHOLDER: Update project names to match your real project titles -->
          <div
            class="flex flex-wrap gap-3 justify-center lg:justify-start fade-in-up"
            data-delay="3">
            <a
              href="#project-01"
              class="btn-outline !text-fluid-xs !px-4 !py-2 gap-2">
              <span class="text-flame-500 font-bold">01</span> Fruit of the Loom
            </a>
            <a
              href="#project-02"
              class="btn-outline !text-fluid-xs !px-4 !py-2 gap-2">
              <span class="text-flame-500 font-bold">02</span> Vanity Fair Lingerie
            </a>
            <a
              href="#project-03"
              class="btn-outline !text-fluid-xs !px-4 !py-2 gap-2">
              <span class="text-flame-500 font-bold">03</span> Russell Athletic
            </a>
            <a
              href="#project-04"
              class="btn-outline !text-fluid-xs !px-4 !py-2 gap-2">
              <span class="text-flame-500 font-bold">04</span> Spalding
            </a>
            <a
              href="#project-05"
              class="btn-outline !text-fluid-xs !px-4 !py-2 gap-2">
              <span class="text-flame-500 font-bold">05</span> Bitesized Blackjack
            </a>
          </div>
        </div>

        <!-- RIGHT: Hero preview image -->
        <div
          class="relative shrink-0 w-full max-w-sm lg:max-w-[420px] fade-in-up"
          data-delay="1">
          <!-- Glow -->
          <div
            class="absolute inset-0 translate-x-6 translate-y-6 rounded-3xl bg-flame-500 opacity-15 blur-3xl pointer-events-none"
            aria-hidden="true"
          ></div>

          <div
            class="relative rounded-3xl overflow-hidden border border-ink-700 shadow-2xl aspect-square">
            <!-- PLACEHOLDER: Replace with a hero project image -->
            <img
              src="dist/img/projects-featured.webp"
              alt="Featured project preview"
              class="w-full h-full object-cover"
              width="480"
              height="480"
            />
            <!-- Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-tr from-ink-950/60 via-transparent to-transparent pointer-events-none"
            ></div>
            <!-- Latest badge -->
            <div
              class="absolute top-4 left-4 flex items-center gap-2 bg-ink-900/90 backdrop-blur-sm border border-ink-700 rounded-full px-3 py-1.5">
              <span
                class="w-2 h-2 rounded-full bg-flame-500 animate-pulse shrink-0"
              ></span>
              <span
                class="font-heading font-semibold text-fluid-xs text-ink-200"
                >Latest Project</span>
            </div>
          </div>

          <!-- Floating metric card -->
          <!-- PLACEHOLDER: Update stat -->
          <div
            class="absolute -bottom-5 -right-5 bg-ink-900 border border-ink-700 rounded-2xl px-5 py-4 shadow-2xl">
            <p
              class="font-heading font-bold text-fluid-2xl text-flame-500 leading-none">
              PWA
            </p>
            <p class="text-fluid-xs text-ink-500 mt-0.5">
              Progressive Web App
            </p>
          </div>

          <!-- Dot grid -->
          <div
            class="absolute -top-8 -left-8 w-24 h-24 dot-grid opacity-40 pointer-events-none"
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </div>

    <!-- Scroll hint -->
    <div
      class="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-40 pointer-events-none"
      aria-hidden="true">
      <span
        class="font-body text-ink-500 text-fluid-xs tracking-[0.2em] uppercase"
        >Explore</span>
      <i
        class="fa-solid fa-chevron-down text-flame-500 text-xs animate-bounce"
      ></i>
    </div>
  </section>

  <div class="section-divider" role="separator" aria-hidden="true"></div>

  <!-- ================================================================
       FEATURED PROJECTS
       ================================================================ -->
  <section
    id="featured-projects"
    class="section"
    aria-labelledby="projects-heading">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <!-- Section header -->
      <div class="text-center mb-16 fade-in-up">
        <p class="section-label justify-center">The Work</p>
        <h2 id="projects-heading" class="section-title mt-3">
          Featured <span class="text-flame-500">Case Studies</span>
        </h2>
        <!-- PLACEHOLDER: Update intro copy -->
        <p class="section-subtitle max-w-2xl mx-auto">
          Each project came with its own set of challenges. Click through to
          read the full story behind the strategy, design, and execution.
        </p>
      </div>

      <!-- ── Projects List ── -->
      <div class="flex flex-col gap-8 lg:gap-10">
        <!-- ============================================================
             PROJECT 01  ·  Image LEFT  ·  Content RIGHT
             ============================================================ -->
        <article
          id="project-01"
          class="project-card fade-in-up"
          aria-labelledby="proj-01-title">
          <!-- Top bar -->
          <div
            class="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-ink-800">
            <span
              class="font-heading font-bold text-fluid-xs text-flame-500 tracking-[0.25em]"
              >01</span>
            <div class="flex gap-2">
              <!-- PLACEHOLDER: Update with your real categories -->
              <span class="skill-tag">Figma</span>
              <span class="skill-tag">Web Design</span>
              <span class="skill-tag">UI/UX</span>
              <span class="skill-tag">React.js</span>
            </div>
          </div>

          <!-- Body grid -->
          <div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr]">
            <!-- Image -->
            <div
              class="relative overflow-hidden aspect-video lg:aspect-auto lg:min-h-[420px] xl:min-h-[500px]">
              <!-- PLACEHOLDER: Replace with your real project screenshot -->
              <img
                src="dist/img/fruit/featured.webp"
                alt="Project One — replace with real screenshot"
                class="project-card-img"
                width="900"
                height="500"
              />
              <!-- Desktop fade edge blending image into content panel -->
              <div
                class="hidden lg:block absolute inset-y-0 right-0 w-40 bg-gradient-to-r from-transparent to-ink-900 pointer-events-none"
                aria-hidden="true"
              ></div>
              <!-- Year badge -->
              <div
                class="absolute bottom-4 left-4 bg-ink-950/80 backdrop-blur-sm border border-ink-700 rounded-full px-3 py-1">
                <!-- PLACEHOLDER: Update year -->
                <span
                  class="text-fluid-xs font-heading font-semibold text-flame-400"
                  >2023</span>
              </div>
            </div>

            <!-- Content -->
            <div
              class="flex flex-col justify-center p-8 lg:p-10 xl:p-12 relative">
              <!-- Decorative bg number -->
              <span
                class="absolute top-3 right-5 font-heading font-bold text-[6rem] lg:text-[8rem] leading-none text-ink-800/60 select-none pointer-events-none"
                aria-hidden="true"
                >01</span>

              <div class="relative z-10">
                <!-- PLACEHOLDER: Replace with your project title -->
                <h3
                  id="proj-01-title"
                  class="font-heading font-bold text-fluid-3xl text-ink-50 leading-tight mb-4">
                  Fruit of the Loom<br />
                  <span class="text-flame-500 text-fluid-xl">Website Redesign</span>
                </h3>
                <!-- PLACEHOLDER: Replace with your project description -->
                <p class="text-fluid-sm text-ink-400 leading-relaxed mb-6">
                  Fruit of the Loom was outdated and in dire need of a facelift. The challenge was migrating platforms and user data all while shifting to a headless archecture. Resulting in improved site performance and scalability.
                </p>
                <!-- PLACEHOLDER: Replace with a real standout metric -->
                <div
                  class="flex items-center gap-3 mb-8 p-4 rounded-xl bg-ink-950 border border-ink-800">
                  <i
                    class="fa-solid fa-arrow-trend-up text-flame-500 text-lg shrink-0"
                    aria-hidden="true"
                  ></i>
                  <div>
                    <p
                      class="font-heading font-bold text-fluid-lg text-flame-400">
                      +73%
                    </p>
                    <p class="text-fluid-xs text-ink-500">
                      Site Speed Improvement
                    </p>
                  </div>
                </div>
                <a href="fotl-case-study.php" class="btn-primary">
                  View Case Study
                  <i
                    class="fa-solid fa-arrow-right text-xs"
                    aria-hidden="true"
                  ></i>
                </a>
              </div>
            </div>
          </div>
        </article>

        <!-- ============================================================
             PROJECT 02  ·  Content LEFT  ·  Image RIGHT  (flipped)
             ============================================================ -->
        <article
          id="project-02"
          class="project-card fade-in-up"
          aria-labelledby="proj-02-title">
          <!-- Top bar -->
          <div
            class="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-ink-800">
            <div class="flex gap-2">
              <!-- PLACEHOLDER -->
              <span class="skill-tag">Front-End Dev</span>
              <span class="skill-tag">E-Commerce</span>
            </div>
            <span
              class="font-heading font-bold text-fluid-xs text-flame-500 tracking-[0.25em]"
              >02</span>
          </div>

          <!-- Body grid — content LEFT, image RIGHT -->
          <div class="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
            <!-- Content (stacks below image on mobile via order) -->
            <div
              class="flex flex-col justify-center p-8 lg:p-10 xl:p-12 relative order-2 lg:order-1">
              <span
                class="absolute top-3 left-5 font-heading font-bold text-[6rem] lg:text-[8rem] leading-none text-ink-800/60 select-none pointer-events-none"
                aria-hidden="true"
                >02</span>
              <div class="relative z-10">
                <!-- PLACEHOLDER -->
                <h3
                  id="proj-01-title"
                  class="font-heading font-bold text-fluid-3xl text-ink-50 leading-tight mb-4">
                  Vanity Fair Lingerie<br />
                  <span class="text-flame-500 text-fluid-xl">Website Redesign</span>
                </h3>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-ink-400 leading-relaxed mb-6">
                  Describe what makes this project stand out. What problem
                  did you solve? What was your specific role, and what
                  impact did it have on the client's business or their
                  users?
                </p>
                <!-- PLACEHOLDER -->
                <div
                  class="flex items-center gap-3 mb-8 p-4 rounded-xl bg-ink-950 border border-ink-800">
                  <i
                    class="fa-solid fa-arrow-trend-up text-flame-500 text-lg shrink-0"
                    aria-hidden="true"
                  ></i>
                  <div>
                    <p
                      class="font-heading font-bold text-fluid-lg text-flame-400">
                      +000%
                    </p>
                    <p class="text-fluid-xs text-ink-500">
                      Key result metric — PLACEHOLDER
                    </p>
                  </div>
                </div>
                <a href="case-study-template.php" class="btn-primary">
                  View Case Study
                  <i
                    class="fa-solid fa-arrow-right text-xs"
                    aria-hidden="true"
                  ></i>
                </a>
              </div>
            </div>

            <!-- Image -->
            <div
              class="relative overflow-hidden aspect-video lg:aspect-auto lg:min-h-[420px] xl:min-h-[500px] order-1 lg:order-2">
              <!-- PLACEHOLDER -->
              <img
                src="dist/img/vfl/featured.webp"
                alt="Project Two — replace with real screenshot"
                class="project-card-img"
                width="900"
                height="500"
              />
              <div
                class="hidden lg:block absolute inset-y-0 left-0 w-40 bg-gradient-to-l from-transparent to-ink-900 pointer-events-none"
                aria-hidden="true"
              ></div>
              <div
                class="absolute bottom-4 right-4 bg-ink-950/80 backdrop-blur-sm border border-ink-700 rounded-full px-3 py-1">
                <!-- PLACEHOLDER -->
                <span
                  class="text-fluid-xs font-heading font-semibold text-flame-400"
                  >2024</span>
              </div>
            </div>
          </div>
        </article>

        <!-- ============================================================
             PROJECT 03  ·  Image LEFT  ·  Content RIGHT
             ============================================================ -->
        <article
          id="project-03"
          class="project-card fade-in-up"
          aria-labelledby="proj-03-title">
          <!-- Top bar -->
          <div
            class="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-ink-800">
            <span
              class="font-heading font-bold text-fluid-xs text-flame-500 tracking-[0.25em]"
              >03</span>
            <div class="flex gap-2">
              <!-- PLACEHOLDER -->
              <span class="skill-tag">Branding</span>
              <span class="skill-tag">Web Design</span>
            </div>
          </div>

          <!-- Body grid -->
          <div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr]">
            <!-- Image -->
            <div
              class="relative overflow-hidden aspect-video lg:aspect-auto lg:min-h-[420px] xl:min-h-[500px]">
              <!-- PLACEHOLDER -->
              <img
                src="dist/img/ra/featured.webp"
                alt="Project Three — replace with real screenshot"
                class="project-card-img"
                width="900"
                height="500"
              />
              <div
                class="hidden lg:block absolute inset-y-0 right-0 w-40 bg-gradient-to-r from-transparent to-ink-900 pointer-events-none"
                aria-hidden="true"
              ></div>
              <div
                class="absolute bottom-4 left-4 bg-ink-950/80 backdrop-blur-sm border border-ink-700 rounded-full px-3 py-1">
                <!-- PLACEHOLDER -->
                <span
                  class="text-fluid-xs font-heading font-semibold text-flame-400"
                  >2023</span>
              </div>
            </div>

            <!-- Content -->
            <div
              class="flex flex-col justify-center p-8 lg:p-10 xl:p-12 relative">
              <span
                class="absolute top-3 right-5 font-heading font-bold text-[6rem] lg:text-[8rem] leading-none text-ink-800/60 select-none pointer-events-none"
                aria-hidden="true"
                >03</span>
              <div class="relative z-10">
                <!-- PLACEHOLDER -->
                <h3
                  id="proj-01-title"
                  class="font-heading font-bold text-fluid-3xl text-ink-50 leading-tight mb-4">
                  Russell Athletic<br />
                  <span class="text-flame-500 text-fluid-xl">Website Redesign</span>
                </h3>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-ink-400 leading-relaxed mb-6">
                  Another compelling project description. What was the scope
                  of work? What did you design or build, and why does this
                  piece represent the best of what you bring to the table?
                </p>
                <!-- PLACEHOLDER -->
                <div
                  class="flex items-center gap-3 mb-8 p-4 rounded-xl bg-ink-950 border border-ink-800">
                  <i
                    class="fa-solid fa-arrow-trend-up text-flame-500 text-lg shrink-0"
                    aria-hidden="true"
                  ></i>
                  <div>
                    <p
                      class="font-heading font-bold text-fluid-lg text-flame-400">
                      +000%
                    </p>
                    <p class="text-fluid-xs text-ink-500">
                      Key result metric — PLACEHOLDER
                    </p>
                  </div>
                </div>
                <a href="case-study-template.php" class="btn-primary">
                  View Case Study
                  <i
                    class="fa-solid fa-arrow-right text-xs"
                    aria-hidden="true"
                  ></i>
                </a>
              </div>
            </div>
          </div>
        </article>

        <!-- ============================================================
             PROJECT 04  ·  Content LEFT  ·  Image RIGHT  (flipped)
             ============================================================ -->
        <article
          id="project-04"
          class="project-card fade-in-up"
          aria-labelledby="proj-04-title">
          <!-- Top bar -->
          <div
            class="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-ink-800">
            <div class="flex gap-2">
              <!-- PLACEHOLDER -->
              <span class="skill-tag">UI/UX</span>
              <span class="skill-tag">Strategy</span>
            </div>
            <span
              class="font-heading font-bold text-fluid-xs text-flame-500 tracking-[0.25em]"
              >04</span>
          </div>

          <!-- Body grid — content LEFT, image RIGHT -->
          <div class="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
            <!-- Content -->
            <div
              class="flex flex-col justify-center p-8 lg:p-10 xl:p-12 relative order-2 lg:order-1">
              <span
                class="absolute top-3 left-5 font-heading font-bold text-[6rem] lg:text-[8rem] leading-none text-ink-800/60 select-none pointer-events-none"
                aria-hidden="true"
                >04</span>
              <div class="relative z-10">
                <!-- PLACEHOLDER -->
                <h3
                  id="proj-01-title"
                  class="font-heading font-bold text-fluid-3xl text-ink-50 leading-tight mb-4">
                  Spalding<br />
                  <span class="text-flame-500 text-fluid-xl">Website Redesign</span>
                </h3>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-ink-400 leading-relaxed mb-6">
                  Round out your featured work with this final case study.
                  What skills or range does it showcase that the others
                  don't? Give visitors a different perspective on your depth
                  and versatility.
                </p>
                <!-- PLACEHOLDER -->
                <div
                  class="flex items-center gap-3 mb-8 p-4 rounded-xl bg-ink-950 border border-ink-800">
                  <i
                    class="fa-solid fa-arrow-trend-up text-flame-500 text-lg shrink-0"
                    aria-hidden="true"
                  ></i>
                  <div>
                    <p
                      class="font-heading font-bold text-fluid-lg text-flame-400">
                      +000%
                    </p>
                    <p class="text-fluid-xs text-ink-500">
                      Key result metric — PLACEHOLDER
                    </p>
                  </div>
                </div>
                <a href="case-study-template.php" class="btn-primary">
                  View Case Study
                  <i
                    class="fa-solid fa-arrow-right text-xs"
                    aria-hidden="true"
                  ></i>
                </a>
              </div>
            </div>

            <!-- Image -->
            <div
              class="relative overflow-hidden aspect-video lg:aspect-auto lg:min-h-[420px] xl:min-h-[500px] order-1 lg:order-2">
              <!-- PLACEHOLDER -->
              <img
                src="dist/img/spalding/featured.webp"
                alt="Project Four — replace with real screenshot"
                class="project-card-img"
                width="900"
                height="500"
              />
              <div
                class="hidden lg:block absolute inset-y-0 left-0 w-40 bg-gradient-to-l from-transparent to-ink-900 pointer-events-none"
                aria-hidden="true"
              ></div>
              <div
                class="absolute bottom-4 right-4 bg-ink-950/80 backdrop-blur-sm border border-ink-700 rounded-full px-3 py-1">
                <!-- PLACEHOLDER -->
                <span
                  class="text-fluid-xs font-heading font-semibold text-flame-400"
                  >2023</span>
              </div>
            </div>
          </div>
        </article>

        <!-- ============================================================
             PROJECT 05  ·  Image LEFT  ·  Content RIGHT
             ============================================================ -->
        <article
          id="project-05"
          class="project-card fade-in-up"
          aria-labelledby="proj-05-title">
          <!-- Top bar -->
          <div
            class="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-ink-800">
            <span
              class="font-heading font-bold text-fluid-xs text-flame-500 tracking-[0.25em]"
              >05</span>
            <div class="flex gap-2">
              <!-- PLACEHOLDER -->
              <span class="skill-tag">UI/UX</span>
              <span class="skill-tag">Web Design</span>
              <span class="skill-tag">Tailwind</span>
              <span class="skill-tag">PWA</span>
              <span class="skill-tag">Javascript</span>
            </div>
          </div>

          <!-- Body grid -->
          <div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr]">
            <!-- Image -->
            <div
              class="relative overflow-hidden aspect-video lg:aspect-auto lg:min-h-[420px] xl:min-h-[500px]">
              <!-- PLACEHOLDER -->
              <img
                src="dist/img/bj/featured.webp"
                alt="Project Three — replace with real screenshot"
                class="project-card-img"
                width="900"
                height="500"
              />
              <div
                class="hidden lg:block absolute inset-y-0 right-0 w-40 bg-gradient-to-r from-transparent to-ink-900 pointer-events-none"
                aria-hidden="true"
              ></div>
              <div
                class="absolute bottom-4 left-4 bg-ink-950/80 backdrop-blur-sm border border-ink-700 rounded-full px-3 py-1">
                <!-- PLACEHOLDER -->
                <span
                  class="text-fluid-xs font-heading font-semibold text-flame-400"
                  >2025</span>
              </div>
            </div>

            <!-- Content -->
            <div
              class="flex flex-col justify-center p-8 lg:p-10 xl:p-12 relative">
              <span
                class="absolute top-3 right-5 font-heading font-bold text-[6rem] lg:text-[8rem] leading-none text-ink-800/60 select-none pointer-events-none"
                aria-hidden="true"
                >05</span>
              <div class="relative z-10">
                <!-- PLACEHOLDER -->
                <h3
                  id="proj-01-title"
                  class="font-heading font-bold text-fluid-3xl text-ink-50 leading-tight mb-4">
                  Bitesized Blackjack<br />
                  <span class="text-flame-500 text-fluid-xl">Mobile Web App</span>
                </h3>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-ink-400 leading-relaxed mb-6">
                  Another compelling project description. What was the scope
                  of work? What did you design or build, and why does this
                  piece represent the best of what you bring to the table?
                </p>
                <!-- PLACEHOLDER -->
                <div
                  class="flex items-center gap-3 mb-8 p-4 rounded-xl bg-ink-950 border border-ink-800">
                  <i
                    class="fa-solid fa-arrow-trend-up text-flame-500 text-lg shrink-0"
                    aria-hidden="true"
                  ></i>
                  <div>
                    <p
                      class="font-heading font-bold text-fluid-lg text-flame-400">
                      +100%
                    </p>
                    <p class="text-fluid-xs text-ink-500">
                      Increase in Overall Fun <span class="text-ink-700">Made Up Statistic</span>
                    </p>
                  </div>
                </div>
                <a href="case-study-template.php" class="btn-primary">
                  View Case Study
                  <i
                    class="fa-solid fa-arrow-right text-xs"
                    aria-hidden="true"
                  ></i>
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <div class="section-divider" role="separator" aria-hidden="true"></div>

  <!-- ================================================================
       BRANDS WORKED WITH — Infinite Logo Carousel
       ================================================================ -->
  <section id="brands" class="section" aria-labelledby="brands-heading">
    <!-- Section header -->
    <div class="max-w-7xl mx-auto px-6 lg:px-12 mb-14">
      <div class="text-center fade-in-up">
        <p class="section-label justify-center">
          Clients &amp; Collaborators
        </p>
        <h2 id="brands-heading" class="section-title mt-3">
          Brands I've Had the<br />
          <span class="text-flame-500">Privilege to Work With</span>
        </h2>
        <!-- PLACEHOLDER: Personalize or remove -->
        <p class="section-subtitle max-w-2xl mx-auto">
          From ambitious startups to established names — a few of the brands
          I've been lucky enough to partner with over the years.
        </p>
      </div>
    </div>

    <!-- ── Row 1: scrolling LEFT ── -->
    <!-- PLACEHOLDER: Replace each img src with your real logo files (SVG or PNG preferred) -->
    <div class="logo-carousel-mask mb-5">
      <div
        class="logo-track"
        role="list"
        aria-label="Partner logos, row one">
        <!-- ── Set 1 of 2 ── -->
        <div class="logo-item" role="listitem">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/1d4ed8/ffffff?text=NEXUS+CO"
              alt="Nexus Co"
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Nexus Co</span>
        </div>
        <div class="logo-item" role="listitem">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/15803d/ffffff?text=MERIDIAN"
              alt="Meridian"
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Meridian</span>
        </div>
        <div class="logo-item" role="listitem">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/7e22ce/ffffff?text=ATLAS+GROUP"
              alt="Atlas Group"
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Atlas Group</span>
        </div>
        <div class="logo-item" role="listitem">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/c2410c/ffffff?text=SOLARIS"
              alt="Solaris"
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Solaris</span>
        </div>
        <div class="logo-item" role="listitem">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/0e7490/ffffff?text=VEGA+STUDIO"
              alt="Vega Studio"
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Vega Studio</span>
        </div>
        <div class="logo-item" role="listitem">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/be123c/ffffff?text=PINNACLE"
              alt="Pinnacle"
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Pinnacle</span>
        </div>
        <div class="logo-item" role="listitem">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/92400e/ffffff?text=EMBER+LABS"
              alt="Ember Labs"
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Ember Labs</span>
        </div>
        <div class="logo-item" role="listitem">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/3730a3/ffffff?text=STRATUM+CO"
              alt="Stratum Co"
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Stratum Co</span>
        </div>

        <!-- ── Set 2 of 2 — exact duplicate for seamless loop ── -->
        <div class="logo-item" role="listitem" aria-hidden="true">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/1d4ed8/ffffff?text=NEXUS+CO"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Nexus Co</span>
        </div>
        <div class="logo-item" role="listitem" aria-hidden="true">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/15803d/ffffff?text=MERIDIAN"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Meridian</span>
        </div>
        <div class="logo-item" role="listitem" aria-hidden="true">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/7e22ce/ffffff?text=ATLAS+GROUP"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Atlas Group</span>
        </div>
        <div class="logo-item" role="listitem" aria-hidden="true">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/c2410c/ffffff?text=SOLARIS"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Solaris</span>
        </div>
        <div class="logo-item" role="listitem" aria-hidden="true">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/0e7490/ffffff?text=VEGA+STUDIO"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Vega Studio</span>
        </div>
        <div class="logo-item" role="listitem" aria-hidden="true">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/be123c/ffffff?text=PINNACLE"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Pinnacle</span>
        </div>
        <div class="logo-item" role="listitem" aria-hidden="true">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/92400e/ffffff?text=EMBER+LABS"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Ember Labs</span>
        </div>
        <div class="logo-item" role="listitem" aria-hidden="true">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/3730a3/ffffff?text=STRATUM+CO"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Stratum Co</span>
        </div>
      </div>
    </div>

    <!-- ── Row 2: scrolling RIGHT (reverse direction) ── -->
    <div class="logo-carousel-mask" aria-hidden="true">
      <div class="logo-track-reverse">
        <!-- ── Set 1 of 2 — staggered order for visual variety ── -->
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/3730a3/ffffff?text=STRATUM+CO"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Stratum Co</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/92400e/ffffff?text=EMBER+LABS"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Ember Labs</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/be123c/ffffff?text=PINNACLE"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Pinnacle</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/0e7490/ffffff?text=VEGA+STUDIO"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Vega Studio</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/c2410c/ffffff?text=SOLARIS"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Solaris</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/7e22ce/ffffff?text=ATLAS+GROUP"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Atlas Group</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/15803d/ffffff?text=MERIDIAN"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Meridian</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/1d4ed8/ffffff?text=NEXUS+CO"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Nexus Co</span>
        </div>

        <!-- ── Set 2 of 2 — duplicate for seamless loop ── -->
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/3730a3/ffffff?text=STRATUM+CO"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Stratum Co</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/92400e/ffffff?text=EMBER+LABS"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Ember Labs</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/be123c/ffffff?text=PINNACLE"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Pinnacle</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/0e7490/ffffff?text=VEGA+STUDIO"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Vega Studio</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/c2410c/ffffff?text=SOLARIS"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Solaris</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/7e22ce/ffffff?text=ATLAS+GROUP"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Atlas Group</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/15803d/ffffff?text=MERIDIAN"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Meridian</span>
        </div>
        <div class="logo-item">
          <div class="logo-item-inner">
            <img
              src="https://placehold.co/160x48/1d4ed8/ffffff?text=NEXUS+CO"
              alt=""
              width="160"
              height="48"
            />
          </div>
          <span class="logo-name">Nexus Co</span>
        </div>
      </div>
    </div>
  </section>

  <div class="section-divider" role="separator" aria-hidden="true"></div>

  <!-- ================================================================
       CTA BANNER
       ================================================================ -->
  <section class="section" aria-label="Call to action">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <div
        class="relative p-8 lg:p-16 rounded-3xl border border-ink-800 overflow-hidden text-center fade-in-up"
        style="
          background: linear-gradient(
            135deg,
            #1f1614 0%,
            #2a1810 60%,
            #1f1614 100%
          );
        ">
        <!-- Decorative glow -->
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true">
          <div class="w-96 h-96 flame-glow opacity-20"></div>
        </div>
        <div
          class="absolute top-6 left-6 w-16 h-16 dot-grid opacity-30 pointer-events-none"
          aria-hidden="true"
        ></div>
        <div
          class="absolute bottom-6 right-6 w-16 h-16 dot-grid opacity-30 pointer-events-none"
          aria-hidden="true"
        ></div>

        <div class="relative z-10">
          <p class="section-label justify-center mb-4">
            Start Something New
          </p>
          <h2
            class="font-heading font-bold text-fluid-4xl text-ink-50 leading-tight tracking-tight mb-4">
            Like What You See?
          </h2>
          <!-- PLACEHOLDER -->
          <p class="text-fluid-lg text-ink-500 max-w-xl mx-auto mb-10">
            Let's talk about what we can build together. Every great project
            starts with a conversation.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="contact.php" class="btn-primary">
              Start the Conversation
              <i
                class="fa-solid fa-arrow-right text-xs"
                aria-hidden="true"
              ></i>
            </a>
            <a href="about.php" class="btn-outline">Learn More About Me</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<?php include "partials/footer.php"; ?>
