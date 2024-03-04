// @ts-check
const findPackages = require('../scripts/findPackages');

const allowPackages = findPackages().filter((x) => {
  return !x.name.includes('react') && !x.name.includes('cesium');
});

const entryPoints = allowPackages.map((x) => x.path);

const config = {
  out: 'build',
  entryPoints,
  name: 'NextGIS Frontend',
  excludePrivate: true,
  includeVersion: false,
  entryPointStrategy: 'packages',
};
module.exports = config;
