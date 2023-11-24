import VueRouter from 'vue-router';

import ExampleOutsidePage from './ExampleOutsidePage.vue';
import MainPage from './MainPage.vue';

export const router = new VueRouter({
  mode: 'history',
  // scrollBehavior: (to, from, savedPosition) => {
  //   console.log(to.hash);
  //   if (to.hash) {
  //     return { selector: to.hash };
  //   } else {
  //     return { x: 0, y: 0 };
  //   }
  // },
  routes: [
    { path: '/page/:id', component: ExampleOutsidePage },
    { path: '/:id?', component: MainPage },
  ],
});
