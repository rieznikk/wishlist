import { defineStore } from 'pinia';
import { ref, computed, watchEffect } from 'vue';

type ThemeMode = 'dark' | 'light' | 'system';

export const useThemeStore = defineStore('theme', () => {
  const modes: ThemeMode[] = ['dark', 'light', 'system'];
  const icons = {
    dark: 'hugeicons:moon-02',
    light: 'hugeicons:sun-03',
    system: 'hugeicons:laptop-settings',
  };

  const mode = ref<ThemeMode>('system');

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const currentResolved = computed(() => {
    if (mode.value === 'system') {
      return prefersDark.matches ? 'dark' : 'light';
    }

    return mode.value;
  });

  const currentIcon = computed(() => icons[mode.value]);

  const applyTheme = (resolved: 'dark' | 'light') => {
    document.body.classList.toggle('dark', resolved === 'dark');
  };

  const toggle = () => {
    const index = modes.indexOf(mode.value);
    mode.value = modes[(index + 1) % modes.length];
    localStorage.setItem('theme', mode.value);
  };

  watchEffect(() => {
    applyTheme(currentResolved.value);
  });

  prefersDark.addEventListener('change', () => {
    if (mode.value === 'system') {
      applyTheme(currentResolved.value);
    }
  });

  const init = () => {
    const saved = localStorage.getItem('theme') as ThemeMode | null;
    if (saved && modes.includes(saved)) {
      mode.value = saved;
    }
    applyTheme(currentResolved.value);
  };

  return {
    mode,
    currentIcon,
    currentResolved,
    toggle,
    init,
  };
});
