const package = require('./package.json');
const common = require('../../build/webpack.config') ;

module.exports = (env, argv) => {
  return common(env, argv, {
    library: 'WebMap',
    externals: false,
    dirname: __dirname,
    package
  })
}
