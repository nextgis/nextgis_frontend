const webpack = require('./test/webpack.config');
const path = require('path');

module.exports = config => {
  config.set({
    browsers: ['Chrome'],
    // frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
    frameworks: ['mocha'],
    reporters: ['dots', 'coverage-istanbul'],
    // files: ['./test/index.ts'],
    files: [
      {
        pattern: path.resolve(__dirname, './test/index.ts'),
        watched: false
      },
      // {
      //   pattern: path.resolve(__dirname, './test/helpers/'),
      //   watched: false
      // },
      {
        pattern: '**/*',
        included: false,
        watched: false
      }
    ],
    exclude: ['**/*.spec.ts'],
    preprocessors: {
      'test/index.ts': ['webpack', 'sourcemap']
    },
    // mime: {
    //   'text/x-typescript': ['ts', 'tsx']
    // },
    webpack,
    webpackMiddleware: {
      noInfo: true
    },
    coverageIstanbulReporter: {
      reports: ['text-summary', 'html'],
      dir: path.resolve(__dirname, '../coverage/'),
      fixWebpackSourcePaths: true
    }
  });
};
