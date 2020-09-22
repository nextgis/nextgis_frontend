const { join, resolve } = require('path');
const { lstatSync, readdirSync, readFileSync, existsSync } = require('fs');

const isDirectory = (source) => lstatSync(source).isDirectory();

function findPackages(source, module = false) {
  source = source || resolve(__dirname, '..', 'packages');
  const items = [];
  const ignored = getExcludedPackages();
  readdirSync(source).forEach((name) => {
    if (ignored.indexOf('@nextgis/' + name) === -1) {
      const libPath = join(source, name);
      if (isDirectory(libPath)) {
        const packagePath = join(libPath, 'package.json');
        if (existsSync(packagePath)) {
          const package = JSON.parse(readFileSync(packagePath, 'utf8'));
          if (!package.private) {
            items.push({
              name,
              path: libPath,
              package,
            });
          }
        }
      }
    }
  });
  return items;
}

function getExcludedPackages() {
  const lernaConfigPath = resolve(__dirname, '..', 'lerna.json');
  const lernaConfig = JSON.parse(readFileSync(lernaConfigPath, 'utf8'));
  const ignored =
    lernaConfig.command &&
    lernaConfig.command.run &&
    lernaConfig.command.run.ignore;
  if (!ignored) {
    throw new Error('Lerna config has no `ignore` options');
  }
  return ignored;
}

module.exports = (source, module) => {
  return findPackages(source, module);
};
