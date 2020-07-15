'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/items.cjs.prod.js');
} else {
  module.exports = require('./lib/items.cjs.js');
}
