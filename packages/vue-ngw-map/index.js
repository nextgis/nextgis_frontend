'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/vue-ngw-map.esm-bundler.js');
} else {
  module.exports = require('./lib/vue-ngw-map.esm-bundler.prod.js');
}
