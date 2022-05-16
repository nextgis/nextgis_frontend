'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/paint.cjs.js');
} else {
  module.exports = require('./lib/paint.cjs.prod.js');
}
