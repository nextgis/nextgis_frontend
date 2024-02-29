const path = require('path');

const common = require('../build-tools/lib/webpack.config');

const package = require('./package.json');

const library = 'CesiumMapAdapter';

const cesiumSource = '../../node_modules/cesium/Source';
// const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = (env, argv) => {
  const configs = common(env, argv, {
    library,
    externals: false,
    dirname: __dirname,
    package,
  });
  configs.forEach((config) => {
    config.output.sourcePrefix = '';
    // config.node = {
    //   // Resolve node module use of fs
    //   fs: 'empty',
    //   Buffer: false,
    //   http: 'empty',
    //   https: 'empty',
    //   zlib: 'empty',
    // };
    config.resolve.mainFields = ['module', 'main'];
    config.optimization = config.optimization || {};
    config.optimization.usedExports = true;
    const pragmaRule = {
      // Strip cesium pragmas
      test: /\.js$/,
      enforce: 'pre',
      include: path.resolve(__dirname, cesiumSource),
      use: [
        {
          loader: 'strip-pragma-loader',
          options: {
            pragmas: {
              debug: false,
            },
          },
        },
      ],
    };
    config.module.rules.push(pragmaRule);
  });

  // config.plugins = config.plugins || [];
  // config.plugins.push(
  //   new CopywebpackPlugin([
  //     { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }
  //   ])
  // );
  // config.plugins.push(
  //   new CopywebpackPlugin([
  //     { from: path.join(cesiumSource, 'Assets'), to: 'Assets' }
  //   ])
  // );
  // config.plugins.push(
  //   new CopywebpackPlugin([
  //     { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }
  //   ])
  // );
  // config.plugins.push(
  //   new webpack.DefinePlugin({
  //     // Define relative base path in cesium for loading assets
  //     CESIUM_BASE_URL: JSON.stringify('')
  //   })
  // );
  return configs;
};
