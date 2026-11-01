import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const distDir = path.join(__dirname, 'dist');
const distClientDir = path.join(distDir, 'client');
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(distClientDir, { recursive: true });

// Ensure root UI assets are built if not already
const rootDist = path.join(rootDir, 'dist');
if (!fs.existsSync(rootDist)) {
  console.log('Building root dist via grunt dist...');
  execSync('npm run generate:typescript && node -e "require(\'grunt\').tasks([\'dist\']);"', {
    cwd: rootDir,
    stdio: 'inherit'
  });
}

// Copy UI static assets from root dist/
if (fs.existsSync(rootDist)) {
  fs.cpSync(rootDist, distClientDir, { recursive: true });
  console.log('Copied UI assets to packages/core/dist/client');
}

// Create standalone index.html if needed
const panelHtml = path.join(distClientDir, 'html/panel/ui5/index.html');
if (fs.existsSync(panelHtml)) {
  let html = fs.readFileSync(panelHtml, 'utf8');
  html = html.replace(/\/?scripts\//g, './scripts/');
  html = html.replace(/\.\.\/\.\.\/\.\.\/vendor\//g, './vendor/');
  fs.writeFileSync(path.join(distClientDir, 'index.html'), html);
  console.log('Created packages/core/dist/client/index.html');
}

// Compile TypeScript source
console.log('Compiling TypeScript...');
execSync('npx tsc -p tsconfig.json', { cwd: __dirname, stdio: 'inherit' });

console.log('packages/core built successfully!');
