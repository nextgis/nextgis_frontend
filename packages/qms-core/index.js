'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/qms-core.cjs.js');
} else {
  module.exports = require('./lib/qms-core.cjs.prod.js');
}
