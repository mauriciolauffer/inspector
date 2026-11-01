import { defineDevframe, defineRpcFunction, type DevframeDefinition } from 'devframe';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));

export const UI5_DEVFRAME_ID = 'ui5-inspector';

export const getClientAssetsPath = (): string => {
  return fileURLToPath(new URL('./client', import.meta.url));
};

export const ui5Devframe: DevframeDefinition = defineDevframe({
  id: UI5_DEVFRAME_ID,
  name: 'UI5 Inspector',
  version: pkg.version,
  packageName: pkg.name,
  description: pkg.description || 'UI5 Inspector devtools for debugging OpenUI5 and SAPUI5 applications',
  homepage: 'https://github.com/UI5/inspector',
  icon: 'vscode-icons:file-type-ui5',
  importMetaUrl: import.meta.url,
  clientAssets: getClientAssetsPath(),

  setup(ctx: any) {
    const scope = ctx.scope ? ctx.scope(UI5_DEVFRAME_ID) : ctx;

    if (scope.rpc) {
      scope.rpc.register(
        defineRpcFunction({
          name: 'get-version',
          type: 'query',
          jsonSerializable: true,
          handler: () => ({
            name: 'ui5-inspector',
            version: pkg.version,
            frameworks: ['OpenUI5', 'SAPUI5', 'UI5 Web Components']
          })
        })
      );

      scope.rpc.register(
        defineRpcFunction({
          name: 'ping',
          type: 'query',
          jsonSerializable: true,
          handler: () => ({ pong: true, timestamp: Date.now() })
        })
      );
    }
  }
});

export default ui5Devframe;
