import 'core-js';
import Vue from 'vue';
import VueHighlightJS from 'vue-highlightjs';
import VueRouter from 'vue-router';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import { router } from './routers';
import store from './store';
import '@mdi/font/css/materialdesignicons.css';
import 'highlight.js/styles/default.css';
import 'highlight.js/lib/languages/javascript';

Vue.use(VueHighlightJS);

Vue.use(VueRouter);

const app = new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
  methods: {
    goTo(elementId: string, options?: any) {
      // @ts-ignore
      this.$vuetify.goTo('#' + elementId.replace('#', ''), options);
      window.location.hash = elementId;
    },

    updateLinks(element: Element) {
      const links = element.getElementsByTagName('a');
      for (let fry = 0; fry < links.length; fry++) {
        const link = links[fry];
        link.onclick = (e) => {
          e.preventDefault();
          this._onLinkClick(element, link);
        };
      }
    },

    _onLinkClick(element: Element, link: HTMLAnchorElement) {
      const returnEvent = () => {
        if (link.href) {
          window.open(link.href, link.target);
        }
      };
      const href = link.href.replace(document.location.origin, '');
      const match = href.match(/^\/?([a-zA-Z-]+)(#([a-zA-Z]+))?$/);
      if (match) {
        const module = match[1];
        const name = match[3];
        if (name) {
          element = document.getElementById(name);
          if (element) {
            this.goTo(name);
          } else {
            this.$router.push(`${module}#${name}`);
          }
        } else if (module) {
          this.$router.push(`${module}`);
        } else {
          returnEvent();
        }
      } else {
        returnEvent();
      }
    },
  },
});
app.$mount('#app');

// declare global {
//   interface Window {
//     version: string;
//   }
// }

// window.version = version;
