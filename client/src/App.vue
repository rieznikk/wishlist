<template>
  <AppHeader />
  
  <div class="container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
  import AppHeader from './components/layout/AppHeader.vue';
</script>