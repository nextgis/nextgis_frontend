const path = require('path');
const webpack = require('webpack');

let alias = {};
try {
  const { getAliases } = require('../scripts/aliases');
  alias = getAliases();
} catch (er) {
  // ignore
}

module.exports = (opt = { coverage: false }) => {
  const rules = [
    {
      test: /\.ts$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            // configFile: 'tsconfig.json',
          },
        },
      ],
      exclude: [/node_modules/],
      // include
    },
    {
      test: /\.css$/,
      use: [{ loader: 'css-loader', options: { sourceMap: true } }],
    },
    {
      test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      use: 'base64-inline-loader?limit=1000&name=[name].[ext]',
    },
  ];
  if (opt.coverage) {
    rules.push({
      test: /\.ts$/,
      exclude: [/node_modules/],
      enforce: 'post',
      use: {
        loader: 'istanbul-instrumenter-loader',
        options: { esModules: true },
      },
    });
  }
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.js', '.ts', '.json'],
      alias,
      // modules: ['node_modules'],
    },
    module: {
      rules,
    },
    plugins: [
      new webpack.DefinePlugin({
        __BROWSER__: true,
      }),
    ],
  };
};
