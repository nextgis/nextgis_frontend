const library = 'CesiumMapAdapter';
const package = require('./package.json');
const common = require('../../build/webpack.config');

module.exports = (env, argv) => {
  const config = common(env, argv, {
    library,
    externals: false,
    dirname: __dirname,
    package
  })[0];

  return config;
};
