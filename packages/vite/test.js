import test from 'node:test';
import assert from 'node:assert/strict';
import { ui5InspectorPlugin, ui5Devframe, UI5_DEVFRAME_ID } from './dist/index.js';

test('Vite plugin creates valid plugin instance', () => {
  const plugin = ui5InspectorPlugin();
  assert.equal(plugin.name, 'vite-plugin-ui5-devtools');
  assert.equal(typeof plugin.devtools, 'object');
  assert.equal(typeof plugin.devtools.setup, 'function');
  assert.equal(UI5_DEVFRAME_ID, 'ui5-inspector');
  assert.equal(ui5Devframe.id, 'ui5-inspector');
});

test('Vite plugin devtools setup installs Devframe definition into Vite DevTools context', async () => {
  let customSetupRan = false;
  const plugin = ui5InspectorPlugin({
    setup: () => {
      customSetupRan = true;
    }
  });

  const installedDevframes = [];
  const fakeKitCtx = {
    install: async (devframeDef, options) => {
      installedDevframes.push({ devframeDef, options });
    }
  };

  await plugin.devtools.setup(fakeKitCtx);

  assert.ok(customSetupRan, 'Custom setup callback should execute');
  assert.equal(installedDevframes.length, 1, 'Should install 1 Devframe');
  assert.equal(installedDevframes[0].devframeDef.id, 'ui5-inspector');
  assert.equal(installedDevframes[0].options.base, '/__ui5-inspector/');
  assert.equal(installedDevframes[0].options.dock.title, 'UI5 Inspector');
  assert.equal(installedDevframes[0].options.dock.category, 'framework');
});
