'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/cache.cjs.prod.js');
} else {
  module.exports = require('./lib/cache.cjs.js');
}
