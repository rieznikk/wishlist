import { createPinia } from 'pinia'
import { createApp } from 'vue';
import { router } from './router';
import { i18n } from './i18n';

import './assets/styles/style.scss';
import App from './App.vue';

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .use(i18n)
  .mount('#app');
