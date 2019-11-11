const webpack = require('./webpack.config');
const path = require('path');

module.exports = config => {
  config.set({
    basePath: '../',
    browsers: ['Chrome'],
    frameworks: ['mocha'],
    reporters: ['progress'],
    files: ['test/specs/*.ts'],
    preprocessors: {
      'test/specs/*.spec.ts': ['webpack', 'sourcemap']
    },
    webpack,
    webpackMiddleware: {
      noInfo: true
    }
    // coverageIstanbulReporter: {
    //   reports: ['text-summary', 'html'],
    //   dir: path.resolve(__dirname, '../coverage/'),
    //   fixWebpackSourcePaths: true
    // }
  });
};
