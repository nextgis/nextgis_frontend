'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/url-runtime-params.esm-bundler.prod.js');
} else {
  module.exports = require('./lib/url-runtime-params.esm-bundler.js');
}
