import React from 'react';
import { cn } from '@/lib/utils';
import type { PageWithSidebarProps } from './types';

export const PageWithSidebar: React.FC<PageWithSidebarProps> = ({
  title,
  description,
  sidebar,
  children,
  headerClassName,
  sidebarClassName,
  contentClassName,
}) => {
  return (
    <main className="min-h-screen bg-background">
      <div className={cn('bg-blue-50 border-b border-border py-12 px-4', headerClassName)}>
        <div className="max-w-md xl:max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-3">{title}</h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
      </div>
      <div className="md:max-w-7xl mx-auto px-4 py-12">
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
