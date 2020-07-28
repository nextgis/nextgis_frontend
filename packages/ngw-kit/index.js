'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/ngw-kit.cjs.prod.js');
} else {
  module.exports = require('./lib/ngw-kit.cjs.js');
}
