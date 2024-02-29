const path = require('path');

// const webpack = require('webpack');
const CopywebpackPlugin = require('copy-webpack-plugin');

const common = require('../build-tools/lib/webpack.config');

const package = require('./package.json');

const library = 'NgwCesium';

const cesiumSource = '../../node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = (env, argv) => {
  const configs = common(env, argv, {
    library,
    externals: true,
    dirname: __dirname,
    package,
  });
  configs.forEach((config) => {
    config.output.sourcePrefix = '';
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias.path = false;
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

  const config = configs[0];

  config.plugins = config.plugins || [];
  config.plugins.push(
    new CopywebpackPlugin({
      patterns: [
        { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
      ],
    }),
  );
  config.plugins.push(
    new CopywebpackPlugin({
      patterns: [{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }],
    }),
  );
  config.plugins.push(
    new CopywebpackPlugin({
      patterns: [{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }],
    }),
  );
  // config.plugins.push(
  //   new webpack.DefinePlugin({
  //     // Define relative base path in cesium for loading assets
  //     CESIUM_BASE_URL: JSON.stringify('')
  //   })
  // );

  return configs;
};
