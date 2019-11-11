// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// let HtmlWebpackPlugin = require('html-webpack-plugin');
// let FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const path = require('path');

let alias = {};
try {
  const { getAliases } = require('../build/aliases');
  alias = getAliases();
} catch (er) {
  // ignore
}

// const include = [
//   path.resolve('packages/webmap/src/'),
//   path.resolve('packages/utils/src/'),
//   path.resolve('test/specs/')
// ];

module.exports = {
  mode: 'development',

  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ],
        exclude: [/node_modules/]
        // include
      },
      // {
      //   test: /\.ts$/,
      //   exclude: [path.resolve(__dirname, 'test')],
      //   enforce: 'post',
      //   use: {
      //     loader: 'istanbul-instrumenter-loader',
      //     options: { esModules: true }
      //   }
      // },
      {
        test: /\.css$/,
        use: [{ loader: 'css-loader', options: { sourceMap: true } }]
      }
    ]
  }
};
