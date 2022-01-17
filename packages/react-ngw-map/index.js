'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/react-ngw-map.esm-bundler.prod.js');
} else {
  module.exports = require('./lib/react-ngw-map.esm-bundler.js');
}
