'use client';

import { Login } from '@/components/features/Login';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { useEffect } from 'react';
import { PagesUrls } from '@/enums';

const AuthPage = () => {
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      globalThis.location.href = PagesUrls.HOME;
    }
  }, [isAuthenticated, loading]);

  return <Login />;
};

export default AuthPage;
