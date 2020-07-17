'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/paint.cjs.prod.js');
} else {
  module.exports = require('./lib/paint.cjs.js');
}
