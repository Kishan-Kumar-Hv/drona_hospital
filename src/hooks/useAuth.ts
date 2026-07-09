import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [localAuth, setLocalAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      const active = localStorage.getItem('local_session') === 'active';
      setLocalAuth(active);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, newSession: any) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      if (email === 'admin@dronahealthcare.in' && password === 'admin') {
        localStorage.setItem('local_session', 'active');
        setLocalAuth(true);
        return { error: null };
      }
      return { error: 'Invalid local credentials. Use admin@dronahealthcare.in / admin' };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    if (!supabase) {
      localStorage.removeItem('local_session');
      setLocalAuth(false);
      return;
    }
    await supabase.auth.signOut();
  };

  return {
    session,
    loading,
    signIn,
    signOut,
    isAuthenticated: supabase ? !!session : localAuth
  };
}
