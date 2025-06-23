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
      message: 'errors.invalid_credentials',
      fieldErrors: {
        email: ' ',
        password: 'errors.invalid_credentials',
      },
    };
  }

  if (is('user already registered')) {
    return {
      message: 'errors.user_exists',
      fieldErrors: { email: 'errors.email_taken' },
    };
  }

  return { message: 'errors.unknown' };
}
