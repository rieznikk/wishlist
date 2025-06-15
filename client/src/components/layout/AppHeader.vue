<template>
  <header>
    <LocaleSelector />
    <ThemeToggle />
    <!-- account (image, popup + settings + logout/signin) -->
  </header>
</template>

<script setup lang="ts">
  import ThemeToggle from '../ui/ThemeToggle.vue';
  import LocaleSelector from '../ui/LocaleSelector.vue';
</script>