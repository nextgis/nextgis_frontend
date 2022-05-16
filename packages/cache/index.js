'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/cache.cjs.js');
} else {
  module.exports = require('./lib/cache.cjs.prod.js');
}
