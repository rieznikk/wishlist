import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthResolved = ref(false);

  const isLoggedIn = computed(() => !!user.value);
  const userFirstName = computed(() => user.value?.user_metadata?.firstName);
  const userLastName = computed(() => user.value?.user_metadata?.lastName);
  const clearUser = () => user.value = null;
  
  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    user.value = data.user;
    isAuthResolved.value = true;
  }

  return { 
    user, 
    isLoggedIn, 
    isAuthResolved, 
    userFirstName,
    userLastName, 
    fetchUser, 
    clearUser 
  };
});