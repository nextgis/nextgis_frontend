const webpack = require('webpack');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const { getAliases } = require('./aliases');

module.exports = (env, argv, opt = {}) => {
  const relativePath = path.relative(process.cwd(), opt.dirname);

  const pathToLib = opt.package.main.split('/');
  const entry = './' + path.join(relativePath, './src/index.ts');

  const filename = pathToLib.pop();
  const outDir = path.resolve(opt.dirname, pathToLib.join('/'));

  const library = opt.library;
  const libraryExport =
    opt.libraryExport !== undefined ? opt.libraryExport : 'default';

  const useExternals = opt.externals !== undefined ? opt.externals : true;

  const isProd = argv.mode === 'production';

  let externals = {};

  if (!useExternals) {
    externals = [
      function(context, request, callback) {
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
  const configFile = path.join(__dirname, '../packages/eslint-config/index.js');

  const rules = [
    {
      enforce: 'pre',
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        fix: true,
        configFile
      }
    },
    {
      test: /\.tsx?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              paths: {}
            }
          }
        }
      ],
      exclude: /node_modules/
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development')
    })
    // new BundleAnalyzerPlugin()
  ];

  let alias = {};

  if (isProd) {
    // const { BundleAnalyzerPlugin }= require('webpack-bundle-analyzer');
    plugins = plugins.concat([
      // new BundleAnalyzerPlugin()
    ]);
  } else {
    alias = getAliases();
  }

  return [
    {
      // context: opt.dirname,

      mode: argv.mode || 'development',

      devtool: isProd ? 'source-map' : 'inline-source-map',

      entry,

      externals,

      resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias
      },

      output: {
        path: outDir,
        filename,
        library,
        libraryExport,
        libraryTarget: 'umd',
        globalObject: "typeof self !== 'undefined' ? self : this" // https://github.com/webpack/webpack/issues/6522
      },
      module: {
        rules
      },
      plugins
    }
  ];
};
