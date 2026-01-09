'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
import type { AuthContextType, AuthProviderProps } from './types';
import { getSession } from '@/services/apis/user/getSession.api';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { PagesUrls } from '@/enums';
import { AppSession } from '@/services/apis/user/types';
import { sessionMapped } from '@/utils';

const AuthContext = createContext<AuthContextType>({
  userId: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  signOut: () => Promise.resolve(),
  signInWithEmail: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [session, setSession] = useState<AppSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      const { session } = await getSession();

      setSession(session);
      setUserId(session?.userId ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      const sessionResult = sessionMapped(session);

      setSession(sessionResult);
      setUserId(session?.user?.id ?? null);
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

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo:
          process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_SITE_URL
            : 'http://localhost:3000',
      },
    });
    setLoading(false);
    if (error) {
      throw error;
    }
  };

  const signInWithEmail = async (email: string) => {
    setLoading(true);
    const emailRedirectTo =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_SITE_URL
        : 'http://localhost:3000';
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
    redirect(PagesUrls.HOME);
  };

  const value = {
    userId,
    session,
    loading,
    isAuthenticated: !!session,
    signInWithEmail,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
