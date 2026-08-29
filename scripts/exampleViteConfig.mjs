import fs from 'node:fs';
import path from 'node:path';

import { readExamplePackage, repoRoot } from './exampleUtils.mjs';

function localPackageEntry(packageName) {
  if (!packageName.startsWith('@nextgis/')) return;

  const entry = path.join(
    repoRoot,
    'packages',
    packageName.replace('@nextgis/', ''),
    'src',
    'index.ts',
  );
  return fs.existsSync(entry) ? entry : undefined;
}

const maplibreWorkerPlugin = {
  name: 'maplibre-worker',
  transformIndexHtml: {
    order: 'pre',
    handler() {
      return [
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: `
import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
setWorkerUrl(workerUrl);
`,
          injectTo: 'head-prepend',
        },
      ];
    },
  },
};

export function createExampleViteConfig(root, adapter) {
  const pkg = readExamplePackage(root) || {};
  const variants = pkg.ngwMaps || [];
  if (adapter && !variants.includes(adapter)) {
    throw new Error(`Unknown map adapter: ${adapter}`);
  }

  const sourcePackage = variants[0];
  const maplibre =
    adapter?.includes('maplibre-gl') ??
    Object.keys(pkg.dependencies || {}).some((name) =>
      name.includes('maplibre-gl'),
    );
  const packageNames = new Set([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ]);
  if (sourcePackage) packageNames.add(`@nextgis/${sourcePackage}`);
  const aliases = [];
  for (const packageName of packageNames) {
    const selectedPackage =
      adapter && packageName === `@nextgis/${sourcePackage}`
        ? `@nextgis/${adapter}`
        : packageName;
    const entry = localPackageEntry(selectedPackage);
    if (entry) {
      aliases.push({
        find: new RegExp(`^${packageName}$`),
        replacement: entry,
      });
    }
  }
  const dedupe = ['react', 'react-dom'].filter((name) =>
    packageNames.has(name),
  );

  return {
    root,
    define: { __BROWSER__: 'true' },
    resolve:
      aliases.length || dedupe.length ? { alias: aliases, dedupe } : undefined,
    optimizeDeps: maplibre ? { exclude: ['maplibre-gl'] } : undefined,
    plugins: maplibre ? [maplibreWorkerPlugin] : [],
  };
}
