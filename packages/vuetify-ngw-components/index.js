'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/vuetify-ngw-components.esm-bundler.prod.js');
} else {
  module.exports = require('./lib/vuetify-ngw-components.esm-bundler.js');
}
