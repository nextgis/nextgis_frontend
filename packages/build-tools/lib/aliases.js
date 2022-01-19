const { join, resolve } = require('path');
const { lstatSync, readdirSync, readFileSync, existsSync } = require('fs');

const isDirectory = (source) => lstatSync(source).isDirectory();

function generate(source = '', module = false) {
  source = source || resolve(__dirname, '..', '..');
  const items = {};
  readdirSync(source).forEach((name) => {
    const libPath = join(source, name);
    // find packages
    if (isDirectory(libPath)) {
      const pkgPath = join(libPath, 'package.json');
      if (existsSync(pkgPath)) {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

        if (module) {
          if (pkg.module) {
            const module = join(libPath, pkg.module);
            if (existsSync(module)) {
              items[pkg.name + '$'] = module;
            }
          }
        } else {
          items[pkg.name + '$'] = join(libPath, '/src/index.ts');
        }
      }
    }
  });
  return items;
}

module.exports = (source, module) => {
  return generate(source, module);
};
