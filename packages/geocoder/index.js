'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/geocoder.cjs.prod.js');
} else {
  module.exports = require('./lib/geocoder.cjs.js');
}
