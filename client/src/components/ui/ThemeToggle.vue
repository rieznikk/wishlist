<template>
  <Button @click="theme.toggle" class="theme-toggle">
    <transition name="fade-icon" mode="out-in">
      <Icon :icon="theme.currentIcon" :key="theme.currentIcon" width="28" height="28" />
    </transition>
  </Button>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useThemeStore } from '../../stores/theme';
  import { Icon } from '@iconify/vue';
  import Button from './Button.vue';
  
  const theme = useThemeStore();
  onMounted(() => theme.init());
</script>

<style scoped>
  .fade-icon-enter-active,
  .fade-icon-leave-active {
    transition: opacity 0.1s ease;
  }
  
  .fade-icon-enter-from,
  .fade-icon-leave-to {
    opacity: 0;
  }
</style>