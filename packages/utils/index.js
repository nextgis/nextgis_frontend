'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/utils.cjs.js');
} else {
  module.exports = require('./lib/utils.cjs.prod.js');
}
