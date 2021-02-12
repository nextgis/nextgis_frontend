const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const generateExamples = require('./scripts/generateExamplesScheme');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
// const utils = require('../../build/utils');

const entry = './src/index.ts';

const ASSET_PATH = process.env.ASSET_PATH || '/';

try {
  // const Fiber = require('fibers');
  // sassLoaderOptions.fiber = Fiber;
} catch (er) {
  // ignore
}

const sassLoaderOptions = {
  implementation: require('sass'),
  // sassOptions: {
  //   fiber: require('fibers'),
  //   // indentedSyntax: true, // optional
  // },
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    esModule: false,
  },
};

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const rules = [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
    },
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/],
      },
    },
    {
      test: /\.(html)$/,
      use: {
        loader: 'html-loader',
      },
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    },
    {
      test: /\.css$/i,
      use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', cssLoader],
    },
    {
      test: /\.s(c|a)ss$/,
      use: [
        isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        cssLoader,
        {
          loader: 'sass-loader',
          options: sassLoaderOptions,
        },
      ],
    },
  ];

  let plugins = [
    new ESLintPlugin({ fix: true, files: ['src/'], extensions: ['ts'] }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
      'process.env.EXAMPLES': JSON.stringify(generateExamples()),
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
      new MiniCssExtractPlugin(),
      // new BundleAnalyzerPlugin()
    ]);
  }

  return [
    {
      mode: argv.mode || 'development',

      devtool: isProd ? 'source-map' : 'eval-source-map',

      entry,

      plugins,

      module: {
        rules,
      },

      output: {
        filename: '[name]-[hash:7].js',
        publicPath: ASSET_PATH,
      },

      resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
          vue$: 'vue/dist/vue.esm.js',
        },
      },

      devServer: {
        historyApiFallback: true,
      },

      optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          minSize: 10000,
          maxSize: 250000,
        },
      },
    },
  ];
};
