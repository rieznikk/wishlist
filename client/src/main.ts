import { createPinia } from 'pinia'
import { createApp } from 'vue';
import { router } from './router'

import './assets/styles/style.scss';
import App from './App.vue';

const pinia = createPinia()

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app');
