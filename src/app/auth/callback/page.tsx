'use client';

import { useEffect, useState } from 'react';
import { PagesUrls } from '@/enums';
import { Loader } from '@/components/common/Loaders';
import { toast } from 'sonner';
import { createGetSessionQuery } from '@/modules/profiles/application';
import { SupabaseProfileAuthReadRepository } from '@/modules/profiles/infrastructure';
import { supabaseClient } from '@/lib/supabase/client';
import { CURRENT_TERMS_VERSION } from '@/constants/legal-terms.constant';

const profileAuthReadRepository = new SupabaseProfileAuthReadRepository();
const getSession = createGetSessionQuery({
  profileAuthReadRepository,
});

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { session, error } = await getSession();

        if (error) {
          toast.error('Error de autenticación', {
            description: 'Hubo un problema al procesar tu autenticación. Inténtalo de nuevo.',
          });
          globalThis.location.assign(PagesUrls.LOGIN);
          return;
        }

        if (session) {
          const { data: userData, error: userError } = await supabaseClient.auth.getUser();
          if (userError) {
            throw userError;
          }

          const user = userData.user;
          const userVersion = user?.user_metadata?.terms_version;
          const hasAcceptedLatest = userVersion === CURRENT_TERMS_VERSION;

          if (hasAcceptedLatest) {
            toast.success('¡Bienvenido!', {
              description: 'Has iniciado sesión correctamente.',
            });
            globalThis.location.assign(PagesUrls.HOME);
          } else {
            // First-time login — redirect to accept terms
            globalThis.location.assign(PagesUrls.ACCEPT_TERMS);
          }
        } else {
          globalThis.location.assign(PagesUrls.LOGIN);
        }
      } catch {
        toast.error('Error inesperado', {
          description: 'Ocurrió un error inesperado durante la autenticación.',
        });
        globalThis.location.assign(PagesUrls.LOGIN);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fog dark:bg-reviuy-gray-800">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-muted-gray dark:text-reviuy-gray-400">
            Procesando tu autenticación…
          </p>
        </div>
      </div>
    );
  }

  return null;
}
