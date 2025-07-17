<template>
  <div v-if="wishlists.length" class="wishlists">
    <div v-for="wishlist in wishlists" class="wishlist-card">
      <div class="wishlist-card__gradient"></div>
      <h4 class="wishlist-card__title">{{ wishlist.name }}</h4>
      <p v-if="wishlist.description" class="wishlist-card__description">{{ wishlist.description }}</p>
    </div>
  </div>

  <div v-else class="wishlists-empty">
    <h2 class="wishlist-empty__heading">You don't have any of the wishlists. Let's create a new!</h2>
    <Button 
      :loading="createWishListLoading" 
      @click="createWishList" 
      class="wishlist-empty__button"
    >
      Create a wishlist
    </Button>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useWishlistsList } from '../stores/wishlists';
  import { useAuthStore } from '../stores/auth';
  import { createWishlist } from '../composables/useWishlist';
  import Button from '../components/ui/Button.vue';

  const wishlistsStore = useWishlistsList();
  const authStore = useAuthStore();

  const createWishListLoading = ref(false);
  const wishlists = computed(() => wishlistsStore.wishlists);

  const createWishList = async () => {
    createWishListLoading.value = true;
    const user = authStore.user;
    if (!user) return;

    try {
      const wishlist = await createWishlist({ name: 'Untitled', owner_id: user.id });
      
      if (wishlist?.id) {
        const router = useRouter();
        router.push({ name: 'wishlist', params: { id: wishlist.id } });
      }
    } catch (error) {
      console.error('❌[create-wishlist] - Failed to create a wishlist:', error);
    } finally {
      createWishListLoading.value = false;
    }
  }

  onMounted(async () => {
    await wishlistsStore.fetchWishlists();
  });
</script>