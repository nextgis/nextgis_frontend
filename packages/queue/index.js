'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/queue.cjs.js');
} else {
  module.exports = require('./lib/queue.cjs.prod.js');
}
