import fs from 'node:fs';
import path from 'node:path';

import findPackages from './findPackages.js';

export default function checkBuild() {
  const libs = findPackages();
  const notValid = {};
  libs.forEach((x) => {
    const errors = checkLib(x);
    errors.forEach((er) => {
      if (er) {
        notValid[x.name] = notValid[x.name] || [];
        notValid[x.name].push(er);
      }
    });
  });
  return notValid;
}

function checkLib(pkg) {
  return [checkBundle, checkTypes].map((x) => x(pkg)).filter(Boolean);
}

function checkBundle(lib) {
  const re = /\/\*\* Bundle of (\D+); version: (\S+); author: (\w+) \*\//;
  try {
    const pkg = lib.package;
    const formats = pkg.buildOptions.formats;

    const pathsToCheck = new Set([pkg.module]);
    if (pkg.unpkg) {
      pathsToCheck.add(pkg.unpkg);
    }
    if (pkg.jsdelivr) {
      pathsToCheck.add(pkg.jsdelivr);
    }
    formats.forEach((x) => {
      const baseName = `lib/${pkg.name.replace('@nextgis/', '')}.${x}.`;
      pathsToCheck.add(baseName + 'js');
      pathsToCheck.add(baseName + 'prod.js');
    });
    const uniqueArray = Array.from(pathsToCheck);

    for (let fry = 0; fry < uniqueArray.length; fry++) {
      const formatPath = uniqueArray[fry];
      const modulePath = path.join(lib.path, formatPath);
      if (fs.existsSync(modulePath)) {
        if (!modulePath.endsWith('prod.js')) {
          const module = fs.readFileSync(modulePath, 'utf8');
          const exec = re.exec(module);
          if (exec) {
            const [, name, version] = exec;
            if (name === pkg.name && version === pkg.version) {
              //
            } else {
              return 'not updated';
            }
          } else {
            return 'not valid';
          }
        }
      } else {
        return formatPath + ' does not exist';
      }
    }
  } catch (err) {
    return 'error';
  }
}

function checkTypes(lib) {
  const pkg = lib.package;
  if (pkg.types) {
    const typesPath = path.join(lib.path, pkg.types);
    if (!fs.existsSync(typesPath)) {
      return 'types does not exist';
    }
  }
}
