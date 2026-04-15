#!/usr/bin/env node
/**
 * Static site build script — content-hash CSS/JS filenames for cache busting.
 * No dependencies. Run with: node build.js
 *
 * Reads source files from project root, writes hashed output to dist/.
 * HTML files get updated references. Everything else is copied as-is.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// Files to hash (source path relative to ROOT → directory in dist)
const HASHABLE = [
  { src: 'css/styles.css', dir: 'css' },
  { src: 'js/main.js',     dir: 'js' },
  { src: 'js/demo-data.js', dir: 'js' },
];

// HTML files that reference the hashable assets
const HTML_FILES = ['index.html', 'faq.html', 'privacy.html', 'terms.html'];

// Static assets to copy as-is (relative to ROOT)
const STATIC = [
  'ChicagoFLF.ttf',
  'dream orphanage rg.otf',
  'apple-touch-icon.png',
  'favicon.ico',
  'favicon.svg',
  'favicon-96x96.png',
  'og-image.png',
  'og-image-dk.png',
  'robots.txt',
  'llms.txt',
  'llms-full.txt',
];

// --- Helpers ---

function hash(content) {
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 10);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

// --- Clean & create dist ---

if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
ensureDir(DIST);

// --- Hash CSS/JS and build replacement map ---

const replacements = []; // { original: 'css/styles.css', hashed: 'css/styles.a3f7b2c1e9.css' }

for (const entry of HASHABLE) {
  const srcPath = path.join(ROOT, entry.src);
  const content = fs.readFileSync(srcPath);
  const h = hash(content);
  const ext = path.extname(entry.src);
  const base = path.basename(entry.src, ext);
  const hashedName = `${base}.${h}${ext}`;
  const destDir = path.join(DIST, entry.dir);

  ensureDir(destDir);
  fs.writeFileSync(path.join(destDir, hashedName), content);

  replacements.push({
    original: entry.src,
    hashed: `${entry.dir}/${hashedName}`,
  });

  console.log(`  ${entry.src} → ${entry.dir}/${hashedName}`);
}

// --- Process HTML files — replace asset references ---

for (const htmlFile of HTML_FILES) {
  const srcPath = path.join(ROOT, htmlFile);
  if (!fs.existsSync(srcPath)) continue;

  let html = fs.readFileSync(srcPath, 'utf-8');

  for (const r of replacements) {
    // Replace exact references like href="css/styles.css" or src="js/main.js"
    html = html.split(r.original).join(r.hashed);
  }

  fs.writeFileSync(path.join(DIST, htmlFile), html);
  console.log(`  ${htmlFile} — references updated`);
}

// --- Copy static assets ---

for (const file of STATIC) {
  const srcPath = path.join(ROOT, file);
  if (!fs.existsSync(srcPath)) continue;
  copyFile(srcPath, path.join(DIST, file));
}

console.log(`\nBuild complete → dist/`);
