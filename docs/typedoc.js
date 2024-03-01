const findPackages = require('../scripts/findPackages');

const allowPackages = findPackages().filter((x) => {
  return !x.name.includes('react') && !x.name.includes('cesium');
});
const entryPoints = allowPackages.map((x) => x.path + '/src/index.ts');

module.exports = {
  out: 'build',
  entryPoints,
  name: 'NextGIS Frontend',
  excludePrivate: true,
};
