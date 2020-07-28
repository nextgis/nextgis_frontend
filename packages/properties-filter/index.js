'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/properties-filter.cjs.prod.js');
} else {
  module.exports = require('./lib/properties-filter.cjs.js');
}
