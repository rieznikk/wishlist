import { defineStore } from 'pinia';
import { ref } from 'vue';
import { i18n } from '../i18n';

type Locale = 'en' | 'ua';

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Locale>(getInitialLocale());

  function getInitialLocale(): Locale {
    const saved = localStorage.getItem('locale');
    if (saved === 'en' || saved === 'ua') return saved;
    return navigator.language.startsWith('uk') ? 'ua' : 'en';
  }

  function setLocale(newLocale: Locale): void {
    locale.value = newLocale;
    localStorage.setItem('locale', newLocale);
    i18n.global.locale.value = newLocale;
  }

  i18n.global.locale.value = locale.value;
  return { locale, setLocale };
});
