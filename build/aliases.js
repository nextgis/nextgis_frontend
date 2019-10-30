const { join, resolve } = require('path');
const { lstatSync, readdirSync, readFileSync, existsSync } = require('fs');

const isDirectory = source => lstatSync(source).isDirectory();

function generate(source = '../packages') {
  source = resolve(__dirname, source);
  const items = {};

  readdirSync(source).forEach(name => {
    const libPath = join(source, name);

    // find packages
    if (isDirectory(libPath)) {
      const packagePath = join(libPath, 'package.json');
      if (existsSync(packagePath)) {
        const package = JSON.parse(readFileSync(packagePath, 'utf8'));
        if (!package.private) {
          items[package.name + '$'] = join(libPath, '/src/index.ts');
        }
      }
    }
  });
  return items;
}

exports.getAliases = function(source) {
  return generate(source);
};
