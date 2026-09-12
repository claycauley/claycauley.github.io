# php-site

Source code for the PHP-powered portfolio site. PHP is used purely as a
templating layer during development — `partials/header.php` and
`partials/footer.php` give a single source of truth for markup shared across
every page, so a nav link or footer update only has to be made once.

Before deployment, the site is **exported to plain static HTML** (see
[Static Export](#static-export--deployment) below) so visitors never see a
`.php` file or any server-rendered source.

## Requirements

- **Node.js** (v18+) + npm — for Tailwind CLI, Browsersync, and the export script
- **PHP** (v8+) — used locally to render `.php` pages, and must be available
  on your `PATH` as `php` (this is how the `serve` script and
  `scripts/export-static.js` invoke it by default). This project is
  developed using the copy bundled with [Laragon](https://laragon.org/):
  ```
  D:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.exe
  ```
  If your PHP install isn't on `PATH`, set the `PHP_BIN` environment
  variable to the full path instead of editing any scripts, e.g.:
  ```powershell
  $env:PHP_BIN = "D:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.exe"
  npm run dev
  ```

## First-time setup

```powershell
cd php-site
npm install
cp mailer.config.example.php mailer.config.php
```

Then edit `mailer.config.php` and fill in the real SMTP password and
reCAPTCHA v3 secret key. This file is **gitignored** and must never be
committed — it holds live credentials used by `mailer.php` to send the
contact form email. (`mailer.config.example.php` is the committed template
documenting the expected shape.)

## Local development

Run everything at once — Tailwind watcher, PHP dev server, and a
Browsersync live-reload proxy:

```powershell
npm run dev
```

This starts three processes in parallel:

| Process  | Purpose                                                              | URL |
|----------|-----------------------------------------------------------------------|-----|
| `watch`  | Rebuilds `dist/css/main.css` on every Tailwind class/CSS change       | — |
| `serve`  | PHP's built-in dev server, renders `.php` pages                       | `http://localhost:8000` (raw, no live-reload) |
| `sync`   | Browsersync proxy — auto-refreshes the browser on any file change     | **`http://localhost:3000`** ← use this one |

Open **http://localhost:3000** and edit any `.php`, `.html`, `.js`, or
Tailwind class — the page reloads automatically (CSS-only changes are
injected without a full reload).

Stop everything with <kbd>Ctrl</kbd>+<kbd>C</kbd> in the terminal running
`npm run dev`.

### Individual scripts

| Script            | What it does                                                        |
|-------------------|----------------------------------------------------------------------|
| `npm run build`   | One-off minified Tailwind build                                     |
| `npm run watch`   | Tailwind watcher only (no server)                                    |
| `npm run serve`   | PHP dev server only, no live-reload                                  |
| `npm run sync`    | Browsersync proxy only (requires `serve` already running)            |

## Static export & deployment

The site is deployed to **Hostinger**, which supports PHP — but to keep the
`.php` templates/source private and serve visitors clean static pages, the
build ships pre-rendered HTML instead of raw `.php` files.

```powershell
npm run build:static
```

This runs `build` (compile Tailwind) followed by `export`
(`scripts/export-static.js`), which:

1. Spins up a **temporary** PHP server on a private port (8791)
2. Fetches each page (`index.php`, `about.php`, `projects.php`,
   `contact.php`, `fotl-case-study.php`, `case-study-template.php`) and
   saves the fully rendered HTML output into `dist/*.html`
3. Rewrites internal nav/footer links from `.php` → `.html`
   (e.g. `href="about.php"` → `href="about.html"`)
4. Fixes root-relative asset paths that assumed the page lived at the
   project root (`dist/css/...` → `css/...`, `dist/img/...` → `img/...`)
   so they resolve correctly now that the HTML lives *inside* `dist/`
5. Copies `js/main.js`, plus `mailer.php` and the `mailer/` (PHPMailer)
   directory, into `dist/` so the contact form keeps working — Hostinger
   still executes `mailer.php` server-side, only the page templates
   themselves are pre-rendered

The end result, `php-site/dist/`, is a **complete, self-contained folder**
ready to upload:

```
dist/
  index.html, about.html, projects.html, contact.html, ...
  css/main.css
  img/...
  js/main.js
  mailer.php        ← contact form endpoint, still server-executed
  mailer/           ← PHPMailer dependency
```

### Deploying to Hostinger

1. Run `npm run build:static`
2. Upload the **contents** of `php-site/dist/` to your Hostinger
   `public_html` (or the target subfolder) via FTP/File Manager
3. No further config needed — `mailer.php`'s `$allowed_origins` already
   includes `https://claydesigns.cc` and `https://www.claydesigns.cc`

> ⚠️ Never upload the `php-site/` source folder itself (that would expose
> `.php` templates publicly) — only upload what's inside `dist/`.

## Project structure

```
php-site/
  *.php                 ← page templates (dev only, not deployed)
  partials/
    header.php           ← shared <head>/nav, single source of truth
    footer.php           ← shared footer, single source of truth
  mailer.php             ← contact form mail handler (PHPMailer)
  mailer.config.php      ← gitignored: real SMTP/reCAPTCHA secrets (create locally)
  mailer.config.example.php ← committed template for mailer.config.php
  mailer/                ← PHPMailer library files
  js/main.js              ← site JS (nav highlighting, animations, form submit)
  src/css/main.css        ← Tailwind entry point (@tailwind directives)
  scripts/export-static.js← static export script (see above)
  dist/                   ← BUILD OUTPUT — compiled CSS + exported static HTML
  tailwind.config.js
```
