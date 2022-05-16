'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/properties-filter.cjs.js');
} else {
  module.exports = require('./lib/properties-filter.cjs.prod.js');
}
