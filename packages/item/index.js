'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/item.cjs.js');
} else {
  module.exports = require('./lib/item.cjs.prod.js');
}
