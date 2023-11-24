import Vue from 'vue';

// @ts-ignore
import Vuetify from 'vuetify/lib';

import type { Framework } from 'vuetify';
// import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      dark: {
        // primary: '#009688',
        // secondary: '#b0bec5',
        // accent: '#8c9eff',
        // error: '#b71c1c'
      },
    },
  },
  icons: {
    iconfont: 'mdi',
    // iconfont: 'mdiSvg'
  },
});

declare module 'vue/types/vue' {
  export interface Vue {
    $vuetify: Framework;
  }
}
