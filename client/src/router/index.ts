import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HelloWorld.vue';
import Test from '../views/HelloTest.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: { msg: 'Vite + Vue' }
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  console.log(`Navigating from ${from.fullPath} to ${to.fullPath}`);
  next();
});

export { router };
