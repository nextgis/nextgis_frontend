'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/leaflet-control-container.cjs.js');
} else {
  module.exports = require('./lib/leaflet-control-container.cjs.prod.js');
}
