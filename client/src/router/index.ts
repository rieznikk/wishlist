import type { NavigationGuardNext, RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import { getUser } from '../composables/useAuth';

import Home from '../views/HelloWorld.vue';
import AuthView from '../views/AuthView.vue';
import SigninForm from '../components/auth/SigninForm.vue';
import SignupForm from '../components/auth/SignupForm.vue';
import ResetPasswordForm from '../components/auth/ResetPasswordForm.vue';
import UpdatePasswordForm from '../components/auth/UpdatePasswordForm.vue';

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
      { 
        path: 'update-password', 
        name: 'UpdatePassword', 
        component: UpdatePasswordForm,
        beforeEnter: async (_to: RouteLocationNormalized, _from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) => {
          const user = await getUser();

          if (!user) {
            next({ name: 'Signin' });
            return;
          }

          next();
        }
      }
    ]
  }
];

const router = createRouter({ history: createWebHistory(), routes });
export { router };
