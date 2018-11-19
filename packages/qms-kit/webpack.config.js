const webpack = require('webpack')
const TSLintPlugin = require('tslint-webpack-plugin');
const package = require('./package.json');
const path = require('path');
const { getAliases } = require('../../build/aliases');

const library = 'WebMap';

const pathToLib = package.main.split('/');
const filename = pathToLib.pop();
// const entry = './src/' + filename.replace('js', '') + 'ts';
const entry = './src/index.ts';

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

  let alias = {};

  if (isProd) {
    plugins = plugins.concat([
      // new BundleAnalyzerPlugin()
    ])
  } else {
    alias = getAliases()
  }

  return [{
    mode: argv.mode || 'development',

    devtool: isProd ? 'source-map' : 'inline-source-map',

    entry: entry,

    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias
    },

    externals: [
      function (context, request, callback) {
        // Absolute & Relative paths are not externals
        if (request.match(/^(\.{0,2})\//)) {
          return callback();
        }
        try {
          // Attempt to resolve the module via Node
          require.resolve(request);
          callback(null, request);
        } catch(e) {
          // Node couldn't find it, so it must be user-aliased
          callback();
        }
      }
    ],

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
