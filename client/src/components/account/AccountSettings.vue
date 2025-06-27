<template>
  <div class="container">
    <div class="account-settings__wrapper">
      <GoBack page="Wishlists">{{ $t('components.go_back.back_to_home') }}</GoBack>
      <h2 class="h2">{{ $t('components.account.settings.title') }}</h2>

      <div class="account-settings__tile">
        <form @submit.prevent="handleFullNameForm" class="account-settings__form-fullname">
          <h3 class="h3">{{ $t('components.account.settings.profile.title') }}</h3>

          <div class="account-settings__form-fistname">
            <span>{{ $t('components.account.settings.profile.input.first_name') }}</span>
            <input v-model="firstName" type="text" :placeholder="$t('components.account.settings.profile.input.first_name')" autocomplete="given-name" />
          </div>
          <span v-if="errors.firstName" class="account-settings__form-error">{{ $t(errors.firstName) }}</span>

          <div class="account-settings__form-lastname">
            <span>{{ $t('components.account.settings.profile.input.last_name') }}</span>
            <input v-model="lastName" type="text" :placeholder="$t('components.account.settings.profile.input.last_name')" autocomplete="family-name" />
          </div>
          <span v-if="errors.lastName" class="account-settings__form-error">{{ $t(errors.lastName) }}</span>

          <Button :loading="saveLoading" class="account-settings__form-save">{{ $t('common.save') }}</Button>
        </form>
      </div>
    </div>
  </div>

  <Toast v-if="toastMessage" :type="toastType" :message="$t(toastMessage)" :duration="5000" @close="onToastClose"/>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { updateUser } from '../../composables/useAuth';
  import { useAuthStore } from '../../stores/auth';
  import GoBack from '../ui/GoBack.vue';
  import Button from '../ui/Button.vue';
  import Toast from '../ui/Toast.vue';
  import * as yup from 'yup';

  const auth = useAuthStore();

  const firstName = ref(auth.userFirstName);
  const lastName = ref(auth.userLastName);
  const saveLoading = ref(false);
  const toastMessage = ref<string | null>('');
  const toastQueue = ref<{ message: string; type: string }[]>([]);
  const toastType = ref<string>('');
  const errors = ref<{ firstName?: string; lastName?: string }>({});
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁґҐєЄіІїЇ' -]{2,50}$/u;

  // const schema = yup.object({
  //   email: yup.string().email('errors.invalid_email').required('errors.email_missing'),
  //   password: yup.string().min(6, 'errors.weak_password').required('errors.password_missing'),
  // });

  const schema = yup.object({
    firstName: yup.string()
      .required('errors.first_name.required')
      .matches(nameRegex, 'errors.first_name.matches')
      .min(2, 'errors.first_name.min')
      .max(50, 'errors.first_name.max'),
    lastName: yup.string()
      .required('errors.last_name.required')
      .matches(nameRegex, 'errors.last_name.matches')
      .min(2, 'errors.last_name.min')
      .max(50, 'errors.last_name.max'),
  });

  const handleFullNameForm = async () => {
    saveLoading.value = true;

    try {
      await schema.validate({ firstName: firstName.value, lastName: lastName.value }, { abortEarly: false });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((validationError) => {
          const path = validationError.path as keyof typeof errors.value;
          errors.value[path] = validationError.message;
        });
      }

      saveLoading.value = false;
      return;
    }
    
    try {
      await updateUser({ metadata: { firstName: firstName.value, lastName: lastName.value }})
      addToast('components.toast.account.settings.profile_updated', 'success');
      await auth.fetchUser();
    } catch (error) {
      addToast('components.toast.account.settings.profile_not_updated', 'error');
    } finally {
      saveLoading.value = false;
    }
  };

  const onToastClose = () => {
    toastMessage.value = null;
    showNextToast();
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

  watch(firstName, () => errors.value.firstName = undefined);
  watch(lastName, () => errors.value.lastName = undefined);
</script>