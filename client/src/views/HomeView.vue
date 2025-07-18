<template>
  <div v-if="fetchWishlistsResolved">
    <div v-if="wishlists.length" class="wishlists">
      <div v-for="wishlist in wishlists" class="wishlist-card">
        <WishListCard :wishlist="wishlist" />
      </div>
    </div>

    <div v-else class="wishlists-empty">
      <h2 class="wishlist-empty__heading">{{ $t('views.home.empty_state.title') }}</h2>
      <Button :loading="createWishListLoading" @click="createWishList" class="wishlist-empty__button">{{ $t('views.home.empty_state.cta') }}</Button>
    </div>
  </div>

  <div v-else class="wishlists">
    <VueSkeletonLoader type="chip@1" width="250px" height="182px" border-radius="8px"></VueSkeletonLoader>
    <VueSkeletonLoader type="chip@1" width="250px" height="182px" border-radius="8px"></VueSkeletonLoader>
    <VueSkeletonLoader type="chip@1" width="250px" height="182px" border-radius="8px"></VueSkeletonLoader>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useWishlistsList } from '../stores/wishlists';
  import { useAuthStore } from '../stores/auth';
  import { createWishlist } from '../composables/useWishlist';
  import WishListCard from '../components/wishlist/WishlistCard.vue';
  import Button from '../components/ui/Button.vue';
  import VueSkeletonLoader from 'vue3-skeleton-loader';
  import 'vue3-skeleton-loader/dist/style.css';

  const wishlistsStore = useWishlistsList();
  const authStore = useAuthStore();

  const createWishListLoading = ref(false);
  const wishlists = computed(() => wishlistsStore.wishlists);
  const fetchWishlistsResolved = computed(() => wishlistsStore.fetchWishlistsResolved);

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