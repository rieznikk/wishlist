<template>
  <div class="go-back" @click="goToPage">
    <Icon icon="hugeicons:arrow-left-02" width="28" height="28" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { Icon } from '@iconify/vue';

  const router = useRouter();
  const props = defineProps<{ page: string }>();
  const page = computed(() => props.page);
  const goToPage = () => router.push({ name: page.value });
</script>