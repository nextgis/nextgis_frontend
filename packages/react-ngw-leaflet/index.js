'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/react-ngw-leaflet.esm-bundler.js');
} else {
  module.exports = require('./lib/react-ngw-leaflet.esm-bundler.prod.js');
}
