export type FieldErrorMap = Partial<{ email: string; password: string }>;

type SupabaseError = {
  message: string;
  fieldErrors?: FieldErrorMap
};

export function mapSupabaseError(error: unknown): SupabaseError {
  const err = error as { message: string };

  const msg = err.message?.toLowerCase() || '';
  const is = (s: string) => msg.includes(s);

  console.warn('⚠️[map-supabase-error] - Received error from supabase:', msg);

  if (is('invalid login credentials')) {
    return {
      message: 'Неверный email или пароль.',
      fieldErrors: {
        email: ' ',
        password: 'Неверный email или пароль.',
      },
    };
  }

  if (is('user already registered')) {
    return {
      message: 'Пользователь с таким email уже существует.',
      fieldErrors: { email: 'Пользователь уже зарегистрирован.' },
    };
  }

  return { message: 'Произошла неизвестная ошибка.' };
}
