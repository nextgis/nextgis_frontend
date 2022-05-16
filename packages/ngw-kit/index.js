'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/ngw-kit.cjs.js');
} else {
  module.exports = require('./lib/ngw-kit.cjs.prod.js');
}
