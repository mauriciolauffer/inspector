import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getClientAssetsPath } from '@ui5-inspector/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const distDir = path.join(__dirname, 'dist');
fs.mkdirSync(distDir, { recursive: true });

// Copy shared client UI assets from @ui5-inspector/core
const coreClientPath = getClientAssetsPath();
if (fs.existsSync(coreClientPath)) {
  fs.cpSync(coreClientPath, distDir, { recursive: true });
  console.log('Reused UI assets from @ui5-inspector/core');
} else {
  const rootDist = path.join(rootDir, 'dist');
  if (fs.existsSync(rootDist)) {
    fs.cpSync(rootDist, distDir, { recursive: true });
    console.log('Reused UI assets from root dist');
  }
}

// Ensure Chrome extension manifest is present
const manifestPath = path.join(rootDir, 'app/manifest.json');
if (fs.existsSync(manifestPath)) {
  fs.copyFileSync(manifestPath, path.join(distDir, 'manifest.json'));
}

console.log('packages/chrome-extension built successfully!');
