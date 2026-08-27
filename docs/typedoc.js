// @ts-check
import findPackages from '../scripts/findPackages.js';

const allowPackages = (await findPackages()).filter((x) => {
  return !x.name.includes('cesium');
});

const entryPoints = allowPackages.map((x) => x.path.replace(/\\/g, '/'));

const config = {
  plugin: ['typedoc-plugin-markdown'],
  outputs: [
    { name: 'html', path: 'build' },
    { name: 'markdown', path: 'build/markdown' },
  ],
  entryPoints,
  name: 'NextGIS Frontend',
  excludePrivate: true,
  includeVersion: false,
  entryPointStrategy: 'packages',
  packageOptions: {
    entryPoints: ['src/index.ts'],
  },
  projectDocuments: ['PACKAGES.md'],
};

export default config;
