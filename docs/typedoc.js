const findPackages = require('../scripts/findPackages');

const packages = findPackages();

const entryPoints = packages
  .filter((x) => {
    return !x.name.includes('vue');
  })
  .map((x) => x.path + '/src/index.ts');

module.exports = {
  out: 'build',
  entryPoints,
  exclude: ['**/node_modules/**', '**/*.spec.ts', '../demo', '../tests'],
  name: 'NextGIS Frontend',
  excludePrivate: true,
};
