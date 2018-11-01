const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const utils = require('../../build/utils');
const package = require('./package.json');
const path = require('path');

const entry = './src/index.ts';
const library = 'NgwUploader';

module.exports = (env, argv) => {

  const isProd = argv.mode === 'production';

  const rules = [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: utils.cssLoaders({
          sourceMap: isProd ? false : true,
          extract: false
        })
      }
    },
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/],
      }
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]'
      }
    }
  ].concat(utils.styleLoaders({
    sourceMap: true,
    extract: false
  }));;

  let plugins = [

    new TSLintPlugin({
      files: ['./src/**/*.ts']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development')
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html'
    }),

    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
  ];

  if (isProd) {
    plugins = plugins.concat([
      // new CompressionPlugin({
      //   test: /\.js(\?.*)?$/i
      // }),
      // new BundleAnalyzerPlugin()
    ])
  }

  return [{
    mode: argv.mode || 'development',

    devtool: isProd ? '#source-map' : 'eval-source-map',

    entry,

    plugins,

    module: {
      rules
    },

    output: {
      filename: '[name]-[hash:7].js'
    },

    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    devServer: {
      contentBase: './dist',
      historyApiFallback: true,
      noInfo: true
    },
    performance: {
      hints: false
    },

    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
  }]
}
