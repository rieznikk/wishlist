<template>
  <h2 class="h1">Password reset</h2>

  <form @submit.prevent="handleReset" class="auth-form">
    <div class="auth-form__input-wrapper">
      <input v-model="email" type="text" placeholder="Email" autocomplete="email" class="auth-form__input" />
      <span v-if="errors.email" class="auth-form__error">{{ errors.email }}</span>
    </div>

    <Button :loading="submitLoading" :countdown="countdown" type="submit">Send email</Button>
  </form>

  <Toast v-if="toastMessage" :type="toastType" :message="toastMessage" :duration="5000" @close="onToastClose" />
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
  import { mapSupabaseError } from '../../utils/supabaseErrors';
  import { useCountdown } from '../../composables/useCountdown';
  import { resetPassword } from '../../composables/useAuth';
  import Button from '../ui/Button.vue';
  import Toast from '../ui/Toast.vue';
  import * as yup from 'yup';

  const email = ref('');
  const errors = ref<{ email?: string }>({});
  const toastQueue = ref<{ message: string; type: string }[]>([]);
  const toastMessage = ref<string | null>(null);
  const toastType = ref('error');
  const submitLoading = ref(false);
  const { countdown, start } = useCountdown(60);

  const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required')
  });

  const validateForm = async () => {
    errors.value = {};

    try {
      await schema.validate({ email: email.value }, { abortEarly: false });
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((validationError) => {
          const path = validationError.path as keyof typeof errors.value;
          errors.value[path] = validationError.message;
        });
      }

      throw error;
    }
  };

  const handleReset = async () => {
    submitLoading.value = true;

    try {
      await validateForm();
    } catch (error: unknown) {
      console.error('❌[handle-reset] - Validation failed:', error);
      submitLoading.value = false;
      return;
    }

    try {
      await resetPassword(email.value);
      setTimeout(() => start(), 1000);
      addToast('Please check your email for confirmation list', 'info');
    } catch (error: unknown) {
      const { message, fieldErrors } = mapSupabaseError(error);
      if (fieldErrors) errors.value = { ...errors.value, ...fieldErrors };
      addToast(message, 'error');
    } finally {
      submitLoading.value = false;
    }
  };

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

  const onToastClose = () => {
    toastMessage.value = null;
    showNextToast();
  };

  const listenToKeyPress = (event: KeyboardEvent) => {
    const keyCode = event.code;
    if (keyCode === 'Enter') handleReset();
  };

  watch(email, () => {
    errors.value.email = undefined;
  });

  onMounted(() => {
    window.addEventListener('keypress', listenToKeyPress);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keypress', listenToKeyPress);
  });
</script>