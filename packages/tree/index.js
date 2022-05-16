'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/tree.cjs.js');
} else {
  module.exports = require('./lib/tree.cjs.prod.js');
}
