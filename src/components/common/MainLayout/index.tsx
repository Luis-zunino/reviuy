'use client';

import React from 'react';
import { Footer } from './components/Footer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavBar } from './components/NavBar';

const queryClient = new QueryClient();

export const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative">
        <NavBar />
        <main className="mx-auto flex-1 md:min-h-[80vh]">{children}</main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
};
