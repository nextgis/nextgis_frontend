'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/logging.cjs.js');
} else {
  module.exports = require('./lib/logging.cjs.prod.js');
}
