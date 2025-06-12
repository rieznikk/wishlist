<template>
  <h2 class="h1">Create your account</h2>
  <p>Already have an account? <router-link to="/auth/signin">Sign in</router-link></p>

  <form @submit.prevent="handleSignup" class="auth-form">
    <div class="auth-form__input-wrapper">
      <input v-model="email" type="text" placeholder="Email" autocomplete="email" class="auth-form__input" />
      <span v-if="errors.email" class="auth-form__error">{{ errors.email }}</span>
    </div>

    <div class="auth-form__input-wrapper">
      <input v-model="password" type="password" placeholder="Password" autocomplete="new-password" class="auth-form__input" />
      <span v-if="errors.password" class="auth-form__error">{{ errors.password }}</span>
    </div>

    <button type="submit">Create account</button>
  </form>

  <Toast v-if="toastMessage" :type="toastType" :message="toastMessage" :duration="5000" @close="onToastClose" />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import * as yup from 'yup';
  import { useRouter } from 'vue-router';
  import { signup } from '../../composables/useAuth';
  import Toast from '../ui/Toast.vue';

  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const errors = ref<{ email?: string; password?: string }>({});
  const toastQueue = ref<{ message: string; type: string }[]>([]);
  const toastMessage = ref<string | null>(null);
  const toastType = ref('error');

  const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const showNextToast = () => {
    if (toastQueue.value.length > 0) {
      const next = toastQueue.value.shift()!;
      toastMessage.value = next.message;
      toastType.value = next.type;
    } else {
      toastMessage.value = null;
    }
  };

  const addToast = (message: string, type = 'error') => {
    toastQueue.value.push({ message, type });
    if (!toastMessage.value) {
      showNextToast();
    }
  };

  const validateForm = async () => {
    errors.value = {};

    try {
      await schema.validate({ email: email.value, password: password.value }, { abortEarly: false });
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((validationError) => {
          const path = validationError.path as keyof typeof errors.value;
          errors.value[path] = validationError.message;
        });
      }
    }
  };

  const handleSignup = async () => {
    try {
      await validateForm();
    } catch (error: unknown) {
      console.error('❌[handle-signup] - Validation failed:', error);
      return;
    }

    try {
      const result = await signup(email.value, password.value);
      console.log('🚔🚨result --->', result);

      if (result.user?.confirmation_sent_at) {
        addToast('A confirmation email has been sent. Please check your inbox.', 'success');
        return;
      }

      if (result.session) router.push({ name: 'Home' });
    } catch (error: unknown) {
      console.error('❌[signup] - Failed to signup user:', error);
      addToast('Unexpected error occured, please try again later.', 'error');
    }
  };

  const onToastClose = () => {
    toastMessage.value = null;
    showNextToast();
  };

  watch(email, () => {
    errors.value.email = undefined;
  });

  watch(password, () => {
    errors.value.password = undefined;
  });
</script>
