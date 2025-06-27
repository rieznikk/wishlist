import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/auth';

type UpdateUserParams = {
  password?: string;
  metadata?: Record<string, any>;
};

export function useAuth() {
  const auth = useAuthStore();

  const init = async () => {
    await auth.fetchUser();

    supabase.auth.onAuthStateChange((_event, session) => {
      auth.user = session?.user ?? null;
    });
  };

  return { ...auth, init };
}

export async function signup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  return data;
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  return data;
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function getUser() {
  const { data: { user }} = await supabase.auth.getUser();
  return user;
}

export async function updateUser({ password, metadata }: UpdateUserParams) {
  const updatePayload: {
    password?: string;
    data?: Record<string, any>;
  } = {};

  if (password) updatePayload.password = password;
  if (metadata) updatePayload.data = metadata;

  const { data, error } = await supabase.auth.updateUser(updatePayload);
  if (error) throw new Error(error.message);

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}