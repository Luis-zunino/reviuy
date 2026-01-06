'use client';

import React from 'react';
import { Footer } from './components/Footer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavBar } from './components/NavBar';
import { usePathname } from 'next/navigation';
import { PagesUrls } from '@/enums';

const queryClient = new QueryClient();

export const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  const isHome = pathname.includes(PagesUrls.HOME);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative">
        {isHome ? (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[400px] opacity-20 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-3xl -z-10 rounded-full" />
        ) : null}
        <NavBar />
        <main className="mx-auto flex-1 min-h-[80vh]">{children}</main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
};
