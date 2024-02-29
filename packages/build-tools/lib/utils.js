import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';

export const require = createRequire(import.meta.url);

export const directoryName = path.dirname(fileURLToPath(import.meta.url));

export const rootPath = path.resolve(directoryName, '..', '..', '..');

export const getTargets = () =>
  fs.readdirSync('packages').filter((f) => {
    if (!fs.statSync(`packages/${f}`).isDirectory()) {
      return false;
    }
    const pkg = require(`../../${f}/package.json`);
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
