import { existsSync, lstatSync, readdirSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDirectory = (source) => lstatSync(source).isDirectory();

function findPackages(source, module = false) {
  source = source || resolve(__dirname, '..', 'packages');
  const items = [];
  const ignored = getExcludedPackages();

  readdirSync(source).forEach((name) => {
    if (!ignored.includes(`@nextgis/${name}`)) {
      const libPath = join(source, name);
      if (isDirectory(libPath)) {
        const packagePath = join(libPath, 'package.json');
        if (existsSync(packagePath)) {
          const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
          if (!pkg.private) {
            items.push({
              name,
              path: libPath,
              package: pkg,
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
    throw new Error('Конфигурация Lerna не содержит опций `ignore`');
  }

  return ignored;
}

export default findPackages;
