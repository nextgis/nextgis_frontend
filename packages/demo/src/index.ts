import Vue from 'vue';
// import VueRouter from 'vue-router';
// import { router } from './routes';
import store from './store';
import App from './App.vue';
// import { version } from '../package.json';
import VueHighlightJS from 'vue-highlightjs';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
// import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(VueHighlightJS);
Vue.use(Vuetify);
// Vue.use(VueRouter);

const app = new Vue({
  el: '#app',
  // router,
  store,
  render: (h) => h(App),
});

// declare global {
//   interface Window {
//     version: string;
//   }
// }

// window.version = version;
