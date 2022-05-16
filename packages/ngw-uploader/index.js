'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/ngw-uploader.cjs.js');
} else {
  module.exports = require('./lib/ngw-uploader.cjs.prod.js');
}
