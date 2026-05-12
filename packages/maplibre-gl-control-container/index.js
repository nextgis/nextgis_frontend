'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/maplibre-gl-control-container.cjs.js');
} else {
  module.exports = require('./lib/maplibre-gl-control-container.cjs.prod.js');
}
