const webpack = require('webpack');

let alias = {};

const getAliases = require('../packages/build-tools/lib/aliases.cjs');
alias = { ...alias, ...getAliases() };

module.exports = (opt = { coverage: false }) => {
  const rules = [
    {
      test: /\.ts$/,
      use: [
        {
          loader: 'esbuild-loader',
          options: {
            loader: 'ts',

            tsconfig: 'tsconfig.json',
          },
        },
      ],
      exclude: [/node_modules/],
    },
    {
      test: /\.css$/,
      use: [{ loader: 'css-loader', options: { sourceMap: true } }],
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
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
      fallback: { util: require.resolve('util/') },
    },
    module: {
      rules,
    },
    stats: {
      modules: false,
      colors: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        __BROWSER__: true,
        __DEV__: true,
      }),
    ],
  };
};
