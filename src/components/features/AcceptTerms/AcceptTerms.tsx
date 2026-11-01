'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { PagesUrls } from '@/enums';
import {
  LEGAL_TERMS_TEXT,
  LEGAL_TERMS_SECTIONS,
} from '@/constants/legal-terms.constant';
import { toast } from 'sonner';
import { Loader } from '@/components/common/Loaders';
import { hasAcceptedCurrentTerms } from '@/shared/auth/terms.util';
import { acceptTermsAction } from '@/modules/profiles/presentation';

export const AcceptTerms = () => {
  const { loading: authLoading, isAuthenticated } = useAuthContext();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const termsContainerRef = useRef<HTMLDivElement>(null);

  // Guard: if not authenticated, redirect to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      globalThis.location.assign(PagesUrls.LOGIN);
    }
  }, [authLoading, isAuthenticated]);

  // Guard: if user already accepted terms, redirect to home
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: userData } = await supabaseClient.auth.getUser();
        const user = userData?.user;

        // Misma regla que el middleware y el callback: si acá se mirara solo
        // terms_accepted_at, un usuario con versión vieja quedaría en loop.
        if (hasAcceptedCurrentTerms(user)) {
          globalThis.location.assign(PagesUrls.HOME);
          return;
        }
      } catch {
        // If we can't check, let the user see the page
      } finally {
        setCheckingUser(false);
      }
    };

    checkUser();
  }, []);

  // IntersectionObserver to detect scroll to bottom
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasScrolledToBottom(true);
        }
      },
      {
        root: termsContainerRef.current,
        threshold: 1.0,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [checkingUser]);

  const handleAccept = useCallback(async () => {
    setAccepting(true);
    try {
      // La firma del consentimiento se guarda server-side en app_metadata
      // (acceptTermsAction): firmar en user_metadata desde el cliente permite
      // auto-aceptar por consola, y user_metadata se sigue aceptando solo como
      // fallback legacy en hasAcceptedCurrentTerms.
      await acceptTermsAction();

      // El JWT no se reemite solo: sin refrescar, el middleware (que lee los
      // claims con app_metadata) volvería a pedir aceptar.
      const { error: refreshError } = await supabaseClient.auth.refreshSession();

      if (refreshError) {
        throw refreshError;
      }

      globalThis.location.assign(PagesUrls.HOME);
    } catch {
      toast.error('Error al aceptar términos', {
        description: 'Hubo un problema al guardar tu aceptación. Inténtalo de nuevo.',
        duration: 4000,
      });
    } finally {
      setAccepting(false);
    }
  }, []);

  if (authLoading || checkingUser) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader message="Verificando..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-ink dark:text-reviuy-gray-100">
          Aceptar Términos y Condiciones
        </h1>
        <p className="text-sm text-muted-gray dark:text-reviuy-gray-400">
          Para continuar usando ReviUy, necesitás leer y aceptar nuestros términos.
        </p>
      </div>

      {/* Summary */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-ink dark:text-reviuy-gray-100 uppercase tracking-wide">
          Resumen
        </h2>
        <ul className="space-y-2">
          {LEGAL_TERMS_SECTIONS.map((section) => (
            <li
              key={section.title}
              className="flex items-start gap-2 text-sm text-muted-gray dark:text-reviuy-gray-400"
            >
              <span className="mt-1.5 size-1.5 rounded-full bg-ink dark:bg-reviuy-gray-100 shrink-0" />
              <span>
                <strong className="text-ink dark:text-reviuy-gray-100">{section.title}:</strong>{' '}
                {section.description}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-reviuy-gray-200 dark:border-reviuy-gray-700" />

      {/* Full terms text */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-ink dark:text-reviuy-gray-100 uppercase tracking-wide">
          Términos completos
        </h2>
        <div
          ref={termsContainerRef}
          className="max-h-80 overflow-y-auto rounded-lg border border-reviuy-gray-200 dark:border-reviuy-gray-700 bg-fog/50 dark:bg-reviuy-gray-900/50 p-4 text-sm text-muted-gray dark:text-reviuy-gray-400 whitespace-pre-line leading-relaxed scrollbar-thin"
        >
          {LEGAL_TERMS_TEXT}
          <div ref={sentinelRef} className="h-1" />
        </div>
        {!hasScrolledToBottom && (
          <p className="text-xs text-muted-gray dark:text-reviuy-gray-400">
            Desplazate hasta el final para habilitar la aceptación.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleAccept}
        disabled={!hasScrolledToBottom || accepting}
        className="w-full rounded-xl bg-ink text-canvas-white dark:bg-reviuy-gray-100 dark:text-ink py-3 px-6 text-sm font-medium transition-opacity duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
      >
        {accepting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full size-4 border-b-2 border-current" />
            Aceptando…
          </span>
        ) : (
          'Aceptar y continuar'
        )}
      </button>
    </div>
  );
};
