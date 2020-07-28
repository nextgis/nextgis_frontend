'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/ngw-leaflet.esm-bundler.prod.js');
} else {
  module.exports = require('./lib/ngw-leaflet.esm-bundler.js');
}
