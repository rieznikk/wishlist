<template>
  <Button @click="handleLogout" :loading="isLoading">Logout</Button>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import Button from '../components/ui/Button.vue';
  import { logout } from '../composables/useAuth';
  import { useRouter } from 'vue-router';

  const auth = useAuthStore();
  const router = useRouter();
  const isLoading = ref(false);
  
  const handleLogout = async () => {
    isLoading.value = true;
    await logout();
    await auth.fetchUser();
    router.push({ name: 'Signin' });
  }
</script>
