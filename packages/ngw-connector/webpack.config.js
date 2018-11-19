const library = 'NgwConnector';

const package = require('./package.json');
const common = require('../../build/webpack.config') ;

module.exports = (env, argv) => {
  return common(env, argv, {
    library,
    package,
    externals: true,
    dirname: __dirname,
  })
}
