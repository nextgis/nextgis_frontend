const path = require('path');
const createWebpack = require('./webpack.config.cjs');

module.exports = (config) => {
  const coverage = config.coverage !== undefined ? true : false;

  const reporters = ['progress'];
  if (coverage) {
    reporters.push('coverage');
  }
  config.set({
    port: 8080,
    basePath: '../',
    browsers: [
      // 'Firefox',
      'Chrome',
    ],
    frameworks: ['mocha', 'webpack'],

    plugins: [
      'karma-coverage',
      'karma-mocha',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
    ],
    files: [
      // { pattern: 'tests/specs/properties-filter.spec.ts', type: 'ts' },
      // { pattern: 'tests/specs/cache.spec.ts', type: 'ts' },
      // { pattern: 'tests/specs/area.spec.ts', type: 'ts' },
      // { pattern: 'tests/specs/expression.spec.ts', type: 'ts' },
      { pattern: 'tests/specs/*.spec.ts', type: 'ts' },
      // { pattern: 'tests/internet-specs/**/ngw-kit.ngw-webmap.spec.ts', type: 'ts' },
      { pattern: 'tests/internet-specs/**/*.spec.ts', type: 'ts' },
    ],
    preprocessors: {
      'tests/specs/*.spec.ts': ['webpack', 'sourcemap', 'coverage'],
      'tests/internet-specs/**/*.spec.ts': ['webpack', 'sourcemap', 'coverage'],
    },
    webpack: createWebpack({ coverage }),
    webpackMiddleware: {
      noInfo: true,
    },
    reporters,
    coverageReporter: {
      type: 'html',
      dir: path.resolve(__dirname, '../coverage/'),
    },
  });
};
