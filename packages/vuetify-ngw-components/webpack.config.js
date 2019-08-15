const library = 'VuetifyNgwComponents';

const package = require('./package.json');
const common = require('../../build/webpack.config');

module.exports = (env, argv) => {
  return common(env, argv, {
    library,
    package,
    libraryExport: '',
    externals: false,
    dirname: __dirname
  });
};
