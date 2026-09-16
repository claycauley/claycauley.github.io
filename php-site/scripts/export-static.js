/**
 * export-static.js
 * ---------------------------------------------------------------------------
 * Renders each PHP page (via PHP's built-in dev server) and writes the fully
 * rendered HTML output into /dist as plain .html files. This lets you keep
 * PHP includes (header.php / footer.php) as your single source of truth
 * during development, while shipping a static HTML build that never exposes
 * .php files or source code to visitors.
 *
 * Usage: node scripts/export-static.js
 * (Run via `npm run export` — see package.json)
 * ---------------------------------------------------------------------------
 */

const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
// Uses "php" from PATH by default. If your PHP install isn't on PATH
// (e.g. a standalone Laragon install on Windows), set the PHP_BIN
// environment variable to the full path of php.exe instead of editing
// this file, e.g.:
//   PHP_BIN="D:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.exe" npm run export
const PHP_BIN = process.env.PHP_BIN || "php";
const HOST = "localhost";
const PORT = 8791; // dedicated port so it won't collide with `npm run serve`

// Map of source PHP entry point -> output HTML filename in /dist
const PAGES = {
  "index.php": "index.html",
  "about.php": "about.html",
  "projects.php": "projects.html",
  "contact.php": "contact.html",
  "fotl-case-study.php": "fotl-case-study.html",
  "case-study-template.php": "case-study-template.html",
};

// Internal page links are rewritten from .php -> clean, extensionless URLs
// in the rendered markup (e.g. href="about.php" -> href="/about", and
// href="index.php" -> href="/"). The .htaccess shipped in dist/ maps these
// clean URLs back to the matching .html file on the server, and redirects
// any direct .html/.php requests to the clean URL so the address bar never
// shows a file extension.
const INTERNAL_PAGES = Object.keys(PAGES).map((f) => f.replace(/\.php$/, ""));
const phpLinkPattern = new RegExp(
  `(href=["'])(${INTERNAL_PAGES.join("|")})\\.php(["'#?])`,
  "g",
);

function toCleanUrl(page) {
  return page === "index" ? "/" : `/${page}`;
}

// Asset paths in the PHP source are written relative to the project root
// (e.g. href="dist/css/main.css", src="dist/img/foo.webp") because the
// pages are normally served from php-site/. Once exported *into* dist/,
// those same paths would resolve to dist/dist/... so strip the prefix.
const distAssetPattern = /((?:href|src)=["'])dist\/(css|img)\//g;

// Strips developer-facing HTML comments (e.g. <!-- PLACEHOLDER: ... -->,
// section dividers, etc.) from the final rendered output so they don't
// show up in "View Source" on the live site. Conditional comments
// (<!--[if ...]>) are intentionally left alone since they're meaningful
// markup, not dev notes — though none are currently used on this site.
function stripHtmlComments(html) {
  return html
    .replace(/<!--(?!\[if[\s\S]*?<!\[endif\])[\s\S]*?-->/g, "")
    .replace(/[ \t]+\n/g, "\n") // trailing whitespace left behind on a line
    .replace(/\n{3,}/g, "\n\n"); // collapse 3+ blank lines down to 1
}

// Strips JS comments (both // line comments and /* block comments */,
// including the /* ===... section headers === */ style used in main.js)
// from the shipped dist/js/*.js so source stays documented but the
// deployed bundle doesn't. This is a small hand-rolled scanner (rather
// than a blind regex) so it doesn't corrupt comment-like sequences that
// appear inside strings, template literals, or regex literals.
function stripJsComments(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  let lastSignificant = ""; // last non-whitespace char emitted, used to guess regex vs division

  while (i < n) {
    const ch = src[i];
    const next = src[i + 1];

    // Line comment
    if (ch === "/" && next === "/") {
      i += 2;
      while (i < n && src[i] !== "\n") i++;
      continue;
    }

    // Block comment
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2; // skip closing */
      continue;
    }

    // String literals — copy verbatim, respecting escapes
    if (ch === '"' || ch === "'") {
      const quote = ch;
      out += ch;
      i++;
      while (i < n && src[i] !== quote) {
        if (src[i] === "\\" && i + 1 < n) {
          out += src[i] + src[i + 1];
          i += 2;
        } else {
          out += src[i];
          i++;
        }
      }
      if (i < n) {
        out += src[i]; // closing quote
        i++;
      }
      lastSignificant = quote;
      continue;
    }

    // Template literals — copy verbatim (comments inside are left as-is,
    // which is safe/conservative; ${...} interpolation isn't parsed here)
    if (ch === "`") {
      out += ch;
      i++;
      while (i < n && src[i] !== "`") {
        if (src[i] === "\\" && i + 1 < n) {
          out += src[i] + src[i + 1];
          i += 2;
        } else {
          out += src[i];
          i++;
        }
      }
      if (i < n) {
        out += src[i];
        i++;
      }
      lastSignificant = "`";
      continue;
    }

    // Regex literal — only treat "/" as a regex start if the previous
    // significant token suggests an expression context (not a value that
    // could be divided), a conservative heuristic good enough for this file.
    if (ch === "/" && !/[)\]\w$]/.test(lastSignificant)) {
      let j = i + 1;
      let inClass = false;
      while (j < n) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === "[") inClass = true;
        else if (src[j] === "]") inClass = false;
        else if (src[j] === "/" && !inClass) break;
        else if (src[j] === "\n") break; // unterminated — bail, not a regex
        j++;
      }
      if (src[j] === "/") {
        j++;
        while (j < n && /[a-z]/i.test(src[j])) j++; // flags
        out += src.slice(i, j);
        lastSignificant = "/";
        i = j;
        continue;
      }
      // fall through: not actually a regex, treat "/" as normal char below
    }

    out += ch;
    if (!/\s/.test(ch)) lastSignificant = ch;
    i++;
  }

  return out
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim() + "\n";
}


function fetchPage(pagePath) {
  return new Promise((resolve, reject) => {
    http
      .get(`http://${HOST}:${PORT}/${pagePath}`, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`${pagePath} responded with ${res.statusCode}`));
          res.resume();
          return;
        }
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else if (path.extname(src) === ".js") {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const source = fs.readFileSync(src, "utf8");
    fs.writeFileSync(dest, stripJsComments(source), "utf8");
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function waitForServer(retries = 30) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      http
        .get(`http://${HOST}:${PORT}/index.php`, (res) => {
          res.resume();
          resolve();
        })
        .on("error", () => {
          if (--retries <= 0) return reject(new Error("PHP server never started"));
          setTimeout(attempt, 200);
        });
    };
    attempt();
  });
}

async function main() {
  console.log("→ Starting temporary PHP server for export...");
  const server = spawn(PHP_BIN, ["-S", `${HOST}:${PORT}`], {
    cwd: ROOT,
    stdio: "ignore",
  });

  try {
    await waitForServer();
    console.log("→ PHP server is up. Rendering pages...");

    fs.mkdirSync(DIST, { recursive: true });

    for (const [phpFile, htmlFile] of Object.entries(PAGES)) {
      let html;
      try {
        html = await fetchPage(phpFile);
      } catch (err) {
        console.warn(`  ⚠ Skipping ${phpFile}: ${err.message}`);
        continue;
      }
      html = html.replace(
        phpLinkPattern,
        (_match, prefix, page, suffix) => `${prefix}${toCleanUrl(page)}${suffix}`,
      );
      html = html.replace(distAssetPattern, "$1$2/");
      html = stripHtmlComments(html);
      fs.writeFileSync(path.join(DIST, htmlFile), html, "utf8");
      console.log(`  ✓ ${phpFile} → dist/${htmlFile}`);
    }

    // Copy static assets referenced by the pages so /dist is self-contained
    copyRecursive(path.join(ROOT, "js"), path.join(DIST, "js"));
    console.log("  ✓ copied js/ → dist/js/");

    // Copy the .htaccess that maps clean URLs (e.g. /about) to their
    // matching .html file on the server and redirects any direct .html
    // requests to the clean URL, so the address bar never shows a file
    // extension in production (Apache/Hostinger).
    const htaccessSrc = path.join(ROOT, ".htaccess");
    if (fs.existsSync(htaccessSrc)) {
      copyRecursive(htaccessSrc, path.join(DIST, ".htaccess"));
      console.log("  ✓ copied .htaccess → dist/");
    }

    // Copy the contact-form mailer endpoint + its PHPMailer dependency so
    // the deployed dist/ folder is a fully working package on a PHP host
    // (e.g. Hostinger). The frontend fetch("mailer.php") call keeps working
    // unmodified because mailer.php ships alongside the static HTML pages.
    copyRecursive(path.join(ROOT, "mailer.php"), path.join(DIST, "mailer.php"));
    copyRecursive(path.join(ROOT, "mailer"), path.join(DIST, "mailer"));
    console.log("  ✓ copied mailer.php + mailer/ → dist/");

    // Copy the local mailer secrets file (gitignored) so mailer.php can
    // actually run once uploaded. This file is never committed to git —
    // see mailer.config.example.php for the template.
    const mailerConfig = path.join(ROOT, "mailer.config.php");
    if (fs.existsSync(mailerConfig)) {
      copyRecursive(mailerConfig, path.join(DIST, "mailer.config.php"));
      console.log("  ✓ copied mailer.config.php → dist/");
    } else {
      console.warn(
        "  ⚠ mailer.config.php not found — dist/mailer.php will not be able to send mail until you create it (see mailer.config.example.php).",
      );
    }

    console.log("\n✅ Static export complete: php-site/dist");
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
