import { existsSync } from 'node:fs';
import path from 'node:path';

const manifestNames = ['package.json', 'index.json'];
const entryNames = ['index.tsx', 'index.ts', 'index.js'];

export function getExampleManifestPath(examplePath) {
  return manifestNames
    .map((name) => path.join(examplePath, name))
    .find(existsSync);
}

export function getExampleEntryPath(examplePath) {
  return entryNames
    .map((name) => path.join(examplePath, name))
    .find(existsSync);
}
