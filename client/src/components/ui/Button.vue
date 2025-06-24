<template>
  <button :disabled="isDisabled">
    <span v-if="countdown > 0">{{ $t('components.button.resend_in') }} {{ countdown }}{{ $t('components.button.seconds_short') }}</span>
    <span v-else-if="loading" class="button-spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps({ loading: Boolean, countdown: Number });

  const countdown = computed(() => props.countdown ?? 0);
  const loading = computed(() => props.loading);
  const isDisabled = computed(() => loading.value || countdown.value > 0);
</script>