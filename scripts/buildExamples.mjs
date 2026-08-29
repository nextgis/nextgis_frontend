import path from 'node:path';

import { build } from 'vite';

import {
  getExamplePaths,
  getExampleRequest,
  readExamplePackage,
  repoRoot,
} from './exampleUtils.mjs';
import { createExampleViteConfig } from './exampleViteConfig.mjs';

const { examplePath: requestedExamplePath, adapter: requestedAdapter } =
  getExampleRequest();
const examples = [];

function addExample(examplePath, pkg) {
  const adapters =
    requestedAdapter !== undefined
      ? [requestedAdapter]
      : pkg.ngwMaps?.length > 1
        ? pkg.ngwMaps
        : [undefined];

  for (const adapter of adapters) {
    examples.push({ examplePath, name: pkg.name, adapter });
  }
}

const examplePaths = requestedExamplePath
  ? [requestedExamplePath]
  : getExamplePaths();
for (const examplePath of examplePaths) {
  const pkg = readExamplePackage(examplePath);
  if (!pkg) {
    throw new Error(`Example package.json not found in ${examplePath}`);
  }
  if (requestedExamplePath || pkg.name?.startsWith('@nextgis-example/')) {
    addExample(examplePath, pkg);
  }
}

for (const { examplePath, name, adapter } of examples) {
  console.log(`Building ${name}${adapter ? ` (${adapter})` : ''}`);
  await build({
    ...createExampleViteConfig(examplePath, adapter),
    base: './',
    logLevel: 'warn',
    build: {
      emptyOutDir: true,
      outDir: path.resolve(
        repoRoot,
        'temp',
        'examples-check',
        name.replace('@nextgis-example/', '') + (adapter ? `-${adapter}` : ''),
      ),
    },
  });
}

console.log(`Built ${examples.length} examples`);
