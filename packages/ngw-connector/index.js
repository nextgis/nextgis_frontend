'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/ngw-connector.cjs.prod.js');
} else {
  module.exports = require('./lib/ngw-connector.cjs.js');
}
