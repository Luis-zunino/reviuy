'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { supabaseClient } from '@/lib/supabase/client';
import type { AuthProviderProps, TermsAcceptancePayload } from './types';
import { useRouter } from 'next/navigation';
import { PagesUrls } from '@/enums';
import type { AppSession } from '@/modules/profiles/domain';
import { sessionMapped } from '@/utils/sessionMapped.util';
import { AuthContext } from './constants';
import { createGetSessionQuery } from '@/modules/profiles/application';
import { SupabaseProfileAuthReadRepository } from '@/modules/profiles/infrastructure';
import { buildSiteUrl } from '@/lib/site-url';

const profileAuthReadRepository = new SupabaseProfileAuthReadRepository();
const getSession = createGetSessionQuery({
  profileAuthReadRepository,
});

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
  const authCallbackUrl = buildSiteUrl('/auth/callback');

  const buildAuthCallbackUrl = useCallback(
    (payload?: TermsAcceptancePayload) => {
      const url = new URL(authCallbackUrl);

      if (payload?.acceptedTerms) {
        url.searchParams.set('terms_accepted', '1');
        url.searchParams.set(
          'terms_accepted_at',
          payload.termsAcceptedAt ?? new Date().toISOString()
        );
        url.searchParams.set('terms_version', payload.termsVersion ?? 'v1');
      }

      return url.toString();
    },
    [authCallbackUrl]
  );

  const signInWithGoogle = useCallback(
    async (payload?: TermsAcceptancePayload) => {
      setLoading(true);
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: buildAuthCallbackUrl(payload),
        },
      });
      setLoading(false);
      if (error) {
        throw error;
      }
    },
    [buildAuthCallbackUrl]
  );

  const signInWithEmail = useCallback(
    async (email: string, payload?: TermsAcceptancePayload) => {
      setLoading(true);
      const emailRedirectTo = buildAuthCallbackUrl(payload);
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
    },
    [buildAuthCallbackUrl]
  );

  const signOut = useCallback(async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      throw error;
    }
    Sentry.setUser(null);
    push(PagesUrls.HOME);
  }, [push]);

  useEffect(() => {
    const setSentryFromAppSession = (appSession: AppSession | null) => {
      if (appSession?.userId) {
        Sentry.setUser({ id: appSession.userId });
      } else {
        Sentry.setUser(null);
      }
    };

    const setSentryFromSupabaseSession = (
      supabaseSession: import('@supabase/supabase-js').Session | null
    ) => {
      if (supabaseSession?.user) {
        Sentry.setUser({
          id: supabaseSession.user.id,
          email: supabaseSession.user.email ?? undefined,
          username:
            supabaseSession.user.user_metadata?.full_name ?? undefined,
        });
      } else {
        Sentry.setUser(null);
      }
    };

    const getInitialSession = async () => {
      const { session } = await getSession();

      setSentryFromAppSession(session);
      setSession(session);
      setLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, supabaseSession) => {
      const sessionResult = sessionMapped(supabaseSession);

      setSentryFromSupabaseSession(supabaseSession);
      setSession(sessionResult);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(() => {
    return {
      loading,
      isAuthenticated: !!session,
      signInWithEmail,
      signOut,
      signInWithGoogle,
    };
  }, [loading, session, signInWithEmail, signOut, signInWithGoogle]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export * from './hooks';
