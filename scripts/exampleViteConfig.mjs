import path from 'node:path';

import { readExamplePackage, repoRoot } from './exampleUtils.mjs';

const packageEntry = (name) =>
  path.join(repoRoot, 'packages', name, 'src', 'index.ts');

const localPackagesAlias = {
  find: /^@nextgis\/([^/]+)$/,
  replacement: packageEntry('$1'),
};

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
  const sourceAdapter = variants[0];
  const selectedAdapter = adapter || sourceAdapter;
  const aliases = [localPackagesAlias];
  if (sourceAdapter && selectedAdapter !== sourceAdapter) {
    aliases.unshift({
      find: new RegExp(`^@nextgis/${sourceAdapter}$`),
      replacement: packageEntry(selectedAdapter),
    });
  }
  const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
  const maplibre =
    selectedAdapter?.includes('maplibre-gl') ??
    Object.keys(dependencies).some((name) => name.includes('maplibre-gl'));

  return {
    root,
    define: { __BROWSER__: 'true' },
    resolve: { alias: aliases, dedupe: ['react', 'react-dom'] },
    optimizeDeps: maplibre ? { exclude: ['maplibre-gl'] } : undefined,
    plugins: maplibre ? [maplibreWorkerPlugin] : [],
  };
}
