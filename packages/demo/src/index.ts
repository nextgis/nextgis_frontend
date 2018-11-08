import '@babel/polyfill';
import Vue from 'vue';
// import VueRouter from 'vue-router';
// import { sync } from 'vuex-router-sync';
import store from './store';
import {router} from './routers';
import App from './App.vue';
import VueRouter from 'vue-router';
// import { version } from '../package.json';
import VueHighlightJS from 'vue-highlightjs';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
// import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(VueHighlightJS);
Vue.use(Vuetify);
Vue.use(VueRouter);
// sync(store, router );

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
