'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/vue-ngw-ol.esm-bundler.prod.js');
} else {
  module.exports = require('./lib/vue-ngw-ol.esm-bundler.js');
}
