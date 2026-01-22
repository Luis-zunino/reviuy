'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { PageWithSidebarProps } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Loader } from '../Loaders';
import { ErrorPage, NoAuthenticated } from './components';
import { BackButton } from '../BackButton';

export const PageWithSidebar: React.FC<PageWithSidebarProps> = ({
  title,
  description,
  sidebar,
  children,
  headerClassName,
  sidebarClassName,
  contentClassName,
  isLoading,
  isError,
  errorTitle = 'Ha ocurrido un error.',
  errorSubTitle = 'Por favor, inténtalo de nuevo.',
  authIsRequired = false,
}) => {
  const { isAuthenticated } = useAuthContext();

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex flex-1 flex-col items-center justify-center w-full">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated && authIsRequired) return <NoAuthenticated />;

  if (isError) {
    return <ErrorPage title={errorTitle} subTitle={errorSubTitle} />;
  }
  return (
    <main className="min-h-screen bg-background">
      <div className={cn('bg-blue-50 border-b border-border py-12', headerClassName)}>
        <div className="max-w-md md:max-w-7xl mx-auto flex items-start gap-4">
          <BackButton />
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-3">{title}</h1>
            <p className="text-muted-foreground text-lg">{description}</p>
          </div>
        </div>
      </div>
      <div className="md:max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
          {sidebar ? (
            <div className="lg:col-span-1">
              <div
                className={cn(
                  'sticky top-20 bg-white rounded-lg border border-border p-6',
                  sidebarClassName
                )}
              >
                {sidebar}
              </div>
            </div>
          ) : null}

          <div className={cn(sidebar ? 'lg:col-span-3' : 'col-span-4', 'w-full', contentClassName)}>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};
