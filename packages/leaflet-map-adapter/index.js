'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/leaflet-map-adapter.esm-bundler.prod.js');
} else {
  module.exports = require('./lib/leaflet-map-adapter.esm-bundler.js');
}
