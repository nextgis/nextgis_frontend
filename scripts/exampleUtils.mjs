import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

export const repoRoot = fileURLToPath(new URL('..', import.meta.url));

const exampleRoots = [
  path.join(repoRoot, 'demo', 'examples'),
  ...fs
    .readdirSync(path.join(repoRoot, 'packages'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(repoRoot, 'packages', entry.name, 'examples')),
];

export function getExampleRequest() {
  const { values, positionals } = parseArgs({
    options: { adapter: { type: 'string' } },
    allowPositionals: true,
  });
  const initialDirectory = process.env.INIT_CWD;
  const requestedPath =
    positionals[0] ||
    (initialDirectory && path.resolve(initialDirectory) !== process.cwd()
      ? initialDirectory
      : undefined);

  return {
    examplePath: requestedPath ? path.resolve(requestedPath) : undefined,
    adapter: values.adapter || positionals[1],
  };
}

export function readExamplePackage(examplePath) {
  const packagePath = path.join(examplePath, 'package.json');
  return fs.existsSync(packagePath)
    ? JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    : undefined;
}

export function getExamplePaths() {
  const paths = [];
  for (const root of exampleRoots) {
    if (!fs.existsSync(root)) continue;
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const examplePath = path.join(root, entry.name);
      if (readExamplePackage(examplePath)) paths.push(examplePath);
    }
  }
  return paths;
}
