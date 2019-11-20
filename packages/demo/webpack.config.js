const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const generateExamples = require('./scripts/generateExamplesScheme');
// const utils = require('../../build/utils');

const entry = './src/index.ts';

const ASSET_PATH = process.env.ASSET_PATH || '/';

const sassLoaderOptions = {
  implementation: require('sass')
  // indentedSyntax: true // optional
};

try {
  // const Fiber = require('fibers');
  // sassLoaderOptions.fiber = Fiber;
} catch (er) {
  // ignore
}

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const rules = [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      enforce: 'pre',
      test: /\.(t|j)sx?$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
      options: {
        fix: true
      }
    },
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/]
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
        loader: 'url-loader',
        options: {
          limit: 50000,
          name: './fonts/[name].[ext]' // Output below ./fonts
        }
      }
    },
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.s(c|a)ss$/,
      use: [
        'vue-style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: sassLoaderOptions
        }
      ]
    }
  ];

  let plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
      'process.env.EXAMPLES': JSON.stringify(generateExamples('../'))
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      title: 'NextGIS Frontend'
      // favicon: './src/images/favicon.ico',
    }),
    new FaviconsWebpackPlugin('./src/images/logo.png'),

    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin()
  ];

  if (isProd) {
    plugins = plugins.concat([
      // new BundleAnalyzerPlugin()
    ]);
  }

  return [
    {
      mode: argv.mode || 'development',

      devtool: isProd ? '#source-map' : 'eval-source-map',

      entry,

      plugins,

      module: {
        rules
      },

      output: {
        filename: '[name]-[hash:7].js',
        publicPath: ASSET_PATH
      },

      resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
          vue$: 'vue/dist/vue.esm.js'
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
          minSize: 10000,
          maxSize: 250000
        }
      }
    }
  ];
};
