import { createI18n } from 'vue-i18n';

import en from './locales/en.json';
import ua from './locales/ua.json';

const userLang = localStorage.getItem('locale') || 'en';
const messages = { en, ua };

export const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'en',
  locale: userLang,
  messages
});