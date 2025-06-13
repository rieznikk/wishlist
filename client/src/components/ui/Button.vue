<template>
  <button :disabled="loading">
    <slot v-if="!loading" />
    <span v-else class="button-spinner"></span>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps({ loading: Boolean });
  const loading = computed(() => props.loading);
</script>