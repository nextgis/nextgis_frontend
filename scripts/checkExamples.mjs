import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

const require = createRequire(import.meta.url);
const tsc = require.resolve('typescript/bin/tsc');
const configs = [
  'demo/examples/jsconfig.json',
  'packages/ngw-leaflet/examples/jsconfig.json',
  'packages/ngw-ol/examples/jsconfig.json',
  'packages/ngw-maplibre-gl/examples/jsconfig.json',
];
const typeCheckConfig = 'jsconfig.examples.check.json';

function checkImportMaps(config) {
  const examplesPath = path.dirname(config);
  for (const entry of fs.readdirSync(examplesPath, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const examplePath = path.join(examplesPath, entry.name);
    const htmlPath = path.join(examplePath, 'index.html');
    const jsPath = path.join(examplePath, 'index.js');
    if (!fs.existsSync(htmlPath) || !fs.existsSync(jsPath)) continue;

    const html = fs.readFileSync(htmlPath, 'utf8');
    const js = fs.readFileSync(jsPath, 'utf8');
    if (!/<script type="module" src="\.\/index\.js"><\/script>/.test(html)) {
      throw new Error(`External module script not found in ${htmlPath}`);
    }

    const importMapMatch = html.match(
      /<script type="importmap">\s*([\s\S]*?)\s*<\/script>/,
    );
    if (!importMapMatch) {
      throw new Error(`Import map not found in ${htmlPath}`);
    }

    const importMap = JSON.parse(importMapMatch[1]);
    const imports = js.matchAll(
      /(?:\bfrom\s+|^\s*import\s+)["'](@nextgis\/[^"']+)["']/gm,
    );
    for (const [, specifier] of imports) {
      if (!importMap.imports?.[specifier]) {
        throw new Error(`Missing ${specifier} in import map of ${htmlPath}`);
      }
    }
  }
}

for (const config of configs) {
  checkImportMaps(config);
}

console.log(`Checking ${typeCheckConfig}`);
const result = spawnSync(process.execPath, [tsc, '-p', typeCheckConfig], {
  stdio: 'inherit',
});
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
