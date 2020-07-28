'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/dom.esm-bundler.prod.js');
} else {
  module.exports = require('./lib/dom.esm-bundler.js');
}
