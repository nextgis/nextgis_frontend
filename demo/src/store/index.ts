import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
// import createLogger from '../../../src/plugins/logger';

// Example projects
// https://github.com/vuejs/vuex/tree/dev/examples/
// Vuex and typescript
// https://github.com/utahta/vue-vuex-typescript-example

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    app,
  },
  strict: debug,
  // plugins: debug ? [createLogger()] : []
});
