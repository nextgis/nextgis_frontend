import VueRouter from 'vue-router';
import App from './App.vue';

export const router = new VueRouter({
  routes: [
    { path: '/:id', component: App }
  ]
});
