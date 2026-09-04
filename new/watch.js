const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC_DIR = __dirname;

console.log('👀  Watching for changes...\n');

// Run initial build
execSync('node build.js', { stdio: 'inherit' });

function onChange(filename) {
    console.log(`🔄  Change detected: ${filename}`);
    try {
        execSync('node build.js', { stdio: 'inherit' });
    } catch (e) {
        console.error('Build error:', e.message);
    }
}

// Watch root HTML files
fs.watch(SRC_DIR, { recursive: false }, (_, filename) => {
    if (filename?.endsWith('.html')) onChange(filename);
});

// Watch entire assets folder (html, css, js, imgs, fonts, etc.)
fs.watch(path.join(SRC_DIR, 'assets'), { recursive: true }, (_, filename) => {
    if (filename) onChange(filename);
});
