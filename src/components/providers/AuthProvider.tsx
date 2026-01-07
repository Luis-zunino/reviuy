'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabaseClient } from '@/lib/supabase-client';
import type { AuthContextType, AuthProviderProps } from './types';
import { getSession } from '@/services/apis/user/getSession.api';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { PagesUrls } from '@/enums';

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  signOut: () => Promise.resolve(),
  signInWithEmail: () => Promise.resolve(),
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      const { session } = await getSession();

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
      process.env.NODE_ENV === 'production'
        ? 'https://reviuy.vercel.app/auth/callback'
        : 'http://localhost:3000/auth/callback';
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

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
