import type { WishlistState } from './types';

export const useWishlistActions = (state: WishlistState) => {
  function addItem(item: string) {
    if (!state.items.value.includes(item)) {
      state.items.value.push(item)
    }
  }

  function removeItem(item: string) {
    state.items.value = state.items.value.filter(i => i !== item)
  }

  function clearWishlist() {
    state.items.value = []
  }

  return { addItem, removeItem, clearWishlist }
}
