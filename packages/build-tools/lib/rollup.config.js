// based on https://github.com/vuejs/vue-next/blob/master/rollup.config.js

import path from 'path';
import ts from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.');
}

const rootPath = path.resolve(__dirname, '..', '..', '..');

const masterVersion = require('../../../lerna.json').version;
const packagesDir = path.resolve(rootPath, 'packages');
const packageDir = path.resolve(packagesDir, process.env.TARGET);
const name = path.basename(packageDir);
const resolve = (p) => path.resolve(packageDir, p);
const pkg = require(resolve(`package.json`));
const packageOptions = pkg.buildOptions || {};
const dependencies = getPeerDependencies(process.env.TARGET);

// ensure TS checks only once for each build
let hasTSChecked = false;

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
const packageFormats =
  inlineFormats || packageOptions.formats || defaultFormats;
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map((format) => createConfig(format, outputConfigs[format]));

if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach((format) => {
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

function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`));
    process.exit(1);
  }

  output.sourcemap = !!process.env.SOURCE_MAP;
  output.externalLiveBindings = false;
  output.exports = 'auto';
  output.banner = `/** Bundle of ${pkg.name}; version: ${pkg.version}; author: ${pkg.author} */`;
  const isProductionBuild =
    process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file);
  const isBundlerESMBuild = /esm-bundler/.test(format);
  const isBrowserESMBuild = /esm-browser/.test(format);
  const isNodeBuild = format === 'cjs';
  const isGlobalBuild = /global/.test(format);

  const external =
    isGlobalBuild || isBrowserESMBuild
      ? []
      : // Node / esm-bundler builds. Externalize everything.
        [...dependencies, 'vuetify/lib'];

  let compilerOptions = {};

  if (isGlobalBuild) {
    output.name = packageOptions.name;
    compilerOptions = {
      target: 'es5',
      module: 'es2015',
    };
  }

  const shouldEmitDeclarations = process.env.TYPES != null && !hasTSChecked;
  const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: path.resolve(rootPath, 'tsconfig.json'),
    cacheRoot: path.resolve(rootPath, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations,
        ...compilerOptions,
      },
      exclude: ['tests'],
      include: [
        resolve('src'),
        path.resolve(packagesDir, 'global.d.ts'),
        ...dependencies
          .filter((e) => /^@nextgis\//.test(e))
          .map((e) =>
            path.resolve(packagesDir, e.replace('@nextgis/', ''), 'src')
          ),
      ],
    },
  });
  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true;

  const entryFile = `src/index.ts`;

  output.globals = {};

  const nodePlugins = [];

  if (packageOptions.alias) {
    nodePlugins.push(
      require('@rollup/plugin-alias')({
        entries: packageOptions.alias.map((x) => {
          const find = new RegExp(x.find);
          return { ...x, find };
        }),
      })
    );
  }

  if (format !== 'cjs') {
    [
      require('@rollup/plugin-node-resolve').nodeResolve({
        preferBuiltins: false,
      }),
      require('@rollup/plugin-commonjs')({
        sourceMap: false,
      }),
    ].forEach((x) => nodePlugins.push(x));
  }

  nodePlugins.push(require('@rollup/plugin-image')());
  nodePlugins.push(
    require('rollup-plugin-postcss')({
      extract: packageOptions.injectCss ? false : resolve(`lib/${name}.css`),
      plugins: [
        require('postcss-url')({ url: 'inline' }),
        require('autoprefixer'),
        require('cssnano')(),
      ],
    })
  );

  // nodePlugins.push(require('rollup-plugin-visualizer')());

  return {
    input: resolve(entryFile),
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external,
    plugins: [
      json({
        namedExports: false,
      }),
      tsPlugin,
      createReplacePlugin(
        isProductionBuild,
        isBundlerESMBuild,
        isBrowserESMBuild,
        // isBrowserBuild?
        isGlobalBuild || isBrowserESMBuild || isBundlerESMBuild,
        isGlobalBuild,
        isNodeBuild
      ),
      ...nodePlugins,
      ...plugins,
    ],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        // for ol build
        if (msg.code === 'THIS_IS_UNDEFINED') return;
        warn(msg);
      }
    },
    treeshake: {
      moduleSideEffects: !!packageOptions.injectCss,
      // moduleSideEffects: false,
    },
  };
}

function createReplacePlugin(
  isProduction,
  isBundlerESMBuild,
  isBrowserESMBuild,
  isBrowserBuild,
  isGlobalBuild,
  isNodeBuild
) {
  const replacements = {
    __COMMIT__: `"${process.env.COMMIT}"`,
    __VERSION__: `"${masterVersion}"`,
    __DEV__: isBundlerESMBuild
      ? // preserve to be handled by bundlers
        `(process.env.NODE_ENV !== 'production')`
      : // hard coded dev/prod builds
        !isProduction,
    // this is only used during Vue's internal tests
    __TEST__: false,
    // If the build is expected to run directly in the browser (global / esm builds)
    __BROWSER__: isBrowserBuild,
    __GLOBAL__: isGlobalBuild,
    __ESM_BUNDLER__: isBundlerESMBuild,
    __ESM_BROWSER__: isBrowserESMBuild,
    // is targeting Node (SSR)?
    __NODE_JS__: isNodeBuild,
    __FEATURE_OPTIONS__: true,
    __FEATURE_SUSPENSE__: true,
    ...{
      // 'styleInject(': `/*#__PURE__*/ styleInject(`,
    },
  };
  // allow inline overrides like

  Object.keys(replacements).forEach((key) => {
    if (key in process.env) {
      replacements[key] = process.env[key];
    }
  });
  return replace({
    preventAssignment: true,
    values: replacements
  });
}

function createProductionConfig(format) {
  return createConfig(format, {
    file: resolve(`lib/${name}.${format}.prod.js`),
    format: outputConfigs[format].format,
  });
}

function createMinifiedConfig(format) {
  const { terser } = require('rollup-plugin-terser');
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
      }),
    ]
  );
}

function getPeerDependencies(target, deps = []) {
  const packageDir_ = path.resolve(packagesDir, target);
  const resolve_ = (p) => path.resolve(packageDir_, p);
  const pkg_ = require(resolve_(`package.json`));

  const dependencies = [
    ...Object.keys(pkg_.dependencies || {}),
    ...Object.keys(pkg_.peerDependencies || {}),
  ];
  dependencies.forEach((e) => {
    if (!deps.includes(e)) {
      deps.push(e);
      if (/^@nextgis\//.test(e)) {
        getPeerDependencies(e.replace('@nextgis/', ''), deps);
      }
    }
  });
  return deps;
}
