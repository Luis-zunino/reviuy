'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase';
import type { AuthProviderProps } from './types';
import { getSession } from '@/services/apis/user/getSession.api';
import { useRouter } from 'next/navigation';
import { PagesUrls } from '@/enums';
import { AppSession } from '@/services/apis/user/types';
import { sessionMapped } from '@/utils';
import { AuthContext } from './constants';

/**
 * Proveedor de autenticación para la aplicación.
 *
 * Maneja el estado de autenticación del usuario, sesiones de Supabase,
 * y proporciona funciones de login/logout a través de Context API.
 *
 * @component
 * @example
 * ```tsx
 * // En el layout raíz
 * <AuthProvider>
 *   <YourApp />
 * </AuthProvider>
 * ```
 *
 * @example
 * ```tsx
 * // Consumir en componentes hijos
 * const { signInWithGoogle, signOut } = useAuthContext();
 * ```
 *
 * @param {AuthProviderProps} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto de autenticación
 *
 * @returns {JSX.Element} Proveedor de contexto de autenticación
 *
 * @fires AuthContext - Proporciona loading, isAuthenticated, signOut, signInWithEmail, signInWithGoogle
 *
 * @see {@link useAuthContext} Hook para consumir el contexto
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<AppSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      },
    });
    setLoading(false);
    if (error) {
      throw error;
    }
  };

  const signInWithEmail = async (email: string) => {
    setLoading(true);
    const emailRedirectTo = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
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
    push(PagesUrls.HOME);
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { session } = await getSession();

      setSession(session);
      setLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      const sessionResult = sessionMapped(session);

      setSession(sessionResult);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    loading,
    isAuthenticated: !!session,
    signInWithEmail,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export * from './hooks';
