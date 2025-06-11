import { toRefs } from 'vue'
import { defineStore } from 'pinia'
import { useWishlistState } from './state'
import { useWishlistGetters } from './getters'
import { useWishlistActions } from './actions'

export const useWishlistStore = defineStore('wishlist', () => {
  const state = useWishlistState()
  const getters = useWishlistGetters(state)
  const actions = useWishlistActions(state)

  return { ...toRefs(state), ...getters, ...actions }
});
