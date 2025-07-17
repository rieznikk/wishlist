import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getWishlists } from '../composables/useWishlist';
import type { Wishlist } from '../types/wishlists';

export const useWishlistsList = defineStore('wishlistsList', () => {
  const wishlists = ref<Array<Wishlist>>([]);

  const fetchWishlists = async () => {
    const data = await getWishlists();
    wishlists.value = data;
  }

  return {
    wishlists,
    fetchWishlists
  };
});