'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/ngw-map.cjs.js');
} else {
  module.exports = require('./lib/ngw-map.cjs.prod.js');
}
