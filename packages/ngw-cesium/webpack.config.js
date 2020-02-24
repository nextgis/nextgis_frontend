const path = require('path');
// const webpack = require('webpack');
const package = require('./package.json');
const common = require('../../build/webpack.config');
const CopywebpackPlugin = require('copy-webpack-plugin');

const library = 'NgwCesium';

const cesiumSource = '../../node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = (env, argv) => {
  const config = common(env, argv, {
    library,
    externals: true,
    dirname: __dirname,
    package
  })[0];
  config.output.sourcePrefix = '';
  config.node = {
    // Resolve node module use of fs
    fs: 'empty',
    Buffer: false,
    http: 'empty',
    https: 'empty',
    zlib: 'empty'
  };
  config.resolve.mainFields = ['module', 'main'];

  config.optimization = {
    usedExports: true
  };

  config.plugins = config.plugins || [];
  config.plugins.push(
    new CopywebpackPlugin([
      { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }
    ])
  );
  config.plugins.push(
    new CopywebpackPlugin([
      { from: path.join(cesiumSource, 'Assets'), to: 'Assets' }
    ])
  );
  config.plugins.push(
    new CopywebpackPlugin([
      { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }
    ])
  );
  // config.plugins.push(
  //   new webpack.DefinePlugin({
  //     // Define relative base path in cesium for loading assets
  //     CESIUM_BASE_URL: JSON.stringify('')
  //   })
  // );

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
            debug: false
          }
        }
      }
    ]
  };
  config.module.rules.push(pragmaRule);
  console.log(config);
  return config;
};
