<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="<?= htmlspecialchars(
          $pageDescription ?? "Clay — Web Designer & Front-End Developer",
      ) ?>"
    />
    <title><?= htmlspecialchars(
        $pageTitle ?? "Clay | Web Designer & Front-End Developer",
    ) ?></title>

    <!-- Google Fonts: Space Grotesk + Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />

    <!-- Font Awesome 6 Free -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />

    <!-- Compiled Tailwind CSS -->
    <link rel="stylesheet" href="dist/css/main.css" />

    <?= $extraHead ?? "" ?>
  </head>

  <?php $p = $currentPage ?? ""; ?>
  <body class="bg-ink-950 text-ink-100 font-body overflow-x-hidden">
    <!-- Skip to main content (accessibility) -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-flame-500 focus:text-ink-950 focus:font-heading focus:font-semibold focus:rounded-lg focus:shadow-lg">
      Skip to main content
    </a>

    <!-- ====================================================================
       GLOBAL HEADER
       ==================================================================== -->
    <header class="site-header" id="site-header" role="banner">
      <!-- Logo -->
      <a
        href="index.php"
        class="flex items-center shrink-0 group"
        aria-label="Clay — Return to homepage">
        <span
          class="font-heading font-bold text-fluid-xl text-ink-50 tracking-tight leading-none transition-colors duration-300 group-hover:text-ink-100"
          >Clay</span>
        <span
          class="font-heading font-bold text-fluid-xl text-flame-500 leading-none"
          >.</span>
      </a>

      <!-- Desktop Navigation -->
      <nav
        class="hidden lg:flex items-center gap-8"
        aria-label="Primary navigation">
        <a href="index.php"    class="nav-link <?= $p === "home"
            ? "active"
            : "" ?>"<?= $p === "home" ? ' aria-current="page"' : "" ?>>Home</a>
        <a href="about.php"    class="nav-link <?= $p === "about"
            ? "active"
            : "" ?>"<?= $p === "about"
    ? ' aria-current="page"'
    : "" ?>>About</a>
        <a href="projects.php" class="nav-link <?= $p === "projects"
            ? "active"
            : "" ?>"<?= $p === "projects"
    ? ' aria-current="page"'
    : "" ?>>Projects</a>
        <a href="contact.php"  class="nav-link <?= $p === "contact"
            ? "active"
            : "" ?>"<?= $p === "contact"
    ? ' aria-current="page"'
    : "" ?>>Contact</a>
      </nav>

      <!-- CTA + Hamburger -->
      <div class="flex items-center gap-3">
        <a
          href="contact.php"
          class="btn-primary hidden md:inline-flex"
          aria-label="Contact Clay">
          Let's Talk
          <i class="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
        </a>

        <button
          id="hamburger-btn"
          class="hamburger-btn lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded="false"
          aria-controls="mobile-drawer">
          <span class="hamburger-line" aria-hidden="true"></span>
          <span class="hamburger-line" aria-hidden="true"></span>
          <span class="hamburger-line" aria-hidden="true"></span>
        </button>
      </div>
    </header>

    <!-- ====================================================================
       MOBILE MENU
       ==================================================================== -->

    <div id="mobile-overlay" class="mobile-overlay" aria-hidden="true"></div>

    <aside
      id="mobile-drawer"
      class="mobile-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation">
      <!-- Drawer header -->
      <div class="flex items-center justify-between mb-8">
        <span
          class="font-heading font-bold text-fluid-xl text-ink-50 leading-none">
          Clay<span class="text-flame-500">.</span>
        </span>
        <button
          id="mobile-close"
          class="flex items-center justify-center w-9 h-9 rounded-lg bg-ink-800 hover:bg-ink-700 text-ink-300 transition-colors duration-200"
          aria-label="Close navigation menu">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>

      <!-- Drawer links -->
      <nav class="flex-1" aria-label="Mobile navigation">
        <ul class="flex flex-col gap-1" role="list">
          <li>
            <a
              href="index.php"
              class="mobile-nav-link <?= $p === "home" ? "active" : "" ?>"
              <?= $p === "home" ? 'aria-current="page"' : "" ?>>
              <i
                class="fa-solid fa-house w-5 text-center shrink-0 text-fluid-sm"
                aria-hidden="true"
              ></i>
              Home
            </a>
          </li>
          <li>
            <a
              href="about.php"
              class="mobile-nav-link <?= $p === "about" ? "active" : "" ?>"
              <?= $p === "about" ? 'aria-current="page"' : "" ?>>
              <i
                class="fa-solid fa-user w-5 text-center shrink-0 text-fluid-sm"
                aria-hidden="true"
              ></i>
              About
            </a>
          </li>
          <li>
            <a
              href="projects.php"
              class="mobile-nav-link <?= $p === "projects" ? "active" : "" ?>"
              <?= $p === "projects" ? 'aria-current="page"' : "" ?>>
              <i
                class="fa-solid fa-layer-group w-5 text-center shrink-0 text-fluid-sm"
                aria-hidden="true"
              ></i>
              Projects
            </a>
          </li>
          <li>
            <a
              href="contact.php"
              class="mobile-nav-link <?= $p === "contact" ? "active" : "" ?>"
              <?= $p === "contact" ? 'aria-current="page"' : "" ?>>
              <i
                class="fa-solid fa-envelope w-5 text-center shrink-0 text-fluid-sm"
                aria-hidden="true"
              ></i>
              Contact
            </a>
          </li>
        </ul>
      </nav>

      <!-- Drawer footer -->
      <div class="mt-auto pt-6 border-t border-ink-800">
        <a href="contact.php" class="btn-primary w-full mb-6 mobile-nav-link">
          Let's Work Together
          <i class="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
        </a>
        <div class="flex items-center justify-center gap-3">
          <a href="#" class="social-btn" aria-label="LinkedIn"
            ><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i
          ></a>
          <a href="#" class="social-btn" aria-label="GitHub"
            ><i class="fa-brands fa-github" aria-hidden="true"></i
          ></a>
          <a href="#" class="social-btn" aria-label="Dribbble"
            ><i class="fa-brands fa-dribbble" aria-hidden="true"></i
          ></a>
          <a href="#" class="social-btn" aria-label="X / Twitter"
            ><i class="fa-brands fa-x-twitter" aria-hidden="true"></i
          ></a>
        </div>
      </div>
    </aside>
