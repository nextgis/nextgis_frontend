const path = require('path');
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
  config.node = { fs: 'empty' };
  config.amd = { toUrlUndefined: true };
  // config.resolve.alias.cesium = path.resolve(__dirname, cesiumSource);
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
  return config;
};
