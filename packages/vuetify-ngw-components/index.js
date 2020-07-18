'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/vuex-ngw.cjs.prod.js');
} else {
  module.exports = require('./lib/vuex-ngw.cjs.js');
}
