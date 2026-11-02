import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ui5Devframe, UI5_DEVFRAME_ID, getClientAssetsPath } from './dist/index.js';
import * as clientModule from './dist/client.js';

test('Devframe definition has correct metadata', () => {
  assert.equal(ui5Devframe.id, 'ui5-inspector');
  assert.equal(ui5Devframe.name, 'UI5 Inspector');
  assert.equal(UI5_DEVFRAME_ID, 'ui5-inspector');
  assert.ok(ui5Devframe.description.includes('UI5 Inspector'));
});

test('clientAssets directory exists and contains index.html and scripts', () => {
  const assetsPath = getClientAssetsPath();
  assert.ok(fs.existsSync(assetsPath), 'clientAssets directory must exist');
  assert.ok(fs.existsSync(path.join(assetsPath, 'index.html')), 'index.html must exist');
  assert.ok(fs.existsSync(path.join(assetsPath, 'scripts')), 'scripts directory must exist');
  assert.ok(fs.existsSync(path.join(assetsPath, 'vendor')), 'vendor directory must exist');
});

test('RPC functions are registered in Devframe setup with scoped context', () => {
  const registered = [];
  const fakeCtx = {
    scope: (id) => {
      assert.equal(id, 'ui5-inspector');
      return {
        rpc: {
          register: (fn) => registered.push(fn)
        }
      };
    }
  };

  ui5Devframe.setup(fakeCtx);

  const names = registered.map(fn => fn.name);
  assert.ok(names.includes('get-version'), 'Registers get-version RPC');
  assert.ok(names.includes('ping'), 'Registers ping RPC');

  const getVersion = registered.find(fn => fn.name === 'get-version');
  const versionInfo = getVersion.handler();
  assert.equal(versionInfo.name, 'ui5-inspector');
  assert.ok(versionInfo.frameworks.includes('OpenUI5'));

  const ping = registered.find(fn => fn.name === 'ping');
  const pingResult = ping.handler();
  assert.equal(pingResult.pong, true);
  assert.ok(typeof pingResult.timestamp === 'number');
});

test('Devframe setup handles context without scope or rpc', () => {
  const registered = [];
  const directCtx = {
    rpc: {
      register: (fn) => registered.push(fn)
    }
  };
  ui5Devframe.setup(directCtx);
  assert.equal(registered.length, 2);

  const noRpcCtx = {};
  assert.doesNotThrow(() => {
    ui5Devframe.setup(noRpcCtx);
  });
});

test('client module re-exports connectDevframe', () => {
  assert.ok(clientModule);
  assert.equal(typeof clientModule.connectDevframe, 'function');
});
