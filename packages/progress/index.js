'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/progress.cjs.prod.js');
} else {
  module.exports = require('./lib/progress.cjs.js');
}
