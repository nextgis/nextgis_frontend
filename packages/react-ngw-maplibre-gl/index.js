'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/react-ngw-maplibre-gl.esm-bundler.js');
} else {
  module.exports = require('./lib/react-ngw-maplibre-gl.esm-bundler.prod.js');
}
