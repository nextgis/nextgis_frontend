'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/vuetify-ngw-components.esm-bundler.js');
} else {
  module.exports = require('./lib/vuetify-ngw-components.esm-bundler.prod.js');
}
