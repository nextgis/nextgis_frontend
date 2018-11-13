import '@babel/polyfill';
import Vue from 'vue';
import store from './store';
import {router} from './routers';
import App from './App.vue';
import VueRouter from 'vue-router';

import VueHighlightJS from 'vue-highlightjs';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(VueHighlightJS);
Vue.use(Vuetify, {
  iconfont: 'mdi'
});
Vue.use(VueRouter);

const app = new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
});

// declare global {
//   interface Window {
//     version: string;
//   }
// }

// window.version = version;
