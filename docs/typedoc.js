// @ts-check
import findPackages from '../scripts/findPackages.js';

const allowPackages = (await findPackages()).filter((x) => {
  return !x.name.includes('react') && !x.name.includes('cesium');
});

const entryPoints = allowPackages.map((x) => x.path.replace(/\\/g, '/'));

const config = {
  out: 'build',
  entryPoints,
  name: 'NextGIS Frontend',
  excludePrivate: true,
  includeVersion: false,
  entryPointStrategy: 'packages',
};

export default config;
