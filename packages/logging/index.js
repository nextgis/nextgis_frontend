'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/logging.cjs.prod.js');
} else {
  module.exports = require('./lib/logging.cjs.js');
}
