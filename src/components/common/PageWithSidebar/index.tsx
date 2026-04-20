'use client';

import { cn } from '@/lib/utils';
import type { PageWithSidebarProps } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Loader } from '../Loaders';
import { ErrorPage, NoAuthenticated } from './components';
import { Breadcrumbs } from '../Breadcrumbs';
import { Box } from '../Box';

/**
 * @description Page layout component with a sidebar and main content area.
 * @param param {@link PageWithSidebarProps}
 * @param title Title of the page
 * @param description Description of the page
 * @param sidebar Sidebar content
 * @param children Main content
 * @param headerClassName Additional classes for the header
 * @param sidebarClassName Additional classes for the sidebar
 * @param contentClassName Additional classes for the main content
 * @param isLoading Loading state
 * @param isError Error state
 * @param errorTitle Title to show in case of error
 * @param errorSubTitle Subtitle to show in case of error
 * @param authIsRequired Whether authentication is required to view the page
 * @param headerAction Optional action element to display in the header
 * @param breadcrumbItems Optional breadcrumb items to display in the header
 *
 * @returns A page layout with a sidebar and main content area.
 */
export const PageWithSidebar: React.FC<PageWithSidebarProps> = (props) => {
  const {
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
    headerAction,
    breadcrumbItems,
  } = props;
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

  const resolvedBreadcrumbItems =
    breadcrumbItems && breadcrumbItems.length > 0 ? breadcrumbItems : [{ label: title }];

  return (
    <main className="min-h-screen bg-background">
      <div
        className={cn(
          'bg-blue-50 border-b border-border py-12 dark:bg-gray-900 px-4',
          headerClassName
        )}
      >
        <div className="max-w-md md:max-w-7xl mx-auto flex items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-3">{title}</h1>
            <p className="text-muted-foreground text-lg">{description}</p>
          </div>
          {headerAction}
        </div>
      </div>
      <div className="sm:max-w-7xl mx-auto py-12 px-4 xl:px-0">
        <Breadcrumbs items={resolvedBreadcrumbItems} className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
          {sidebar ? (
            <div className="lg:col-span-1">
              <Box
                className={cn(
                  'sticky top-20 rounded-lg border border-border p-6',
                  sidebarClassName
                )}
              >
                {sidebar}
              </Box>
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
