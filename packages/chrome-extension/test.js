import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

test('Chrome extension dist exists and contains manifest.json', () => {
  assert.ok(fs.existsSync(distDir), 'dist directory must exist');
  const manifestPath = path.join(distDir, 'manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.name, 'UI5 Inspector');
  assert.ok(manifest.devtools_page);
});

test('Chrome extension dist contains devtools and panel files', () => {
  assert.ok(fs.existsSync(path.join(distDir, 'html/devtools/index.html')));
  assert.ok(fs.existsSync(path.join(distDir, 'html/panel/ui5/index.html')));
  assert.ok(fs.existsSync(path.join(distDir, 'scripts/background/main.js')));
  assert.ok(fs.existsSync(path.join(distDir, 'scripts/devtools/panel/ui5/main.js')));
  assert.ok(fs.existsSync(path.join(distDir, 'vendor/ace.js')));
});
