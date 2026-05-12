'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/ol-control-container.cjs.js');
} else {
  module.exports = require('./lib/ol-control-container.cjs.prod.js');
}
