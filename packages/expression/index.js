'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/expression.cjs.js');
} else {
  module.exports = require('./lib/expression.cjs.prod.js');
}
