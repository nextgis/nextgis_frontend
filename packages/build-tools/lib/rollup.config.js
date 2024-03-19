// @ts-check
// based on https://github.com/vuejs/vue-next/blob/master/rollup.config.js

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import alias from '@rollup/plugin-alias';
import commonJS from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import autoprefixer from 'autoprefixer';
import chalk from 'chalk';
import cssnano from 'cssnano';
import postcssUrl from 'postcss-url';
import esbuild from 'rollup-plugin-esbuild';
import polyfillNode from 'rollup-plugin-polyfill-node';
import postcss from 'rollup-plugin-postcss';
import ts from 'rollup-plugin-typescript2';

import { baseDirs, getPeerDependencies, require, rootPath } from './utils.js';

/**
 * @template T
 * @template {keyof T} K
 * @typedef { Omit<T, K> & Required<Pick<T, K>> } MarkRequired
 */
/** @typedef {'cjs' | 'esm-bundler' | 'global' | 'esm-browser'} PackageFormat */
/** @typedef {MarkRequired<import('rollup').OutputOptions, 'file' | 'format'>} OutputOptions */

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.');
}

const masterVersion = require(path.resolve(rootPath, 'lerna.json')).version;

const packagesDir = path.resolve(rootPath, 'packages');
const packageDir = path.resolve(packagesDir, process.env.TARGET);

const name = path.basename(packageDir);
const resolve = (/** @type {string} */ p) => path.resolve(packageDir, p);
const pkg = require(resolve(`package.json`));
const packageOptions = pkg.buildOptions || {};

/** @type {Record<PackageFormat, OutputOptions>} */
const outputConfigs = {
  'esm-bundler': {
    file: resolve(`lib/${name}.esm-bundler.js`),
    format: `es`,
  },
  'esm-browser': {
    file: resolve(`lib/${name}.esm-browser.js`),
    format: `es`,
  },
  cjs: {
    file: resolve(`lib/${name}.cjs.js`),
    format: `cjs`,
  },
  global: {
    file: resolve(`lib/${name}.global.js`),
    format: `iife`,
  },
};
const defaultFormats = ['esm-bundler', 'cjs'];
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',');
const dependencies = getPeerDependencies(process.env.TARGET);

const packageFormats =
  inlineFormats || packageOptions.formats || defaultFormats;
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map((/** @type {PackageFormat} */ format) =>
      createConfig(format, outputConfigs[format]),
    );

if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach((/** @type {PackageFormat} */ format) => {
    if (packageOptions.prod === false) {
      return;
    }
    if (format === 'cjs') {
      packageConfigs.push(createProductionConfig(format));
    }
    if (/^(global|esm-browser)?/.test(format)) {
      packageConfigs.push(createMinifiedConfig(format));
    }
  });
}

export default packageConfigs;

/**
 *
 * @param {PackageFormat} format
 * @param {OutputOptions} output
 * @param {ReadonlyArray<import('rollup').Plugin>} plugins
 * @returns {import('rollup').RollupOptions}
 */
function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(chalk.yellow(`invalid format: "${format}"`));
    process.exit(1);
  }

  const isProductionBuild =
    process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file);
  const isBundlerESMBuild = /esm-bundler/.test(format);
  const isBrowserESMBuild = /esm-browser/.test(format);
  const isCJSBuild = format === 'cjs';
  const isGlobalBuild = /global/.test(format);

  const isBrowserBuild =
    isGlobalBuild || isBrowserESMBuild || isBundlerESMBuild;

  const external =
    isGlobalBuild || isBrowserESMBuild
      ? []
      : // Node / esm-bundler builds. Externalize everything.
        [
          ...dependencies,
          ...(Array.isArray(packageOptions.externals)
            ? packageOptions.externals
            : []),
        ];

  output.banner = `/** Bundle of ${pkg.name}; version: ${pkg.version}; author: ${pkg.author} */`;

  output.exports = 'auto'; //: 'named'
  if (isCJSBuild) {
    output.esModule = true;
  }
  output.sourcemap = true;
  output.externalLiveBindings = false;
  // https://github.com/rollup/rollup/pull/5380
  output.reexportProtoFromExternal = false;

  if (isGlobalBuild) {
    output.name = packageOptions.name;
  }

  output.globals = {};

  const entryFile = `src/index.ts`;

  function resolveDefine() {
    /** @type {Record<string, string>} */
    const replacements = {
      __COMMIT__: `"${process.env.COMMIT}"`,
      __VERSION__: `"${masterVersion}"`,
      // If the build is expected to run directly in the browser (global / esm builds)
      __BROWSER__: String(isBrowserBuild),
      __GLOBAL__: String(isGlobalBuild),
      __ESM_BUNDLER__: String(isBundlerESMBuild),
      __ESM_BROWSER__: String(isBrowserESMBuild),
      // is targeting Node (SSR)?
      __CJS__: String(isCJSBuild),
    };

    if (!isBundlerESMBuild) {
      // hard coded dev/prod builds
      replacements.__DEV__ = String(!isProductionBuild);
    }

    // allow inline overrides like
    Object.keys(replacements).forEach((key) => {
      if (key in process.env) {
        const value = process.env[key];
        assert(typeof value === 'string');
        replacements[key] = value;
      }
    });
    return replacements;
  }

  // esbuild define is a bit strict and only allows literal json or identifiers
  // so we still need replace plugin in some cases
  function resolveReplace() {
    /** @type {Record<string, string>} */
    const replacements = packageOptions.tsbuild ? resolveDefine() : {};

    if (isBundlerESMBuild) {
      Object.assign(replacements, {
        // preserve to be handled by bundlers
        __DEV__: `!!(process.env.NODE_ENV !== 'production')`,
      });
    }

    if (Object.keys(replacements).length) {
      return [replace({ values: replacements, preventAssignment: true })];
    } else {
      return [];
    }
  }

  function resolveNodePlugins() {
    const nodePlugins =
      isGlobalBuild || isBrowserESMBuild
        ? [
            commonJS({
              sourceMap: false,
            }),
            ...(format === 'cjs' ? [] : [polyfillNode()]),
            nodeResolve({ preferBuiltins: true }),
          ]
        : [];

    nodePlugins.push(image());

    nodePlugins.push(
      postcss({
        extract: packageOptions.injectCss ? false : resolve(`lib/${name}.css`),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        plugins: [postcssUrl({ url: 'inline' }), autoprefixer(), cssnano()],
      }),
    );

    return nodePlugins;
  }

  function resolveCompiler() {
    if (packageOptions.tsbuild) {
      let compilerOptions = {};

      if (isGlobalBuild) {
        output.name = packageOptions.name;
        compilerOptions = {
          target: 'es5',
          module: 'es2015',
        };
      }

      return ts({
        check: false,
        tsconfig: path.resolve(rootPath, 'tsconfig.json'),
        cacheRoot: path.resolve(rootPath, 'node_modules/.rts2_cache'),
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: output.sourcemap,
            declaration: false,
            declarationMap: false,
            ...compilerOptions,
          },
          exclude: ['tests'],
          include: [
            resolve('src'),
            path.resolve(packagesDir, 'global.d.ts'),
            ...dependencies
              .filter((e) => /^@nextgis\//.test(e))
              .map((e) =>
                path.resolve(packagesDir, e.replace('@nextgis/', ''), 'src'),
              ),
          ],
        },
      });
    }
    return esbuild({
      tsconfig: path.resolve(rootPath, 'tsconfig.json'),
      sourceMap: !!output.sourcemap,
      minify: false,
      target: isCJSBuild ? 'es2019' : 'es2015',
      define: resolveDefine(),
    });
  }

  function ignoreLibImports() {
    const pattern = /^@nextgis\/[^/]+\/lib\//;
    return {
      name: 'ignore-nextgis-lib-imports',
      /**
       * @param {string} source
       */
      resolveId(source) {
        if (pattern.test(source)) {
          return false;
        }
        return null;
      },
    };
  }

  const entries = dependencies
    .filter((e) => /^@nextgis\//.test(e))
    .flatMap((e) => {
      const packageName = e.replace('@nextgis/', '');
      return baseDirs
        .filter((/** @type {string} */ baseDir) => {
          return fs.existsSync(path.join(baseDir, packageName));
        })
        .flatMap((/** @type {string} */ baseDir) => [
          {
            find: new RegExp(`^${e}/lib/(.*)`),
            replacement: path.join(baseDir, packageName, 'lib', '$1'),
          },
          {
            find: e,
            replacement: path.join(baseDir, packageName, 'src', 'index.ts'),
          },
        ]);
    });

  if (packageOptions.alias) {
    entries.push(
      ...packageOptions.alias.map(
        (/** @type {{ find: string | RegExp; replacement: string; }} */ x) => {
          const find = new RegExp(x.find);
          return {
            ...x,
            replacement: path.resolve(rootPath, 'node_modules', x.replacement),
            find,
          };
        },
      ),
    );
  }

  return {
    input: resolve(entryFile),
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external: (id) => {
      if (!id.startsWith('.')) {
        const isExt = external.some((x) => id.startsWith(x));

        return !!isExt;
      }
      return false;
    },
    plugins: [
      json({
        namedExports: false,
      }),
      ignoreLibImports(),
      alias({
        entries,
      }),
      ...resolveReplace(),
      resolveCompiler(),
      ...resolveNodePlugins(),
      ...plugins,
    ],
    output,
    onwarn: (msg, warn) => {
      if (msg.code !== 'CIRCULAR_DEPENDENCY') {
        warn(msg);
      }
    },
    treeshake: {
      moduleSideEffects: !!packageOptions.injectCss,
      // moduleSideEffects: false,
    },
  };
}

function createProductionConfig(/** @type {PackageFormat} */ format) {
  return createConfig(format, {
    file: resolve(`lib/${name}.${format}.prod.js`),
    format: outputConfigs[format].format,
  });
}

function createMinifiedConfig(/** @type {PackageFormat} */ format) {
  return createConfig(
    format,
    {
      file: outputConfigs[format].file.replace(/\.js$/, '.prod.js'),
      format: outputConfigs[format].format,
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true,
        },
        safari10: true,
      }),
    ],
  );
}
