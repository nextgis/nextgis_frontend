// @ts-check
/*
Based on https://github.com/vuejs/vue-next/blob/master/scripts/build.js

Produces production builds and stitches together d.ts files.

To specify the package to build, simply pass its name and the desired build
formats to output (defaults to `buildOptions.formats` specified in that package,
or "esm,cjs"):

*/

import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import { cpus } from 'node:os';
import path from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

import chalk from 'chalk';
import { execa, execaSync } from 'execa';
import minimist from 'minimist';

import {
  directoryName,
  fuzzyMatchTarget,
  getTargets,
  require,
  rootPath,
} from './utils.js';

const args = minimist(process.argv.slice(2));
const targets = args._;
const watch = args.watch || args.w;
const formats = args.formats || args.f || (watch && 'global');
const devOnly = watch || args.devOnly || args.d;
const prodOnly = !devOnly && (args.prodOnly || args.p);
const sourceMap = args.sourcemap || args.s || watch;
const isRelease = args.release;
const buildTypes = args.t || args.types || isRelease;
const buildAllMatching = args.all || args.a;

const commit = execaSync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7);
const cwd = process.cwd();
const isSelfPackage_ = cwd.match(/packages[\\, /](\D+)$/);
const isSelfPackage = isSelfPackage_ && isSelfPackage_[0];

run();

export default async function run() {
  const target = isSelfPackage;
  let allTargets = [];
  if (target) {
    allTargets = [target];
  } else if (!targets.length) {
    allTargets = getTargets();
  } else {
    allTargets = fuzzyMatchTarget(targets, buildAllMatching);
  }
  await buildAll(allTargets);

  if (buildTypes) {
    console.log();
    console.log(chalk.bold(chalk.yellow(`Rolling up type definitions...`)));

    await execa('npm', ['run', 'build-dts'], {
      stdio: 'inherit',
      cwd: rootPath,
    });
  }

  await checkAllSizes(allTargets);
}
/**
 * Builds all the targets in parallel.
 * @param {Array<string>} targets - An array of targets to build.
 * @returns {Promise<void>} - A promise representing the build process.
 */
async function buildAll(targets) {
  await runParallel(cpus().length, targets, build);
}

/**
 * Runs iterator function in parallel.
 * @template T - The type of items in the data source
 * @param {number} maxConcurrency - The maximum concurrency.
 * @param {Array<T>} source - The data source
 * @param {(item: T) => Promise<void>} iteratorFn - The iteratorFn
 * @returns {Promise<void[]>} - A Promise array containing all iteration results.
 */
async function runParallel(maxConcurrency, source, iteratorFn) {
  /**@type {Promise<void>[]} */
  const ret = [];
  /**@type {Promise<void>[]} */
  const executing = [];

  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    if (maxConcurrency <= source.length) {
      const e = p.then(() => {
        executing.splice(executing.indexOf(e), 1);
      });
      executing.push(e);
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

/**
 * @param {string} target
 */
async function build(target) {
  let pkgPath = `packages/${target}`;
  if (isSelfPackage) {
    pkgPath = `../../${target}`;
  }
  const pkgDir = path.resolve(pkgPath);
  const pkgFullPath = `${pkgDir}/package.json`;
  const pkg = require(pkgFullPath);

  // only build published packages for release
  if (isRelease && pkg.private) {
    return;
  }

  // if building a specific format, do not remove lib.
  if (!formats) {
    await fs.rm(`${pkgDir}/lib`, { recursive: true, force: true });
  }

  const env =
    (pkg.buildOptions && pkg.buildOptions.env) ||
    (devOnly ? 'development' : 'production');

  const config = path.join(directoryName, './rollup.config.js');

  await execa(
    'rollup',
    [
      watch ? '-wc' : '-c',
      `${config}`,
      '--environment',
      [
        `COMMIT:${commit}`,
        `NODE_ENV:${env}`,
        `TARGET:${target.replace('packages\\', '')}`,
        formats ? `FORMATS:${formats}` : ``,
        buildTypes ? `TYPES:true` : ``,
        prodOnly ? `PROD_ONLY:true` : ``,
        sourceMap ? `SOURCE_MAP:true` : ``,
      ]
        .filter(Boolean)
        .join(','),
    ],
    { stdio: 'inherit', cwd: rootPath },
  );
}

/**
 * @param {string[]} targets
 */
async function checkAllSizes(targets) {
  if (devOnly && watch) {
    return;
  }
  console.log();
  for (const target of targets) {
    await checkSize(target);
  }
  console.log();
}

/**
 * @param {string} target
 */
async function checkSize(target) {
  const pkgDir = path.resolve(
    rootPath,
    'packages',
    target,
    'lib',
    `${target}.global.prod.js`,
  );
  await checkFileSize(pkgDir);
}

/**
 * @param {string} filePath
 */
async function checkFileSize(filePath) {
  if (!existsSync(filePath)) {
    return;
  }
  const file = await fs.readFile(filePath);
  const minSize = (file.length / 1024).toFixed(2) + 'kb';
  const gzipped = gzipSync(file);
  const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb';
  const compressed = brotliCompressSync(file);
  const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb';
  console.log(
    `${chalk.gray(
      chalk.bold(path.basename(filePath)),
    )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`,
  );
}
