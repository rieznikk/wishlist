<template>
  <div class="wishlist-card__gradient" :style="{ background: gradient }" />
  <h4 class="wishlist-card__title">{{ name }}</h4>
  <p v-if="description" class="wishlist-card__description">{{ description }}</p>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useThemeStore } from '../../stores/theme';
  import type { Wishlist } from '../../types/wishlists';

  const themeStore = useThemeStore();
  const props = defineProps<{ wishlist: Wishlist }>();
  
  const name = computed(() => props.wishlist.name);
  const description = computed(() => props.wishlist?.description);
  const gradient = computed(() => generateGradientFromUUID(props.wishlist.id, themeStore.currentResolved));

  function generateGradientFromUUID(uuid: string, theme: 'light' | 'dark'): string {
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
      hash = uuid.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // 32-bit int
    }

    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 45) % 360;
    const hue3 = (hue1 + 90) % 360;

    const saturation = theme === 'dark' ? 50 : 70;
    const lightnessBase = theme === 'dark' ? 45 : 70;

    return `linear-gradient(135deg, 
      hsl(${hue1}, ${saturation}%, ${lightnessBase}%),
      hsl(${hue2}, ${saturation}%, ${lightnessBase + 5}%),
      hsl(${hue3}, ${saturation}%, ${lightnessBase + 10}%)
    )`;
  }
</script>
