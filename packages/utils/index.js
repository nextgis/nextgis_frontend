'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/utils.cjs.prod.js');
} else {
  module.exports = require('./lib/utils.cjs.js');
}
