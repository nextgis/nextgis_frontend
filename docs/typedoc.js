const findPackages = require('../scripts/findPackages');

const filteredPackages = findPackages().filter((x) => {
  return !x.name.includes('vue');
});

const entryPoints = filteredPackages.map((x) => x.path + '/src/index.ts');

module.exports = {
  out: 'build',
  entryPoints,
  exclude: ['**/node_modules/**', '**/*.spec.ts', '../demo', '../tests'],
  name: 'NextGIS Frontend',
  excludePrivate: true,
};
