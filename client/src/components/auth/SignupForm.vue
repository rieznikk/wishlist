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
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import * as yup from 'yup';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const errors = ref<{ email?: string; password?: string }>({});

  const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

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
      // await userSignup(email.value, password.value);
    } catch (error: unknown) {
      console.error('❌[handle-signup] - Failed to signup user:', error);
      return;
    }

    // router.push({ name: 'Wishlist' });
  }

  watch(email, () => {
    errors.value.email = undefined;
  });

  watch(password, () => {
    errors.value.password = undefined;
  });
</script>
