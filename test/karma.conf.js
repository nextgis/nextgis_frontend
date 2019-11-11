const webpack = require('./webpack.config');
const path = require('path');

module.exports = config => {
  config.set({
    basePath: '../',
    browsers: ['Chrome'],
    frameworks: ['mocha'],
    files: ['test/specs/*.ts'],
    preprocessors: {
      'test/specs/*.spec.ts': ['webpack', 'sourcemap']
    },
    webpack,
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['dots', 'coverage-istanbul'],
    coverageIstanbulReporter: {
      reports: ['text-summary', 'html'],
      dir: path.resolve(__dirname, '../coverage/'),
      fixWebpackSourcePaths: true
    }
  });
};
