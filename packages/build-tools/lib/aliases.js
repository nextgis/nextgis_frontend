const { join, resolve } = require('path');
const { lstatSync, readdirSync, readFileSync, existsSync } = require('fs');

const isDirectory = (source) => lstatSync(source).isDirectory();

function generate(source, module = false) {
  source = source || resolve(__dirname, '..', '..');
  const items = {};
  readdirSync(source).forEach((name) => {
    const libPath = join(source, name);
    // find packages
    if (isDirectory(libPath)) {
      const packagePath = join(libPath, 'package.json');
      if (existsSync(packagePath)) {
        const package = JSON.parse(readFileSync(packagePath, 'utf8'));

        if (module) {
          if (package.module) {
            const module = join(libPath, package.module);
            if (existsSync(module)) {
              items[package.name + '$'] = module;
            }
          }
        } else {
          items[package.name + '$'] = join(libPath, '/src/index.ts');
        }
      }
    }
  });
  return items;
}

module.exports = (source, module) => {
  return generate(source, module);
};
