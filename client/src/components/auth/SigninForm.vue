<template>
  <h2 class="h1">{{ $t('views.auth.signin.title') }}</h2>
  <p>{{ $t('views.auth.signin.description') }} <router-link to="/auth/signup">{{ $t('views.auth.signin.signup') }}</router-link></p>

  <form @submit.prevent="handleSignin" class="auth-form">
    <div class="auth-form__input-wrapper">
      <input v-model="email" type="text" :placeholder="$t('views.auth.signin.form.email')" autocomplete="email" class="auth-form__input" />
      <span v-if="errors.email" class="auth-form__error">{{ $t(errors.email) }}</span>
    </div>

    <div class="auth-form__input-wrapper">
      <input v-model="password" type="password" :placeholder="$t('views.auth.signin.form.password')" autocomplete="new-password" class="auth-form__input" />
      <span v-if="errors.password" class="auth-form__error">{{ $t(errors.password) }}</span>
    </div>

    <p class="auth-form-link"><router-link to="reset">{{ $t('views.auth.signin.passwordReset') }}</router-link></p>

    <Button :loading="submitLoading" type="submit">{{ $t('views.auth.signin.form.cta') }}</Button>
  </form>

  <Toast v-if="toastMessage" :type="toastType" :message="$t(toastMessage)" :duration="5000" @close="onToastClose" />
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
  import { mapSupabaseError } from '../../utils/supabaseErrors';
  import { login } from '../../composables/useAuth';
  import { useAuthStore } from '../../stores/auth';
  import { useRouter } from 'vue-router';
  import Toast from '../ui/Toast.vue';
  import Button from '../ui/Button.vue';
  import * as yup from 'yup';

  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const errors = ref<{ email?: string; password?: string }>({});
  const toastQueue = ref<{ message: string; type: string }[]>([]);
  const toastMessage = ref<string | null>(null);
  const toastType = ref('error');
  const submitLoading = ref(false);

  const auth = useAuthStore();

  const schema = yup.object({
    email: yup.string().email('errors.invalid_email').required('errors.email_missing'),
    password: yup.string().min(6, 'errors.weak_password').required('errors.password_missing'),
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

      throw error;
    }
  };

  const handleSignin = async () => {
    submitLoading.value = true;

    try {
      await validateForm();
    } catch (error: unknown) {
      console.error('❌[handle-signup] - Validation failed:', error);
      submitLoading.value = false;
      return;
    }

    try {
      await login(email.value, password.value);
      await auth.fetchUser();
      router.push({ name: 'Wishlists' });
    } catch (error: unknown) {
      const { message, fieldErrors } = mapSupabaseError(error);
      if (fieldErrors) errors.value = { ...errors.value, ...fieldErrors };
      addToast(message, 'error');
    } finally {
      submitLoading.value = false;
    }
  }

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

  watch(email, () => {
    errors.value.email = undefined;
  });

  watch(password, () => {
    errors.value.password = undefined;
  });

  const listenToKeyPress = (event: KeyboardEvent) => {
    const keyCode = event.code;
    if (keyCode === 'Enter') handleSignin();
  }

  onMounted(() => {
    window.addEventListener('keypress', listenToKeyPress);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keypress', listenToKeyPress);
  });
</script>