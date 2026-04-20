'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PagesUrls } from '@/enums';
import { Loader } from '@/components/common/Loaders';
import { toast } from 'sonner';
import { createGetSessionQuery } from '@/modules/profiles/application';
import { SupabaseProfileAuthReadRepository } from '@/modules/profiles/infrastructure';
import { supabaseClient } from '@/lib/supabase';

const profileAuthReadRepository = new SupabaseProfileAuthReadRepository();
const getSession = createGetSessionQuery({
  profileAuthReadRepository,
});

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { session, error } = await getSession({});

        if (error) {
          console.error('Error durante la autenticación:', error);
          toast.error('Error de autenticación', {
            description: 'Hubo un problema al procesar tu autenticación. Inténtalo de nuevo.',
          });
          router.push(PagesUrls.LOGIN);
          return;
        }

        if (session) {
          const { data: userData, error: userError } = await supabaseClient.auth.getUser();
          if (userError) {
            throw userError;
          }

          const searchParams = new URLSearchParams(globalThis.location.search);
          const termsAcceptedFromRedirect = searchParams.get('terms_accepted') === '1';
          const termsAcceptedAtFromRedirect = searchParams.get('terms_accepted_at');
          const termsVersionFromRedirect = searchParams.get('terms_version');
          const user = userData.user;
          const hasTermsAcceptedInMetadata = Boolean(user?.user_metadata?.terms_accepted_at);

          // Si el usuario ya aceptó términos previamente, permitir entrada sin validación adicional
          if (!hasTermsAcceptedInMetadata) {
            // Solo exigir aceptación si es la primera vez
            if (!termsAcceptedFromRedirect) {
              await supabaseClient.auth.signOut();
              toast.error('Debes aceptar términos y privacidad para continuar.');
              router.push(PagesUrls.LOGIN);
              return;
            }

            const acceptedAt = termsAcceptedAtFromRedirect ?? new Date().toISOString();
            const termsVersion = termsVersionFromRedirect ?? 'v1';

            const { error: updateUserError } = await supabaseClient.auth.updateUser({
              data: {
                ...user?.user_metadata,
                terms_accepted_at: acceptedAt,
                privacy_accepted_at: acceptedAt,
                terms_version: termsVersion,
              },
            });

            if (updateUserError) {
              throw updateUserError;
            }
          }
          // Si ya tiene terms_accepted_at, la validación se salta automáticamente y continúa

          toast.success('¡Bienvenido!', {
            description: 'Has iniciado sesión correctamente.',
          });
          router.push(PagesUrls.HOME);
        } else {
          router.push(PagesUrls.LOGIN);
        }
      } catch (error) {
        console.error('Error inesperado:', error);
        toast.error('Error inesperado', {
          description: 'Ocurrió un error inesperado durante la autenticación.',
        });
        router.push(PagesUrls.LOGIN);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Procesando tu autenticación...</p>
        </div>
      </div>
    );
  }

  return null;
}
