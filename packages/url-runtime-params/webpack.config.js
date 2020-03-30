const package = require('./package.json');
const common = require('../build-tools/lib/webpack.config');

const library = 'UrlRuntimeParams';

module.exports = (env, argv) => {
  return common(env, argv, {
    library,
    externals: false,
    dirname: __dirname,
    package,
  });
};
