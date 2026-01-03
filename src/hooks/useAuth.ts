'use client';

import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseClient } from '@/lib/supabase-client';
import { PagesUrls } from '@/enums';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Manejar eventos específicos
      if (event === 'SIGNED_OUT') {
        toast.success('Usuario desautenticado');
      } else if (event === 'TOKEN_REFRESHED') {
        toast.success('Token renovado');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string) => {
    setLoading(true);
    const emailRedirectTo =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/auth/callback'
        : 'https://reviuy.vercel.app/auth/callback';
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo,
      },
    });

    setLoading(false);

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      throw error;
    }
    // Redirigir al home después del logout
    redirect(PagesUrls.HOME);
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    signInWithEmail,
    signOut,
  };
};
