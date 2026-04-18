import { supabase } from '@/lib/supabase';
import type { UserProfile, SignUpInput, SignInInput, ServiceResult } from '@/types';

export async function signUp(input: SignUpInput): Promise<ServiceResult<UserProfile>> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.full_name,
          phone: input.phone ?? null,
          is_student: input.is_student ?? false,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Sign up failed — no user returned');

    const profile: UserProfile = {
      id: authData.user.id,
      email: authData.user.email!,
      full_name: input.full_name,
      phone: input.phone ?? null,
      is_student: input.is_student ?? false,
      avatar_url: null,
      created_at: authData.user.created_at,
      updated_at: authData.user.created_at,
    };

    return { data: profile, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function signIn(input: SignInInput): Promise<ServiceResult<UserProfile>> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Sign in failed — no user returned');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    return { data: profile as UserProfile, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function signOut(): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function getCurrentUser(): Promise<ServiceResult<UserProfile>> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) return { data: null, error: null };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;

    return { data: profile as UserProfile, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function signInWithProvider(provider: 'google' | 'apple'): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function resetPassword(email: string): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}
