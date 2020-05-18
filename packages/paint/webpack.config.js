// const path = require('path');
// const CopywebpackPlugin = require('copy-webpack-plugin');

const library = 'Paint';

const package = require('./package.json');
const common = require('../build-tools/lib/webpack.config');

// const makiSource = '../../node_modules/@mapbox/maki';

module.exports = (env, argv) => {
  const configs = common(env, argv, {
    library,
    package,
    libraryExport: '',
    externals: false,
    dirname: __dirname,
  });

  const config = configs[0];
  config.plugins = config.plugins || [];
  // config.plugins.push(
  //   new CopywebpackPlugin([
  //     {
  //       from: path.join(makiSource, 'icons'),
  //       to: path.join('assets', 'icons', 'maki')
  //     }
  //   ])
  // );

  return configs;
};
