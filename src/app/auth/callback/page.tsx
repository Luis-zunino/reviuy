'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PagesUrls } from '@/enums';
import { Loading } from '@/components/common/Loading';
import { toast } from 'sonner';
import { getSession } from '@/services/apis/user/getSession.api';

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { session, error } = await getSession();

        if (error) {
          console.error('Error durante la autenticación:', error);
          toast.error('Error de autenticación', {
            description: 'Hubo un problema al procesar tu autenticación. Inténtalo de nuevo.',
          });
          router.push(PagesUrls.LOGIN);
          return;
        }

        if (session) {
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
          <Loading />
          <p className="mt-4 text-gray-600">Procesando tu autenticación...</p>
        </div>
      </div>
    );
  }

  return null;
}
