const fs = require('fs');
const path = require('path');

const SRC_DIR = __dirname;
const PROD_DIR = path.join(__dirname, 'prod');

// HTML files at the root to process
const HTML_FILES = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html'));

function processIncludes(content) {
    return content.replace(/<!--\s*@include\s+([\w./-]+)\s*-->/g, (match, includePath) => {
        const fullPath = path.join(SRC_DIR, includePath);
        if (!fs.existsSync(fullPath)) {
            console.warn(`  ⚠️  Partial not found: ${includePath}`);
            return `<!-- partial not found: ${includePath} -->`;
        }
        return fs.readFileSync(fullPath, 'utf8').trimEnd();
    });
}

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function build() {
    fs.mkdirSync(PROD_DIR, { recursive: true });

    // Process HTML files
    let built = 0;
    for (const file of HTML_FILES) {
        const raw = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
        fs.writeFileSync(path.join(PROD_DIR, file), processIncludes(raw), 'utf8');
        console.log(`  ✅  ${file} → prod/${file}`);
        built++;
    }

    // Copy assets (excluding partials and scss)
    const ASSETS_SRC = path.join(SRC_DIR, 'assets');
    const ASSETS_DEST = path.join(PROD_DIR, 'assets');
    const SKIP = ['partials', 'scss'];
    fs.mkdirSync(ASSETS_DEST, { recursive: true });
    for (const entry of fs.readdirSync(ASSETS_SRC, { withFileTypes: true })) {
        if (SKIP.includes(entry.name)) continue;
        const src = path.join(ASSETS_SRC, entry.name);
        const dest = path.join(ASSETS_DEST, entry.name);
        entry.isDirectory() ? copyDir(src, dest) : fs.copyFileSync(src, dest);
    }
    console.log(`  ✅  assets/ → prod/assets/`);

    console.log(`\n🏗️  Build complete — ${built} HTML file(s) processed.\n`);
}

build();
