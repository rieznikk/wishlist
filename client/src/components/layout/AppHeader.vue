<template>
  <header>
    <AccountIcon v-if="isLoggedIn" />
    <LocaleSelector />
    <ThemeToggle />
  </header>
</template>

<script setup lang="ts">
  import ThemeToggle from '../ui/ThemeToggle.vue';
  import LocaleSelector from '../ui/LocaleSelector.vue';
  import AccountIcon from '../ui/AccountIcon.vue';
  import { useAuthStore } from '../../stores/auth';
  import { computed } from 'vue';

  const auth = useAuthStore();
  const isLoggedIn = computed(() => auth.isLoggedIn);
</script>