const package = require('./package.json');
const common = require('../build-tools/lib/webpack.config');
const library = package.buildOptions.name;

module.exports = (env, argv) => {
  return common(env, argv, {
    library,
    package,
    libraryExport: '',
    externals: true,
    dirname: __dirname,
  });
};
