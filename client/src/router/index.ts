import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HelloWorld.vue';
import AuthView from '../views/AuthView.vue';
import SigninForm from '../components/auth/SigninForm.vue';
import SignupForm from '../components/auth/SignupForm.vue';
import ResetPasswordForm from '../components/auth/ResetPasswordForm.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: { msg: 'Vite + Vue' }
  },
  {
    path: '/auth',
    component: AuthView,
    children: [
      { path: 'signin', name: 'Signin', component: SigninForm },
      { path: 'signup', name: 'Signup', component: SignupForm },
      { path: 'reset', name: 'Reset', component: ResetPasswordForm },
    ]
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
