'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/vue-ngw-mapbox.esm-bundler.js');
} else {
  module.exports = require('./lib/vue-ngw-mapbox.esm-bundler.prod.js');
}
