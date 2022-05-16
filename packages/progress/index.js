'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/progress.cjs.js');
} else {
  module.exports = require('./lib/progress.cjs.prod.js');
}
