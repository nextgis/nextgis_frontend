const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const generateExamples = require('./scripts/generateExamplesScheme');
const utils = require('../../build/utils');

const entry = './src/index.ts';

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
    },
    {
      test: /\.(html)$/,
      use: {
        loader: 'html-loader',
        options: {
          attrs: [':data-src']
        }
      }
    },
    {
      test: /\.(png|woff|woff2|eot|ttf)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 50000,
          name: "./fonts/[name].[ext]", // Output below ./fonts
        },
      },
    },
  ].concat(utils.styleLoaders({
    sourceMap: true,
    extract: false
  }));;

  let plugins = [

    new TSLintPlugin({
      files: ['./src/**/*.ts']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
      'process.env.EXAMPLES':  JSON.stringify(generateExamples('../'))
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      title: 'NextGIS Frontend',
      // favicon: './src/images/favicon.ico',
    }),
    new FaviconsWebpackPlugin('./src/images/logo.png'),

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
