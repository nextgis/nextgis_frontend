const library = 'Utils';

const package = require('./package.json');
const common = require('../../build/webpack.config') ;

module.exports = (env, argv) => {
  return common(env, argv, {
    library,
    package,
    libraryExport: '',
    externals: true,
    dirname: __dirname,
  })
}
