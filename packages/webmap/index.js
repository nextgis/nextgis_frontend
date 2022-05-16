'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/webmap.cjs.js');
} else {
  module.exports = require('./lib/webmap.cjs.prod.js');
}
