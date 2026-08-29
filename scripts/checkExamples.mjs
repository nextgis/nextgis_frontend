import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire, isBuiltin } from 'node:module';
import path from 'node:path';
import process from 'node:process';

import {
  getExamplePaths,
  readExamplePackage,
  repoRoot,
} from './exampleUtils.mjs';

const require = createRequire(import.meta.url);
const tsc = require.resolve('typescript/bin/tsc');
const typeCheckConfig = path.join(repoRoot, 'tsconfig.examples.check.json');

function getDependencyName(specifier) {
  return specifier.startsWith('@')
    ? specifier.split('/').slice(0, 2).join('/')
    : specifier.split('/')[0];
}

function checkExamplePackage(examplePath) {
  const htmlPath = path.join(examplePath, 'index.html');
  const packagePath = path.join(examplePath, 'package.json');
  if (!fs.existsSync(htmlPath)) return;

  const moduleName = ['index.ts', 'index.tsx', 'index.js'].find((name) =>
    fs.existsSync(path.join(examplePath, name)),
  );
  if (!moduleName) {
    throw new Error(`Module entry not found in ${examplePath}`);
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const source = fs.readFileSync(path.join(examplePath, moduleName), 'utf8');
  const moduleTag = `<script type="module" src="./${moduleName}"></script>`;
  if (!html.includes(moduleTag)) {
    throw new Error(`External module script not found in ${htmlPath}`);
  }
  if (/<script type="importmap">/.test(html)) {
    throw new Error(`Source import map found in ${htmlPath}`);
  }

  const pkg = readExamplePackage(examplePath);
  const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
  const imports = source.matchAll(
    /(?:\bfrom\s+|^\s*import\s+)["']([^"']+)["']/gm,
  );
  for (const [, specifier] of imports) {
    if (specifier.startsWith('.') || specifier.startsWith('/')) continue;
    if (isBuiltin(specifier) || specifier.startsWith('@nextgisweb/')) {
      continue;
    }
    const dependency = getDependencyName(specifier);
    if (!dependencies[dependency] && !dependencies[`@types/${dependency}`]) {
      throw new Error(`Missing ${dependency} in ${packagePath}`);
    }
  }
}

for (const examplePath of getExamplePaths()) {
  checkExamplePackage(examplePath);
}

function run(modulePath, args = []) {
  const result = spawnSync(process.execPath, [modulePath, ...args], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`Checking ${path.basename(typeCheckConfig)}`);
run(tsc, ['-p', typeCheckConfig]);
run(path.join(repoRoot, 'scripts', 'buildExamples.mjs'));
