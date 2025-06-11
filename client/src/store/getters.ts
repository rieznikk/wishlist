import { computed } from 'vue'
import type { WishlistState } from './types'

export const useWishlistGetters = (state: WishlistState) => {
  const totalItems = computed(() => state.items.value.length)
  const hasItems = computed(() => state.items.value.length > 0)
  return { totalItems, hasItems }
}