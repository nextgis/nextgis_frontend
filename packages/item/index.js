'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/item.cjs.prod.js');
} else {
  module.exports = require('./lib/item.cjs.js');
}
