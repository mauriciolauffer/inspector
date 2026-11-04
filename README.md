![OpenUI5](docs/images/UI5_logo_wide.png)

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Build Status](https://travis-ci.org/SAP/ui5-inspector.svg?branch=master)](https://travis-ci.org/SAP/ui5-inspector)
[![Coverage Status](https://coveralls.io/repos/SAP/ui5-inspector/badge.svg?branch=master&service=github)](https://coveralls.io/github/SAP/ui5-inspector?branch=master)
[![REUSE status](https://api.reuse.software/badge/github.com/UI5/inspector)](https://api.reuse.software/info/github.com/UI5/inspector)

# About UI5 Inspector

UI5 Inspector is a comprehensive developer tool for debugging and understanding OpenUI5, SAPUI5, and UI5 Web Components applications. It provides deep visibility into the UI5 runtime, including the control tree hierarchy, element properties, data bindings, aggregations, events, OData traffic inspection, elements registry, and AI-assisted troubleshooting.

UI5 Inspector is open source licensed under the Apache License, Version 2.0.
See [LICENSE.txt](https://github.com/UI5/inspector/blob/master/LICENSE.txt) for more information.

---

## Monorepo Architecture

The project is structured as a modular monorepo powered by [pnpm workspaces](https://pnpm.io/workspaces) and [Devframe](https://devfra.me/guide). This allows the UI5 Inspector UI and capabilities to be defined once and exposed seamlessly across multiple deployment targets:

```
ui5-inspector/
├── packages/
│   ├── core/               # Shared foundation based on Devframe
│   ├── vite/               # Vite DevTools plugin (@vitejs/devtools-kit)
│   └── chrome-extension/   # Chrome / Edge Browser Extension (Manifest V3)
├── app/                    # UI5 Inspector panel UI, scripts, and styles
├── Gruntfile.js            # Legacy UI bundle pipeline
└── pnpm-workspace.yaml     # Monorepo workspace configuration
```

### Packages

1. **`@ui5-inspector/core` (Shared Foundation)**:
   - Built on top of [Devframe](https://devfra.me/guide).
   - Exports the portable Devframe definition `ui5Devframe` created with `defineDevframe()`.
   - Packages and hosts the shared UI client assets (`html/`, `scripts/`, `styles/`, and `vendor/`).
   - Exposes type-safe RPC endpoints (such as `get-version` and `ping`) and bidirectional communication channels between the host environment and the inspector panel.

2. **`@ui5-inspector/vite` (Vite DevTools Plugin)**:
   - Integrates UI5 Inspector directly into Vite DevTools using [`@vitejs/devtools-kit`](https://devtools.vite.dev/kit/).
   - Uses `createPluginFromDevframe` to register dock entries, iframe panels mounted under `/__ui5-inspector/`, and custom hooks.
   - Simply add `ui5InspectorPlugin()` to `plugins` in your `vite.config.ts`.

3. **`@ui5-inspector/chrome-extension` (Browser Extension)**:
   - Packages the Chrome/Edge browser extension (Manifest V3).
   - Reuses the shared UI client assets from `@ui5-inspector/core`.
   - Houses the extension devtools page, service worker, and content/injected scripts for live page inspection.

---

## Direct Download and Use (Browser Extension)

The latest released version can be downloaded and installed as follows:

1. Download zip file from [Releases](https://github.com/UI5/inspector/releases)
2. Unpack to a directory
3. In Chrome open as url: `chrome://extensions/`. Alternatively, access `edge://extensions/` in Edge.
4. Check “Developer mode” setting and choose "Load unpacked extension..."
5. From the newly opened window select the folder to which the zip file was unpacked
6. Open an OpenUI5/SAPUI5 based web application like: [https://openui5.hana.ondemand.com/explored.html](https://openui5.hana.ondemand.com/explored.html)
7. Open Developer Tools (F12 or Ctrl+Shift+I)
8. Select the tab labeled **'UI5'** in Developer Tools

---

## Using with Vite DevTools

Install the plugin in your Vite project:

```bash
npm install -D @ui5-inspector/vite
```

Add the plugin to your `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import { ui5InspectorPlugin } from '@ui5-inspector/vite';

export default defineConfig({
  plugins: [
    ui5InspectorPlugin(),
  ],
});
```

---

## Local Development

1. Clone the project locally:
   ```bash
   git clone git@github.com:SAP/ui5-inspector.git
   cd ui5-inspector
   ```
2. Install workspace dependencies:
   ```bash
   pnpm install
   ```
3. Build all packages:
   ```bash
   pnpm run build
   ```
4. Run tests across all workspace packages:
   ```bash
   pnpm run test
   ```
5. Linting and formatting with [oxlint](https://oxc.rs/docs/guide/usage/linter) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter):
   ```bash
   pnpm run lint:oxc
   pnpm run format:check
   ```

---

## License

[![Apache 2](https://img.shields.io/badge/license-Apache%202-blue.svg)](./LICENSE.txt)
