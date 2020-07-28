'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/ngw-uploader.esm-bundler.prod.js');
} else {
  module.exports = require('./lib/ngw-uploader.esm-bundler.js');
}
