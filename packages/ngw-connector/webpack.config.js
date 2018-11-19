const webpack = require('webpack')
const TSLintPlugin = require('tslint-webpack-plugin');
const package = require('./package.json');
const path = require('path');

const entry = './src/index.ts';
const library = 'NgwConnector';

module.exports = (env, argv) => {

  const isProd = argv.mode === 'production';

  const rules = [
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    }
  ];

  let plugins = [

    new TSLintPlugin({
      files: ['./src/**/*.ts']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development')
    })
  ];

  if (isProd) {
    plugins = plugins.concat([
      // new BundleAnalyzerPlugin()
    ])
  }

  const pathToLib = package.main.split('/');
  const filename = pathToLib.pop();

  return [{
    mode: argv.mode || 'development',

    devtool: isProd ? 'source-map' : 'inline-source-map',

    entry: entry,

    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },

    output: {
      path: path.resolve(__dirname, pathToLib.join('/')),
      filename,
      library,
      libraryTarget: 'umd',
      libraryExport: 'default'
    },
    module: {
      rules
    },
    plugins
  }]
}
