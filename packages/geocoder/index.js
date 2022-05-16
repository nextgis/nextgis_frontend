'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/geocoder.cjs.js');
} else {
  module.exports = require('./lib/geocoder.cjs.prod.js');
}
