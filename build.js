/**
 * Simple build script for AWS S3/CloudFront deployment.
 * Copies index.html, src/, and chicles/ into dist/ folder.
 * No bundler required - uses Phaser from CDN.
 */
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, 'dist');
const ROOT = __dirname;

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      // Skip node_modules, dist, .git
      if (entry === 'node_modules' || entry === 'dist' || entry === '.git') continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Clean dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });

// Copy index.html
fs.copyFileSync(path.join(ROOT, 'index.html'), path.join(DIST, 'index.html'));

// Copy src/
copyRecursive(path.join(ROOT, 'src'), path.join(DIST, 'src'));

// Copy chicles/ (assets)
copyRecursive(path.join(ROOT, 'chicles'), path.join(DIST, 'chicles'));

console.log('Build complete! Output in dist/');
console.log('Ready for AWS S3/CloudFront deployment.');
