<template>
  <transition name="toast-slide" @after-leave="onAfterLeave">
    <div v-if="visible" :class="['toast', `toast--${type}`]">
      <span class="toast__message">{{ message }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';

  const emit = defineEmits(['close']);
  const props = defineProps({
    type: { type: String, default: 'info' },
    message: { type: String, required: true },
    duration: { type: Number, default: 3000 },
  });

  const visible = ref(false);
  let timeoutId: number | undefined;

  const close = () => visible.value = false;
  const onAfterLeave = () => emit('close');

  onMounted(() => {
    visible.value = true;
    if (props.duration > 0) timeoutId = window.setTimeout(() => close(), props.duration);
  });

  watch(() => props.message, () => {
    visible.value = true;
    if (timeoutId) clearTimeout(timeoutId);
    if (props.duration > 0) timeoutId = window.setTimeout(() => close(), props.duration);
  });
</script>
