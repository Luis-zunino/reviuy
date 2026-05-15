'use client';

import { Footer } from './components/Footer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavBar } from './components/NavBar';

const queryClient = new QueryClient();

/**
 * MainLayout - Layout principal
 * Contiene el navbar y el footer.
 * @param children - Contenido del layout
 * @returns El layout principal
 */
export const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        >
          Ir al contenido principal
        </a>
        <NavBar />
        <main id="main-content" className="mx-auto flex-1 md:min-h-[80vh]">
          {children}
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
};
