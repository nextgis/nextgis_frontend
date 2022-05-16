'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/qms-kit.cjs.js');
} else {
  module.exports = require('./lib/qms-kit.cjs.prod.js');
}
