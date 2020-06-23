const createWebpack = require('./webpack.config');
const path = require('path');

module.exports = (config) => {
  const coverage = false;
  // const coverage = config.coverage !== undefined ? true : false;

  const reporters = ['dots'];
  if (coverage) {
    reporters.push('coverage-istanbul');
  }
  config.set({
    port: 8080,
    basePath: '../',
    browsers: [
      // 'Firefox',
      'Chrome',
    ],
    frameworks: ['mocha'],
    files: [
      { pattern: 'test/specs/*.ts', type: 'ts' },
      // { pattern: 'test/specs/ol-map-adapter.spec.ts', type: 'ts' },
      // { pattern: 'test/specs/ngw-orm.ts', type: 'ts' },
    ],
    preprocessors: {
      'test/specs/*.spec.ts': ['webpack', 'sourcemap'], // 'sourcemap'
    },
    webpack: createWebpack({ coverage }),
    webpackMiddleware: {
      noInfo: true,
    },
    reporters,
    coverageIstanbulReporter: {
      reports: ['text-summary', 'html'],
      dir: path.resolve(__dirname, '../coverage/'),
      fixWebpackSourcePaths: true,
    },
  });
};
