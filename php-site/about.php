<?php
$pageTitle = "About | Clay";
$pageDescription = "About Clay — Web Designer &amp; Front-End Developer.";
$currentPage = "about";
include "partials/header.php";
?>

<main id="main-content">
  <!-- ================================================================
       HERO — Editorial intro
       ================================================================ -->
  <section
    id="about-hero"
    class="relative min-h-screen flex items-center pt-[4.5rem] lg:pt-20 overflow-hidden"
    aria-label="About Clay">
    <!-- Background treatments -->
    <div
      class="absolute inset-0 grid-lines pointer-events-none"
      aria-hidden="true"
    ></div>
    <div
      class="absolute top-1/4 left-1/3 w-[600px] h-[600px] flame-glow opacity-20 pointer-events-none"
      aria-hidden="true"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-96 h-96 flame-glow opacity-10 pointer-events-none"
      aria-hidden="true"
    ></div>

    <div
      class="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div class="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
        <!-- ── Text Side ── -->
        <div class="flex-1 text-center lg:text-left">
          <p
            class="section-label justify-center lg:justify-start mb-6 fade-in-up">
            A Little About Me
          </p>

          <h1
            class="font-heading font-bold leading-[1.04] tracking-tight mb-8 fade-in-up"
            data-delay="1">
            <span class="block text-fluid-5xl text-ink-50">Designer.</span>
            <span class="block text-fluid-5xl text-ink-50">Developer.</span>
            <span class="block text-fluid-5xl text-flame-500"
              >Problem Solver.</span>
          </h1>

          <!-- PLACEHOLDER: Replace with your own headline tagline -->
          <p
            class="text-fluid-lg text-ink-300 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 fade-in-up"
            data-delay="2">
            I spend my time crafting designs that are fresh and modern while remaining accessible and user-friendly. From sleek design to semantic code — I believe in building websites that are as functional as they are beautiful.
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start fade-in-up"
            data-delay="3">
            <a href="projects.php" class="btn-primary">
              See My Work
              <i
                class="fa-solid fa-arrow-right text-xs"
                aria-hidden="true"
              ></i>
            </a>
            <a href="contact.php" class="btn-outline">Let's Connect</a>
          </div>
        </div>

        <!-- ── Photo Side ── -->
        <div class="relative shrink-0 fade-in-up" data-delay="1">
          <!-- Glow behind photo -->
          <div
            class="absolute inset-0 translate-x-8 translate-y-8 rounded-3xl bg-flame-500 opacity-15 blur-3xl pointer-events-none"
            aria-hidden="true"
          ></div>

          <!-- Photo + frame -->
          <div class="relative w-72 lg:w-[400px]">
            <div
              class="rounded-3xl overflow-hidden border border-ink-700 shadow-2xl aspect-[4/5]">
              <!-- PLACEHOLDER: Replace with your photo -->
              <img
                src="dist/img/about-profile.webp"
                alt="Clay — Web Designer & Front-End Developer"
                class="w-full h-full object-cover object-top"
                width="400"
                height="500"
              />
            </div>

            <!-- Floating name card -->
            <div
              class="absolute -bottom-6 -left-6 bg-ink-900 border border-ink-700 rounded-2xl px-5 py-4 shadow-2xl">
              <p
                class="font-heading font-bold text-fluid-lg text-ink-50 leading-tight">
                Clay Cauley
              </p>
              <!-- PLACEHOLDER: Update title/location -->
              <p class="text-fluid-xs text-ink-500 mt-0.5">
                Full Stack Web Designer &amp; Front-End Dev
              </p>
              <p
                class="text-fluid-xs text-flame-500 mt-1 flex items-center gap-1.5">
                <i
                  class="fa-solid fa-location-dot text-[10px]"
                  aria-hidden="true"
                ></i>
                <!-- PLACEHOLDER: Your city -->
                Kentucky, USA
              </p>
            </div>

            <!-- Decorative dot grid -->
            <div
              class="absolute -top-8 -right-8 w-24 h-24 dot-grid opacity-40 pointer-events-none"
              aria-hidden="true"
            ></div>

            <!-- Corner accent -->
            <div
              class="absolute -top-4 -right-4 w-16 h-16 rounded-2xl border-2 border-flame-500/30 pointer-events-none"
              aria-hidden="true"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll hint -->
    <div
      class="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-40 pointer-events-none"
      aria-hidden="true">
      <span
        class="font-body text-ink-500 text-fluid-xs tracking-[0.2em] uppercase"
        >Scroll</span>
      <i
        class="fa-solid fa-chevron-down text-flame-500 text-xs animate-bounce"
      ></i>
    </div>
  </section>

  <div class="section-divider" role="separator" aria-hidden="true"></div>

  <!-- ================================================================
       MY STORY — Narrative
       ================================================================ -->
  <section id="my-story" class="section" aria-labelledby="story-heading">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <div class="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        <!-- Left: label + heading sticky anchor -->
        <div class="lg:w-80 xl:w-96 shrink-0 fade-in-up">
          <p class="section-label mb-4">My Story</p>
          <h2 id="story-heading" class="section-title">
            The Very Long<br />
            <span class="text-flame-500">Version</span>
          </h2>

          <!-- Quick-facts sidebar card -->
          <div
            class="mt-10 p-6 rounded-2xl bg-ink-900 border border-ink-800">
            <h3
              class="font-heading font-semibold text-fluid-sm text-ink-200 uppercase tracking-[0.15em] mb-5">
              Quick Facts
            </h3>
            <ul class="flex flex-col gap-4" role="list">
              <li class="flex items-start gap-3">
                <span
                  class="w-7 h-7 rounded-lg bg-flame-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <i
                    class="fa-solid fa-briefcase text-flame-500 text-xs"
                    aria-hidden="true"
                  ></i>
                </span>
                <div>
                  <p
                    class="text-fluid-xs text-ink-500 uppercase tracking-widest mb-0.5">
                    Role
                  </p>
                  <!-- PLACEHOLDER -->
                  <p class="text-fluid-sm text-ink-200">
                    Full Stack Web Designer &amp; Front-End Dev
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="w-7 h-7 rounded-lg bg-flame-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <i
                    class="fa-solid fa-calendar text-flame-500 text-xs"
                    aria-hidden="true"
                  ></i>
                </span>
                <div>
                  <p
                    class="text-fluid-xs text-ink-500 uppercase tracking-widest mb-0.5">
                    Experience
                  </p>
                  <!-- PLACEHOLDER -->
                  <p class="text-fluid-sm text-ink-200">
                    15+ Years in UI/UX, Web Design &amp; Front-End
                    Development
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="w-7 h-7 rounded-lg bg-flame-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <i
                    class="fa-solid fa-location-dot text-flame-500 text-xs"
                    aria-hidden="true"
                  ></i>
                </span>
                <div>
                  <p
                    class="text-fluid-xs text-ink-500 uppercase tracking-widest mb-0.5">
                    Based In
                  </p>
                  <!-- PLACEHOLDER -->
                  <p class="text-fluid-sm text-ink-200">Kentucky, USA</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="w-7 h-7 rounded-lg bg-flame-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <i
                    class="fa-solid fa-graduation-cap text-flame-500 text-xs"
                    aria-hidden="true"
                  ></i>
                </span>
                <div>
                  <p
                    class="text-fluid-xs text-ink-500 uppercase tracking-widest mb-0.5">
                    Education
                  </p>
                  <!-- PLACEHOLDER -->
                  <p class="text-fluid-sm text-ink-200">
                    B.A. in Web Design, Western Kentucky University
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Right: story copy -->
        <div class="flex-1 space-y-8 fade-in-up" data-delay="1">
          <!-- PLACEHOLDER: Replace all paragraph copy below with your real story -->
          <p class="text-fluid-base text-ink-400 leading-[1.85]">
            Growing up in a Kentucky farming family, I quickly realized that farming wasn't my path. Around the start of high school, my interest shifted to technology, beginning with free online site builders before moving up to hand-coding in Dreamweaver. Throughout those years, I constantly sketched layouts and built websites for myself and my friends, unknowingly laying the foundation for my career.
          </p>

          <p class="text-fluid-base text-ink-400 leading-[1.85]">
            This passion led me to Western Kentucky University (WKU), where I pursued a degree in Web Design and Advertising, graduating in 2011. During this era, when the iPhone was still fresh and new, mobile design was an afterthought. We built desktop sites and forced them into mobile dimensions, relying on Photoshop slices before I transitioned fully into coding with HTML, CSS, and JavaScript.
          </p>

          <p class="text-fluid-base text-ink-400 leading-[1.85]">
            Shortly after graduation, I joined Fruit of the Loom as a Web Designer and Front-End Developer. Collaborating with back-end engineers, I strengthened my understanding of JavaScript and embraced the emerging HTML5 and CSS3 standards. During my time there, our team recognized the industry shift toward mobile browsing, successfully transitioning our approach to a mobile-first design strategy.
          </p>
          
          <!-- Pull quote -->
          <blockquote
            class="relative pl-6 border-l-2 border-flame-500 my-10">
            <p
              class="font-heading font-semibold text-fluid-2xl text-ink-100 leading-snug italic">
              <!-- PLACEHOLDER: A favorite quote or personal mantra -->
              Accessibility is more than helping people with disabilities. It's about creating a better experience for everyone. When we design with empathy and inclusivity, we unlock the true potential of the web.
            </p>
          </blockquote>

          <p class="text-fluid-base text-ink-400 leading-[1.85]">
            As the digital landscape changed, I had to adapt with it. I learned to navigate the shift from jQuery to modern, responsive libraries like Bootstrap, and eventually to advanced frameworks like Tailwind, Vue and React. My design toolkit also needed to evolve, moving from Adobe's suite to Sketch, and ultimately to Figma, which now serves as my primary design platform.
          </p>

          <p class="text-fluid-base text-ink-400 leading-[1.85]">
            Today, after years of continuous learning and hands-on experience, I brand myself as a <span class="text-flame-500">Full-Stack Web UI/UX Designer</span> and <span class="text-flame-500">Front-End Developer</span>. Merging design and development, while working closely with engineering teams to ensure my concepts are both feasible and intuitive. If you need a versatile, reliable professional who gets the job done right, I am your guy.
          </p>

          <!-- Subtle CTA inline -->
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
            <a href="contact.php" class="btn-primary">
              Work With Me
              <i
                class="fa-solid fa-arrow-right text-xs"
                aria-hidden="true"
              ></i>
            </a>
            <a
              href="projects.php"
              class="footer-link text-fluid-sm flex items-center gap-2 hover:text-flame-500 transition-colors">
              Or browse my work
              <i
                class="fa-solid fa-chevron-right text-xs"
                aria-hidden="true"
              ></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="section-divider" role="separator" aria-hidden="true"></div>

  <!-- ================================================================
       WHAT DRIVES ME — Values / Pillars
       ================================================================ -->
  <section id="values" class="section" aria-labelledby="values-heading">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <div class="text-center mb-14 fade-in-up">
        <p class="section-label justify-center">What Drives Me</p>
        <h2 id="values-heading" class="section-title mt-3">
          The Principles Behind<br />
          <span class="text-flame-500">The Work</span>
        </h2>
        <!-- PLACEHOLDER: Short intro to your values/approach -->
        <p class="section-subtitle max-w-2xl mx-auto">
          Good work doesn't happen by accident. Behind every design are guiding principles that inform my process, from the first sketch to the
          final pixel.
        </p>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        <!-- Value 1 -->
        <div class="service-card fade-in-up">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-flame-500/10">
            <i
              class="fa-solid fa-bullseye text-flame-500 text-xl"
              aria-hidden="true"
            ></i>
          </div>
          <!-- PLACEHOLDER: Replace title + copy -->
          <h3
            class="font-heading font-semibold text-fluid-xl text-ink-50 mb-3">
            Design Intent
          </h3>
          <p class="text-fluid-sm text-ink-500 leading-relaxed">
            Every color. Every typeface. Every pixel has a job to do. I don't add
            things to clutter up space. I add them because they
            serve the user.
          </p>
        </div>

        <!-- Value 2 -->
        <div class="service-card fade-in-up" data-delay="1">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-flame-500/10">
            <i
              class="fa-solid fa-hammer text-flame-500 text-xl"
              aria-hidden="true"
            ></i>
          </div>
          <!-- PLACEHOLDER -->
          <h3
            class="font-heading font-semibold text-fluid-xl text-ink-50 mb-3">
            Lasting Design
          </h3>
          <p class="text-fluid-sm text-ink-500 leading-relaxed">
            I create designs I'm not embarrassed to look at six months later.
            Clean, documented, and structured so the next person isn't confused and
            starting from scratch.
          </p>
        </div>

        <!-- Value 3 -->
        <div class="service-card fade-in-up" data-delay="2">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-flame-500/10">
            <i
              class="fa-solid fa-people-group text-flame-500 text-xl"
              aria-hidden="true"
            ></i>
          </div>
          <!-- PLACEHOLDER -->
          <h3
            class="font-heading font-semibold text-fluid-xl text-ink-50 mb-3">
            People First
          </h3>
          <p class="text-fluid-sm text-ink-500 leading-relaxed">
            Accessibility isn't a checklist, it's respect. I build things
            that work for everyone, regardless of how they're accessing the
            web.
          </p>
        </div>

        <!-- Value 4 -->
        <div class="service-card fade-in-up" data-delay="3">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-flame-500/10">
            <i
              class="fa-solid fa-rotate text-flame-500 text-xl"
              aria-hidden="true"
            ></i>
          </div>
          <!-- PLACEHOLDER -->
          <h3
            class="font-heading font-semibold text-fluid-xl text-ink-50 mb-3">
            Always Iterating
          </h3>
          <p class="text-fluid-sm text-ink-500 leading-relaxed">
            The best work rarely comes from the first idea. I embrace
            feedback, test assumptions early, and treat every project as a
            chance to learn &amp; grow.
          </p>
        </div>
      </div>
    </div>
  </section>

  <div class="section-divider" role="separator" aria-hidden="true"></div>

  <!-- ================================================================
       SKILLS & TOOLS
       ================================================================ -->
  <section id="skills" class="section" aria-labelledby="skills-heading">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <div class="flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">
        <!-- Left: heading -->
        <div class="lg:w-80 xl:w-96 shrink-0 fade-in-up">
          <p class="section-label mb-4">Skills &amp; Tools</p>
          <h2 id="skills-heading" class="section-title">
            The Toolkit I<br />
            <span class="text-flame-500">Reach For</span>
          </h2>
          <!-- PLACEHOLDER -->
          <p class="section-subtitle text-fluid-base mt-4">
            An ever-evolving set of skills I rely on daily. Sharpening each one through every project.
          </p>
        </div>

        <!-- Right: skill groups -->
        <div
          class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 fade-in-up"
          data-delay="1">
          <!-- Group 1 -->
          <div class="p-6 rounded-2xl bg-ink-900 border border-ink-800">
            <div class="flex items-center gap-3 mb-5">
              <span
                class="w-8 h-8 rounded-lg bg-flame-500/10 flex items-center justify-center shrink-0">
                <i
                  class="fa-solid fa-pen-nib text-flame-500 text-sm"
                  aria-hidden="true"
                ></i>
              </span>
              <h3
                class="font-heading font-semibold text-fluid-sm text-ink-100 uppercase tracking-[0.12em]">
                Design
              </h3>
            </div>
            <!-- PLACEHOLDER: Update with your actual tools -->
            <div class="flex flex-wrap gap-2">
              <span class="skill-tag">Figma</span>
              <span class="skill-tag">Photoshop</span>
              <span class="skill-tag">Illustrator</span>
              <span class="skill-tag">Prototyping</span>
              <span class="skill-tag">Wireframing</span>
            </div>
          </div>

          <!-- Group 2 -->
          <div class="p-6 rounded-2xl bg-ink-900 border border-ink-800">
            <div class="flex items-center gap-3 mb-5">
              <span
                class="w-8 h-8 rounded-lg bg-flame-500/10 flex items-center justify-center shrink-0">
                <i
                  class="fa-solid fa-code text-flame-500 text-sm"
                  aria-hidden="true"
                ></i>
              </span>
              <h3
                class="font-heading font-semibold text-fluid-sm text-ink-100 uppercase tracking-[0.12em]">
                Development
              </h3>
            </div>
            <!-- PLACEHOLDER: Update with your actual skills -->
            <div class="flex flex-wrap gap-2">
              <span class="skill-tag">HTML5</span>
              <span class="skill-tag">CSS3 / Sass</span>
              <span class="skill-tag">JavaScript</span>
              <span class="skill-tag">Tailwind CSS</span>
              <span class="skill-tag">React</span>
              <span class="skill-tag">Git / GitHub</span>
            </div>
          </div> 

          <!-- Group 3 -->
          <div class="p-6 rounded-2xl bg-ink-900 border border-ink-800 sm:col-span-2">
            <div class="flex items-center gap-3 mb-5">
              <span
                class="w-8 h-8 rounded-lg bg-flame-500/10 flex items-center justify-center shrink-0">
                <i
                  class="fa-solid fa-lightbulb text-flame-500 text-sm"
                  aria-hidden="true"
                ></i>
              </span>
              <h3
                class="font-heading font-semibold text-fluid-sm text-ink-100 uppercase tracking-[0.12em]">
                Strategy &amp; Process
              </h3>
            </div>
            <!-- PLACEHOLDER: Update with your actual soft skills / processes -->
            <div class="flex flex-wrap gap-2">
              <span class="skill-tag">UX Research</span>
              <span class="skill-tag">A/B Testing</span>
              <span class="skill-tag">Accessibility</span>
              <span class="skill-tag">Semantic HTML/Design</span>
              <span class="skill-tag">Brand Strategy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="section-divider" role="separator" aria-hidden="true"></div>

  <!-- ================================================================
       EXPERIENCE TIMELINE
       ================================================================ -->
  <section
    id="experience"
    class="section"
    aria-labelledby="experience-heading">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <div class="flex flex-col lg:flex-row gap-14 lg:gap-16 items-start">
        <!-- Left: heading -->
        <div class="lg:w-80 xl:w-96 shrink-0 fade-in-up">
          <p class="section-label mb-4">Experience</p>
          <h2 id="experience-heading" class="section-title">
            Where I've<br />
            <span class="text-flame-500">Been</span>
          </h2>
          <!-- PLACEHOLDER -->
          <p class="section-subtitle text-fluid-base mt-4">
            The roles, companies, and experiences that shaped who I am, how I think and how I work.
          </p>
        </div>

        <!-- Right: timeline -->
        <div class="flex-1">
          <!-- Vertical rail wrapper -->
          <div class="relative pl-10 border-l border-ink-800">
            <!-- Item 1 — Most recent -->
            <div class="relative mb-10 fade-in-up">
              <!-- Rail dot -->
              <div
                class="absolute -left-[2.875rem] top-4 w-10 h-10 rounded-full bg-flame-500 border-4 border-ink-950 flex items-center justify-center shadow-flame-sm"
                aria-hidden="true">
                <i class="fa-solid fa-star text-ink-950 text-xs"></i>
              </div>
              <div
                class="p-6 rounded-2xl bg-ink-900 border border-ink-800 hover:border-flame-500/30 transition-colors duration-300">
                <div
                  class="flex flex-wrap items-start justify-between gap-3 mb-1">
                  <!-- PLACEHOLDER: Replace role, company, dates -->
                  <h3
                    class="font-heading font-semibold text-fluid-lg text-ink-50">
                    Lead Senior UI &amp; UX Designer
                  </h3>
                  <span
                    class="shrink-0 text-fluid-xs text-flame-400 font-heading font-semibold bg-flame-500/10 px-3 py-1 rounded-full"
                    >2026 – Present</span>
                </div>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-flame-600 font-medium mb-3">
                  WiserSites
                </p>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-ink-500 leading-relaxed">
                  Describe your responsibilities and accomplishments in this
                  role. What did you build? What problems did you solve?
                  What was the impact on the business?
                </p>
              </div>
            </div>

            <!-- Item 2 -->
            <div class="relative mb-10 fade-in-up" data-delay="1">
              <div
                class="absolute -left-[2.875rem] top-4 w-10 h-10 rounded-full bg-ink-800 border-4 border-ink-950 flex items-center justify-center"
                aria-hidden="true">
                <i class="fa-solid fa-circle text-flame-600 text-xs"></i>
              </div>
              <div
                class="p-6 rounded-2xl bg-ink-900 border border-ink-800 hover:border-flame-500/30 transition-colors duration-300">
                <div
                  class="flex flex-wrap items-start justify-between gap-3 mb-1">
                  <!-- PLACEHOLDER -->
                  <h3
                    class="font-heading font-semibold text-fluid-lg text-ink-50">
                    Sr. Web Designer &amp; Front-End Developer
                  </h3>
                  <span
                    class="shrink-0 text-fluid-xs text-ink-500 font-heading font-semibold bg-ink-800 px-3 py-1 rounded-full"
                    >2021 – 2025</span>
                </div>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-flame-600 font-medium mb-3">
                  Fruit of the Loom
                </p>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-ink-500 leading-relaxed">
                  Describe your responsibilities and key accomplishments.
                  Keep it focused on impact and results rather than just
                  listing day-to-day tasks.
                </p>
              </div>
            </div>

            <!-- Item 3 -->
            <div class="relative mb-10 fade-in-up" data-delay="1">
              <div
                class="absolute -left-[2.875rem] top-4 w-10 h-10 rounded-full bg-ink-800 border-4 border-ink-950 flex items-center justify-center"
                aria-hidden="true">
                <i class="fa-solid fa-circle text-flame-600 text-xs"></i>
              </div>
              <div
                class="p-6 rounded-2xl bg-ink-900 border border-ink-800 hover:border-flame-500/30 transition-colors duration-300">
                <div
                  class="flex flex-wrap items-start justify-between gap-3 mb-1">
                  <!-- PLACEHOLDER -->
                  <h3
                    class="font-heading font-semibold text-fluid-lg text-ink-50">
                    Sr. UI/UX Web Designer &amp; Front-End Developer
                  </h3>
                  <span
                    class="shrink-0 text-fluid-xs text-ink-500 font-heading font-semibold bg-ink-800 px-3 py-1 rounded-full"
                    >2015 – 2021</span>
                </div>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-flame-600 font-medium mb-3">
                  CafePress
                </p>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-ink-500 leading-relaxed">
                  Describe your responsibilities and key accomplishments.
                  Keep it focused on impact and results rather than just
                  listing day-to-day tasks.
                </p>
              </div>
            </div>

            <!-- Item 4 -->
            <div class="relative mb-10 fade-in-up" data-delay="2">
              <div
                class="absolute -left-[2.875rem] top-4 w-10 h-10 rounded-full bg-ink-800 border-4 border-ink-950 flex items-center justify-center"
                aria-hidden="true">
                <i class="fa-solid fa-circle text-flame-700 text-xs"></i>
              </div>
              <div
                class="p-6 rounded-2xl bg-ink-900 border border-ink-800 hover:border-flame-500/30 transition-colors duration-300">
                <div
                  class="flex flex-wrap items-start justify-between gap-3 mb-1">
                  <!-- PLACEHOLDER -->
                  <h3
                    class="font-heading font-semibold text-fluid-lg text-ink-50">
                    Lead Web Designer &amp; Front-End Developer
                  </h3>
                  <span
                    class="shrink-0 text-fluid-xs text-ink-500 font-heading font-semibold bg-ink-800 px-3 py-1 rounded-full"
                    >2011-2015</span>
                </div>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-flame-600 font-medium mb-3">
                  Fruit of the Loom
                </p>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-ink-500 leading-relaxed">
                  Describe your freelance experience — the range of clients,
                  industries, what you learned operating independently, and
                  notable wins.
                </p>
              </div>
            </div>

            <!-- Item 5 — Education / earliest -->
            <div class="relative fade-in-up" data-delay="3">
              <div
                class="absolute -left-[2.875rem] top-4 w-10 h-10 rounded-full bg-ink-800 border-4 border-ink-950 flex items-center justify-center"
                aria-hidden="true">
                <i
                  class="fa-solid fa-graduation-cap text-ink-500 text-xs"
                ></i>
              </div>
              <div
                class="p-6 rounded-2xl bg-ink-900 border border-ink-800 hover:border-flame-500/30 transition-colors duration-300">
                <div
                  class="flex flex-wrap items-start justify-between gap-3 mb-1">
                  <!-- PLACEHOLDER -->
                  <h3
                    class="font-heading font-semibold text-fluid-lg text-ink-50">
                    BA in Advertising &amp; Web Design
                  </h3>
                  <span
                    class="shrink-0 text-fluid-xs text-ink-500 font-heading font-semibold bg-ink-800 px-3 py-1 rounded-full"
                    >2011</span>
                </div>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-flame-600 font-medium mb-3">
                  Western Kentucky University
                </p>
                <!-- PLACEHOLDER -->
                <p class="text-fluid-sm text-ink-500 leading-relaxed">
                  My time at WKU was spent during the crossover from Flash
                  to HTML5, which meant I got to learn both the design and
                  development sides of the web at a time when everything was
                  changing. It was a formative experience that set the stage
                  for my career.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="section-divider" role="separator" aria-hidden="true"></div>

  <!-- ================================================================
       BEYOND THE SCREEN — Personal / Human side
       ================================================================ -->
  <section id="beyond" class="section" aria-labelledby="beyond-heading">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <div class="flex flex-col lg:flex-row gap-14 items-center">
        <!-- Left: heading + copy -->
        <div class="flex-1 fade-in-up">
          <p class="section-label mb-4">Beyond the Screen</p>
          <h2 id="beyond-heading" class="section-title mb-6">
            What I'm Like<br />
            <span class="text-flame-500">Outside Work</span>
          </h2>
          <!-- PLACEHOLDER: Replace with genuine personal interests -->
          <p class="text-fluid-base text-ink-400 leading-relaxed mb-6">
            When I'm not locked in behind a screen creating Figma variables and brand guidelines, I'm out exploring the world around me with my wife and daughter. Or on a tennis court playing singles &amp; doubles. Giving your all to your craft is important but taking time to recharge &amp; relax is just as crucial.
          </p>
          <p class="text-fluid-base text-ink-400 leading-relaxed">
            <!-- PLACEHOLDER: More personal colour — what excites you, what you geek out on -->
            I'm also a huge nerd. Occasionally you'll find me playing video games or sifting through my trading card collection. Whether it's on the PC, PlayStation, or Nintendo all just depends on the mood I'm in. I've been collecting Pokemon cards since I was a kid &amp; that will never change. <span class="text-flame-500">Sorry, not sorry</span>!
          </p>
        </div>

        <!-- Right: interest tiles -->
        <div
          class="flex-1 grid grid-cols-2 gap-4 fade-in-up"
          data-delay="1">
          <!-- PLACEHOLDER: Replace icons and labels with your actual interests -->
          <div class="interest-tile group">
            <i
              class="fa-solid fa-gamepad text-2xl text-flame-500 mb-3"
              aria-hidden="true"
            ></i>
            <span
              class="font-heading font-semibold text-fluid-sm text-ink-100"
              >Gaming</span>
            <span class="text-fluid-xs text-ink-400 mt-1"
              >From JRPGs, open world action/adventure, platforming, to puzzle games.</span>
          </div>

          <div class="interest-tile group">
            <i
              class="fa-solid fa-music text-2xl text-flame-500 mb-3"
              aria-hidden="true"
            ></i>
            <span
              class="font-heading font-semibold text-fluid-sm text-ink-100"
              >Music</span>
            <span class="text-fluid-xs text-ink-400 mt-1"
              >I'll listen to anything. Except new country music. Old country music is fine though</span>
          </div>

          <div class="interest-tile group">
            <i
              class="fa-solid fa-person-hiking text-2xl text-flame-500 mb-3"
              aria-hidden="true"
            ></i>
            <span
              class="font-heading font-semibold text-fluid-sm text-ink-100"
              >Outdoors</span>
            <span class="text-fluid-xs text-ink-400 mt-1"
              >I do like to be outside. Whether it's playing tennis or jogging, I enjoy being active.</span>
          </div>

          <div class="interest-tile group">
            <i
              class="fa-solid fa-house-chimney-user text-2xl text-flame-500 mb-3"
              aria-hidden="true"
            ></i>
            <span
              class="font-heading font-semibold text-fluid-sm text-ink-100"
              >Family</span>
            <span class="text-fluid-xs text-ink-400 mt-1"
              >Being with my wife &amp; daughter means the world to me. They keep me grounded and inspired.</span>
          </div>
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
        <!-- Dot grid corners -->
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
            Let's Build Something
          </p>
          <h2
            class="font-heading font-bold text-fluid-4xl text-ink-50 leading-tight tracking-tight mb-4">
            Got a Project in Mind?
          </h2>
          <!-- PLACEHOLDER -->
          <p class="text-fluid-lg text-ink-500 max-w-xl mx-auto mb-10">
            I'm always open to hearing about new projects or collaborations
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="contact.php" class="btn-primary">
              Start the Conversation
              <i
                class="fa-solid fa-arrow-right text-xs"
                aria-hidden="true"
              ></i>
            </a>
            <a href="projects.php" class="btn-outline">See My Projects</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<?php include "partials/footer.php"; ?>
