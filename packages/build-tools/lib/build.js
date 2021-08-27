/*
Based on https://github.com/vuejs/vue-next/blob/master/scripts/build.js

Produces production builds and stitches together d.ts files.

To specify the package to build, simply pass its name and the desired build
formats to output (defaults to `buildOptions.formats` specified in that package,
or "esm,cjs"):

```
# name supports fuzzy match. will build all packages with name containing "dom":
yarn build dom

# specify the format to output
yarn build core --formats cjs
```
*/

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const { gzipSync } = require('zlib');
const { compress } = require('brotli');
// const { targets: allTargets, fuzzyMatchTarget } = require('./utils');

const args = require('minimist')(process.argv.slice(2));
const targets = args._;
const watch = args.watch || args.w;
const formats = args.formats || args.f || (watch && 'global');
const devOnly = watch || args.devOnly || args.d;
const prodOnly = !devOnly && (args.prodOnly || args.p);
const sourceMap = args.sourcemap || args.s || watch;
const isRelease = args.release;
const buildTypes = args.t || args.types || isRelease;
const buildAllMatching = args.all || args.a;
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7);

run();

async function run() {
  const cwd = process.cwd();
  const target = cwd.match(/packages[\\, /](\D+)$/)[1];
  if (target) {
    await build(target);
    if (!watch) {
      checkAllSizes([target]);
    }
  } else if (!targets.length) {
    // await buildAll(allTargets);
    // checkAllSizes(allTargets);
  } else {
    // await buildAll(fuzzyMatchTarget(targets, buildAllMatching));
    // checkAllSizes(fuzzyMatchTarget(targets, buildAllMatching));
  }
}

async function buildAll(targets) {
  for (const target of targets) {
    await build(target);
  }
}

async function build(target) {
  const rootPath = path.resolve(__dirname, '..', '..', '..');
  const pkgPath = `../${target}`;
  const pkgDir = path.resolve(pkgPath);
  const pkgFullPath = `${pkgDir}/package.json`;
  const pkg = require(pkgFullPath);

  // only build published packages for release
  if (isRelease && pkg.private) {
    return;
  }

  // if building a specific format, do not remove lib.
  if (!formats) {
    await fs.remove(`${pkgDir}/lib`);
  }

  const env =
    (pkg.buildOptions && pkg.buildOptions.env) ||
    (devOnly ? 'development' : 'production');

  const config = path.join(__dirname, 'rollup.config.js');

  await execa(
    'rollup',
    [
      watch ? '-wc' : '-c',
      `'${config}'`,
      '--environment',
      [
        `COMMIT:${commit}`,
        `NODE_ENV:${env}`,
        `TARGET:${target}`,
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

  if (buildTypes && pkg.types) {
    console.log();
    console.log(
      chalk.bold(chalk.yellow(`Rolling up type definitions for ${target}...`)),
    );

    // build types
    const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');

    const reportFolder = path.resolve(rootPath, 'input');

    const reportTempFolder = path.resolve(rootPath, 'temp');

    const publicTrimmedFilePath = path.resolve(`${pkgPath}/lib/index.d.ts`);

    const extractorConfig = ExtractorConfig.prepare({
      packageJson: pkg,
      packageJsonFullPath: pkgFullPath,
      configObjectFullPath: pkgDir,
      configObject: {
        projectFolder: pkgDir,
        mainEntryPointFilePath: path.resolve(
          pkgPath,
          'lib',
          'packages',
          target,
          'src',
          'index.d.ts',
        ),
        compiler: {
          tsconfigFilePath: path.resolve(`${rootPath}/tsconfig.json`),
          overrideTsconfig: {
            include: [path.resolve(pkgPath, 'src')],
          },
        },
        docModel: {
          enabled: true,
          apiJsonFilePath: `${reportFolder}/<unscopedPackageName>.api.json`,
        },
        tsdocMetadata: {
          enabled: false,
        },
        dtsRollup: {
          enabled: true,
          publicTrimmedFilePath,
        },
        apiReport: {
          enabled: true,
          reportFolder,
          reportTempFolder,
          reportFileName: '<unscopedPackageName>.api.md',
        },
        messages: {
          compilerMessageReporting: {
            default: {
              logLevel: 'warning',
            },
          },

          extractorMessageReporting: {
            default: {
              logLevel: 'warning',
              addToApiReportFile: true,
            },

            'ae-missing-release-tag': {
              logLevel: 'none',
            },
          },

          tsdocMessageReporting: {
            default: {
              logLevel: 'warning',
            },
            'tsdoc-undefined-tag': {
              logLevel: 'none',
            },
            'tsdoc-unsupported-tag': {
              logLevel: 'none',
            },
          },
        },
      },
    });
    try {
      const extractorResult = Extractor.invoke(extractorConfig, {
        localBuild: true,
        showVerboseMessages: true,
      });

      if (extractorResult.succeeded) {
        // concat additional d.ts to rolled-up dts
        const typesDir = path.resolve(pkgDir, 'types');
        if (await fs.exists(typesDir)) {
          const dtsPath = path.resolve(pkgDir, pkg.types);
          const existing = await fs.readFile(dtsPath, 'utf-8');
          const typeFiles = await fs.readdir(typesDir);
          const toAdd = await Promise.all(
            typeFiles.map((file) => {
              return fs.readFile(path.resolve(typesDir, file), 'utf-8');
            }),
          );
          await fs.writeFile(dtsPath, existing + '\n' + toAdd.join('\n'));
        }
        console.log(
          chalk.bold(chalk.green(`API Extractor completed successfully.`)),
        );
      } else {
        console.error(
          `API Extractor completed with ${extractorResult.errorCount} errors` +
            ` and ${extractorResult.warningCount} warnings`,
        );
        process.exitCode = 1;
      }
    } catch (er) {
      console.log(chalk(er));
    }

    await fs.remove(`${pkgDir}/lib/packages`);
  }
}

function checkAllSizes(targets) {
  if (devOnly) {
    return;
  }
  console.log();
  for (const target of targets) {
    checkSize(target);
  }
  console.log();
}

function checkSize(target) {
  const pkgDir = path.resolve(`../${target}`);
  checkFileSize(`${pkgDir}/lib/${target}.global.prod.js`);
}

function checkFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const file = fs.readFileSync(filePath);
  const minSize = (file.length / 1024).toFixed(2) + 'kb';
  const gzipped = gzipSync(file);
  const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb';
  const compressed = compress(file);
  const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb';
  console.log(
    `${chalk.gray(
      chalk.bold(path.basename(filePath)),
    )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`,
  );
}
