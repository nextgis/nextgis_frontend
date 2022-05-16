'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/vuex-ngw.cjs.js');
} else {
  module.exports = require('./lib/vuex-ngw.cjs.prod.js');
}
