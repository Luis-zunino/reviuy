'use client';

import { Login } from '@/components/features/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { useEffect } from 'react';
import { PagesUrls } from '@/enums';

const queryClient = new QueryClient();

const AuthPage = () => {
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      globalThis.location.href = PagesUrls.HOME;
    }
  }, [isAuthenticated, loading]);

  return (
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );
};

export default AuthPage;
