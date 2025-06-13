<template>
  <h2 class="h1">Enter new password</h2>

  <form @submit.prevent="handleReset" class="auth-form">
    <div class="auth-form__input-wrapper">
      <input type="text" placeholder="Email" autocomplete="email" hidden />
      <input v-model="password" type="password" placeholder="Password" autocomplete="new-password" class="auth-form__input" />
      <span v-if="errors.password" class="auth-form__error">{{ errors.password }}</span>
    </div>

    <Button :loading="submitLoading" type="submit">Reset password</Button>
  </form>

  <Toast v-if="toastMessage" :type="toastType" :message="toastMessage" :duration="5000" @close="onToastClose" />
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
  import { updateUser } from '../../composables/useAuth';
  import * as yup from 'yup';
  import Toast from '../ui/Toast.vue';
  import Button from '../ui/Button.vue';

  const password = ref('');
  const errors = ref<{ password?: string }>({});
  const toastQueue = ref<{ message: string; type: string }[]>([]);
  const toastMessage = ref<string | null>(null);
  const toastType = ref('error');
  const submitLoading = ref(false);

  const schema = yup.object({
    password: yup.string().required('Password is required'),
  });

  const validateForm = async () => {
    errors.value = {};

    try {
      await schema.validate({ password: password.value }, { abortEarly: false });
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
      await updateUser(password.value);
      addToast('Password is updated', 'info');
    } catch (error: unknown) {
      console.error('❌[handle-reset] - Failed to reset user:', error);
      addToast('Unexpected error occured, please try again later.', 'error');
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

  watch(password, () => {
    errors.value.password = undefined;
  });

  onMounted(() => {
    window.addEventListener('keypress', listenToKeyPress);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keypress', listenToKeyPress);
  });
</script>