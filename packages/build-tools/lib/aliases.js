import fs from 'node:fs';
import path from 'node:path';

import { directoryName } from './utils.js';

const isDirectory = (source) => fs.lstatSync(source).isDirectory();

export default function generate(source = '', moduleFlag = false) {
  source = source || path.resolve(path.join(directoryName, '..', '..'));
  const items = {};
  fs.readdirSync(source).forEach((name) => {
    const libPath = path.join(source, name);
    // find packages
    if (isDirectory(libPath)) {
      const pkgPath = path.join(libPath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

        if (moduleFlag) {
          if (pkg.module) {
            const modulePath = path.join(libPath, pkg.module);
            if (fs.existsSync(modulePath)) {
              items[pkg.name + '$'] = modulePath;
            }
          }
        } else {
          items[pkg.name + '$'] = path.join(libPath, '/src/index.ts');
        }
      }
    }
  });
  return items;
}
