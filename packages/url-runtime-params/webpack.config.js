const package = require('./package.json');
const common = require('../../build/webpack.config') ;

const library = 'UrlRuntimeParams'

module.exports = (env, argv) => {
  return common(env, argv, {
    library,
    externals: false,
    dirname: __dirname,
    package
  })
}
