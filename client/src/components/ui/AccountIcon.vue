<template>
  <div class="account-icon" ref="accountIconRef">
    <button class="avatar" @click="togglePopover">
      <img v-if="userPhoto" :src="userPhoto" alt="User photo" />
      <span v-else>{{ userInitial }}</span>
    </button>

    <div v-if="popoverVisible" class="popover">
      <ul>
        <li><button @click="goToSettings">{{ $t('components.account_icon.settings') }}</button></li>
        <li><button @click="handleLogout">{{ $t('components.account_icon.logout') }}</button></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../../stores/auth';
  import { logout } from '../../composables/useAuth';

  const auth = useAuthStore();
  const router = useRouter();

  const userPhoto: string | null = null;
  const popoverVisible = ref(false);
  const accountIconRef = ref<HTMLElement | null>(null);

  const userEmail = computed(() => auth.user?.email);
  const userFirstName = computed(() => auth?.userFirstName);
  const userLastName = computed(() => auth?.userLastName);

  const userInitial = computed(() => {
    const first = userFirstName.value?.charAt(0)?.toUpperCase() ?? '';
    const last = userLastName.value?.charAt(0)?.toUpperCase() ?? '';

    if (first || last) {
      return `${first}${last}`;
    }

    return userEmail.value?.charAt(0)?.toUpperCase() ?? '';
  });

  const togglePopover = () => popoverVisible.value = !popoverVisible.value;
  const goToSettings = () => router.push({ name: 'AccountSettings' });

  const handleLogout = async () => {
    await logout();
    await auth.fetchUser();
    router.push({ name: 'Signin' });
  };

  const handleClickOutside = (event: MouseEvent) => {
    const el = accountIconRef.value;
    if (el && !el.contains(event.target as Node)) {
      popoverVisible.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>
