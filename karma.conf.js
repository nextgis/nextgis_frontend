const webpack = require('./test/webpack.config');
const path = require('path');

module.exports = config => {
  config.set({
    browsers: ['PhantomJS'],
    // frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
    frameworks: ['mocha'],
    reporters: ['spec', 'coverage-istanbul'],
    // files: ['./test/index.ts'],
    files: [
      {
        pattern: path.resolve(__dirname, './test/index.ts'),
        watched: false
      },
      {
        pattern: '**/*',
        included: false,
        watched: false
      }
    ],
    exclude: ['**/*.spec.ts'],
    preprocessors: {
      'test/index.ts': ['webpack']
    },
    // mime: {
    //   'text/x-typescript': ['ts', 'tsx']
    // },
    webpack,
    webpackMiddleware: {
      noInfo: true
    }
    // coverageIstanbulReporter: {
    //   reports: ['html', 'text-summary', 'lcovonly'],
    //   dir: path.join(__dirname, 'coverage'),
    //   fixWebpackSourcePaths: true,
    //   'report-config': {
    //     html: { outdir: 'html' }
    //   }
    // }
  });
};
