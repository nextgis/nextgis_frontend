'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/cancelable-promise.cjs.js');
} else {
  module.exports = require('./lib/cancelable-promise.cjs.prod.js');
}
