<template>
  <Button class="locale-selector" @click="changeLocale">{{ localeStore.locale.toUpperCase() }}</Button>
</template>

<script setup lang="ts">
  import { useLocaleStore } from '../../stores/locale';
  import Button from './Button.vue';

  const localeStore = useLocaleStore();

  const changeLocale = () => {
    if (localeStore.locale === 'en') {
      localeStore.setLocale('ua');
    } else if (localeStore.locale === 'ua') {
      localeStore.setLocale('en');
    }
  }
</script>
