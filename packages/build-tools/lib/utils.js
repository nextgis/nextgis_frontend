import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';

export const require = createRequire(import.meta.url);
export const currentWorkingDirectory = process.cwd();
export const directoryName = path.dirname(fileURLToPath(import.meta.url));
export const rootPath = findRootDirectory(currentWorkingDirectory);

export const tsconfig = require(path.join(rootPath, 'tsconfig.json'));

export const tsconfigPaths = tsconfig.compilerOptions.paths['@nextgis/*'];
export const baseDirs = tsconfigPaths.map((p) => {
  // Remove '/*' and anything after 'packages' in the path
  const trimmedPath = p.replace('/*', '').split('/packages/')[0] + '/packages';
  return path.resolve('.', trimmedPath);
});

export function findRootDirectory(currentDir) {
  let dir = currentDir;
  while (dir !== path.dirname(dir)) {
    const packagePath = path.join(dir, 'package.json');

    if (fs.existsSync(packagePath)) {
      const packageJson = require(packagePath);

      if (packageJson.name === 'root') {
        return dir;
      }
    }

    dir = path.dirname(dir);
  }

  return currentDir;
}

export const getTargets = () =>
  fs.readdirSync('packages').filter((f) => {
    if (!fs.statSync(`packages/${f}`).isDirectory()) {
      return false;
    }
    const pkg = require(path.join(rootPath, 'packages', f, 'package.json'));
    if (pkg.private || !pkg.buildOptions) {
      return false;
    }
    return true;
  });

export const fuzzyMatchTarget = (partialTargets, includeAllMatching) => {
  const matched = [];
  partialTargets.forEach((partialTarget) => {
    for (const target of getTargets()) {
      if (target.match(partialTarget)) {
        matched.push(target);
        if (!includeAllMatching) {
          break;
        }
      }
    }
  });
  if (matched.length) {
    return matched;
  } else {
    console.log();
    console.error(
      `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
        `Target ${chalk.underline(partialTargets)} not found!`,
      )}`,
    );
    console.log();

    process.exit(1);
  }
};

/**
 * Finds the package directory among multiple base directories.
 * @param {string} target The package name
 * @returns {string|null} The found package directory or null if not found
 */
function findPackageDir(target) {
  for (const dir of baseDirs) {
    const possibleDir = path.join(dir, target);
    if (fs.existsSync(path.join(possibleDir, 'package.json'))) {
      return possibleDir;
    }
  }
  return null;
}

/**
 * Recursively gets peer dependencies for a given target.
 * @param {string} target The package name to get dependencies for
 * @param {Array<string>} deps An array to accumulate dependencies
 * @returns {Array<string>} An array of dependencies
 */
export function getPeerDependencies(target, deps = []) {
  const packageDir = findPackageDir(target);
  if (!packageDir) {
    // If the package directory is not found, return current dependencies
    return deps;
  }

  const resolve = (p) => path.resolve(packageDir, p);
  const pkg = require(resolve('package.json'));

  const dependencies = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.optionalDependencies || {}),
  ];

  dependencies.forEach((e) => {
    if (!deps.includes(e)) {
      deps.push(e);
      if (/^@nextgis\//.test(e)) {
        try {
          getPeerDependencies(e.replace('@nextgis/', ''), deps);
        } catch {
          // Handle errors or leave empty if no action is required
        }
      }
    }
  });

  return deps;
}

export function ignoreAssets() {
  const pattern = /\.(css|scss|png|jpg|jpeg|svg|woff|woff2|ttf)$/;
  return {
    name: 'ignore-assets',
    /**
     * @param {string} id
     */
    resolveId(id) {
      if (pattern.test(id)) {
        return false;
      }
      return null;
    },
  };
}
