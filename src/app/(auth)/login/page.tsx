'use client';

import { Login } from '@/components/features/Login';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { PagesUrls } from '@/enums';
import { AUTH_CALLBACK_ERROR } from '@/shared/auth/auth-callback.constant';

const AuthPage = () => {
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      globalThis.location.href = PagesUrls.HOME;
    }
  }, [isAuthenticated, loading]);

  // /auth/callback redirige acá con ?error= si el link venció o ya se usó.
  // Se lee de location (no useSearchParams) para no requerir un Suspense boundary.
  useEffect(() => {
    const params = new URLSearchParams(globalThis.location.search);

    if (params.get('error') === AUTH_CALLBACK_ERROR) {
      toast.error('Error de autenticación', {
        description: 'El enlace venció o ya fue usado. Pedí uno nuevo para iniciar sesión.',
      });
    }
  }, []);

  return <Login />;
};

export default AuthPage;
