const library = 'ControlContainer';

const package = require('./package.json');
const common = require('../build-tools/lib/webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const configs = common(env, argv, {
    library,
    package,
    externals: false,
    dirname: __dirname,
  });

  const x = configs[0];
  x.plugins = x.plugins || [];
  x.plugins.push(
    new MiniCssExtractPlugin({
      filename: x.output.filename.replace(/.js$/, '.css'), // '[name].css',
    })
  );
  const rules = x.module && x.module.rules;
  const cssRule = rules.find((x) => {
    if (x && x.test) {
      return String(x.test).indexOf('.css') !== -1;
    }
  });
  if (cssRule) {
    cssRule.use = [MiniCssExtractPlugin.loader, 'css-loader'];
  } else {
    rules.push({
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    });
  }

  return configs;
};
