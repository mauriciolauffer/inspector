import { createPluginFromDevframe } from '@vitejs/devtools-kit/node';
import { ui5Devframe, UI5_DEVFRAME_ID } from '@ui5-inspector/core';
import type { Plugin } from 'vite';

export interface UI5InspectorPluginOptions {
  base?: string;
  dock?: Record<string, any>;
  setup?: (ctx: any) => void | Promise<void>;
}

/**
 * Vite DevTools plugin for UI5 Inspector.
 * Mounts the UI5 Inspector Devframe definition into Vite DevTools.
 */
export function ui5InspectorPlugin(options: UI5InspectorPluginOptions = {}): Plugin {
  return createPluginFromDevframe(ui5Devframe, {
    name: 'vite-plugin-ui5-devtools',
    base: options.base || '/__ui5-inspector/',
    dock: {
      category: 'framework',
      title: 'UI5 Inspector',
      icon: 'vscode-icons:file-type-ui5',
      ...options.dock,
    },
    setup(ctx) {
      if (options.setup) {
        options.setup(ctx);
      }
    },
  });
}

export default ui5InspectorPlugin;
export { ui5Devframe, UI5_DEVFRAME_ID };
