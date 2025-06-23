import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import Home from '../views/HomeView.vue';
import AuthView from '../views/AuthView.vue';
import SigninForm from '../components/auth/SigninForm.vue';
import SignupForm from '../components/auth/SignupForm.vue';
import ResetPasswordForm from '../components/auth/ResetPasswordForm.vue';
import UpdatePasswordForm from '../components/auth/UpdatePasswordForm.vue';

const routes = [
  {
    path: '/auth',
    component: AuthView,
    children: [
      { path: '', redirect: { name: 'Signin' }},
      { path: 'signin', name: 'Signin', component: SigninForm, meta: { requiresGuest: true }},
      { path: 'signup', name: 'Signup', component: SignupForm, meta: { requiresGuest: true }},
      { path: 'reset', name: 'Reset', component: ResetPasswordForm, meta: { requiresGuest: true }},
      { path: 'update-password', name: 'UpdatePassword', component: UpdatePasswordForm, meta: { requiresAuth: true }}
    ]
  },
  {
    path: '/',
    redirect: { name: 'Wishlists' },
    children: [
      { path: 'wishlists', name: 'Wishlists', component: Home }
    ],
    meta: { requiresAuth: true }
  }
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore();
  if (!auth.isAuthResolved) await auth.fetchUser();
  const isLoggedIn = auth.isLoggedIn;

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'Signin' });
  }

  if (to.meta.requiresGuest && isLoggedIn) {
    return next({ name: 'Wishlists' });
  }
  
  next();
});

export { router };
