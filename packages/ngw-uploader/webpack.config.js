const package = require('./package.json');
const common = require('../build-tools/lib/webpack.config');

module.exports = (env, argv) => {
  return common(env, argv, {
    library: 'NgwUploader',
    externals: true,
    dirname: __dirname,
    package,
  });
};
