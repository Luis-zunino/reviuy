'use client';

import { Login } from '@/components/features/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PagesUrls } from '@/enums';

const queryClient = new QueryClient();

const AuthPage = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(PagesUrls.HOME);
    }
  }, [isAuthenticated, loading, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );
};

export default AuthPage;
