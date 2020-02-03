const createWebpack = require('./webpack.config');
const path = require('path');

module.exports = config => {
  const coverage = false;
  // const coverage = config.coverage !== undefined ? true : false;

  const reporters = ['dots'];
  if (coverage) {
    reporters.push('coverage-istanbul');
  }
  config.set({
    basePath: '../',
    browsers: ['Chrome'],
    frameworks: ['mocha'],
    files: [{ pattern: 'test/specs/*.ts', type: 'ts' }],
    preprocessors: {
      'test/specs/*.spec.ts': ['webpack'] // 'sourcemap'
    },
    webpack: createWebpack({ coverage }),
    webpackMiddleware: {
      noInfo: true
    },
    reporters,
    coverageIstanbulReporter: {
      reports: ['text-summary', 'html'],
      dir: path.resolve(__dirname, '../coverage/'),
      fixWebpackSourcePaths: true
    }
  });
};
