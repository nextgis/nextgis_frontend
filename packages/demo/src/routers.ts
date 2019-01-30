import VueRouter from 'vue-router';
import MainPage from './MainPage.vue';
import ExamplePage from './ExamplePage.vue';

export const router = new VueRouter({
  // mode: 'history',
  routes: [
    { path: '/page/:id', component: ExamplePage },
    { path: '/:id?', component: MainPage },
  ]
});
