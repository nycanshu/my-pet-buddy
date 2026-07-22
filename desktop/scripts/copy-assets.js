// Copies the single-source-of-truth art from the repo root into desktop/assets
// so the extension and desktop app never visually drift.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');       // repo root
const outDir = path.join(__dirname, '..', 'assets');

function copyDir(srcName) {
  const src = path.join(root, srcName);
  const dst = path.join(outDir, srcName);
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    fs.copyFileSync(path.join(src, f), path.join(dst, f));
  }
  console.log(`copied ${srcName} -> assets/${srcName}`);
}

function copyFile(name) {
  fs.copyFileSync(path.join(root, name), path.join(outDir, name));
  console.log(`copied ${name} -> assets/${name}`);
}

fs.mkdirSync(outDir, { recursive: true });
copyDir('pets');
copyDir('icons');
copyFile('logo.png');
