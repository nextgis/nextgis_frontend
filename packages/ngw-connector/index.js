'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/ngw-connector.cjs.js');
} else {
  module.exports = require('./lib/ngw-connector.cjs.prod.js');
}
