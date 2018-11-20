const webpack = require('webpack')
const TSLintPlugin = require('tslint-webpack-plugin');
const path = require('path');
const { getAliases } = require('./aliases');

module.exports = (env, argv, opt = {}) => {

  const library = opt.library;
  const pathToLib = opt.package.main.split('/');
  const entry = path.resolve(opt.dirname ,opt.entry || './src/index.ts');
  const useExternals = opt.externals !== undefined ? opt.externals : true;

  const filename = pathToLib.pop();
  // const entryName = './src/' + filename.replace('.js', '');
  // const entry = entryName + '.ts';
  const outDir = path.resolve(opt.dirname, pathToLib.join('/'));

  const isProd = argv.mode === 'production';

  const rules = [
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        compilerOptions: {
          paths: {}
        }
      }
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
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

  const config = {
    mode: argv.mode || 'development',

    devtool: isProd ? 'source-map' : 'inline-source-map',

    entry,

    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias
    },

    output: {
      path: outDir,
      filename,
      library,
      libraryTarget: 'umd',
      libraryExport: 'default'
    },
    module: {
      rules
    },
    plugins
  };


  if (!useExternals) {
    config.externals = [
      function (context, request, callback) {
        // Absolute & Relative paths are not externals
        if (request.match(/^(\.{0,2})\//)) {
          return callback();
        }
        try {
          // Attempt to resolve the module via Node
          require.resolve(request);
          callback(null, request);
        } catch (e) {
          // Node couldn't find it, so it must be user-aliased
          callback();
        }
      }
    ];
  }

  return [config];
}
