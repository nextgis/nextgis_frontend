'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/webmap.cjs.prod.js');
} else {
  module.exports = require('./lib/webmap.cjs.js');
}
