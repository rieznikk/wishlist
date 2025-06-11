import { ref } from 'vue'

export const useWishlistState = () => {
  const items = ref<string[]>([])
  return { items }
}