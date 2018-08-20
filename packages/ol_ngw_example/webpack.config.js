const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env, argv) => {

  const isProd = argv.mode === 'production';

  const config = {
    mode: 'development',

    devtool: isProd ? 'none' : 'inline-source-map',

    entry: {
      'main': [
        './src/main.ts'
      ],
    },

    output: {
      filename: '[name].js',
    },

    resolve: {
      extensions: ['.js', '.ts', '.json'],
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          enforce: 'pre',
          use: [
            {
              loader: 'tslint-loader',
              options: { fix: true }
            }
          ]
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
              }
            },
          ]
        }
      ]
    },

    plugins: [
      new ForkTsCheckerWebpackPlugin({ vue: true }),
    ]
  }

  return config;
};
