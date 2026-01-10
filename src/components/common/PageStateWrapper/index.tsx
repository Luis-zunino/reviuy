import { type ReactNode } from 'react';
import { type IPageStateWrapperProps } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '../Header';
import { Loading } from '../Loading';
import { ErrorPage, NoAuthenticated } from './components';

/**
 * PageStateWrapper Component
 *
 * A wrapper component that handles common page states (loading, error, success).
 * This component abstracts the repetitive pattern of showing skeleton/loading states
 * and error pages, making it reusable across different pages and components.
 *
 * @param props - The component properties
 * @param props.isLoading - Whether the component is in a loading state
 * @param props.isError - Whether there was an error loading the data
 * @param props.LoadingComponent - The component to render during loading state
 * @param props.errorTitle - Translation key for error title
 * @param props.errorSubTitle - Optional translation key for error subtitle
 * @param props.children - The content to render when not loading and no error
 *
 * @example
 * ```tsx
 * <PageStateWrapper
 *   isLoading={isLoading}
 *   isError={isError}
 *   LoadingComponent={<UsersPageSkeleton />}
 *   errorTitle="users.error.title"
 *   errorSubTitle="users.error.subtitle"
 * >
 *   <YourActualContent />
 * </PageStateWrapper>
 * ```
 *
 * @returns The appropriate component based on the current state
 */
export const PageStateWrapper = ({
  isLoading,
  isError,
  errorTitle,
  errorSubTitle,
  isAuthenticated = false,
  children,
  title,
  subtitle,
}: IPageStateWrapperProps): ReactNode => {
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex flex-1 flex-col items-center justify-center">
        <Card className="w-full">
          <CardContent className="text-center py-8">
            <Loading />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) return <NoAuthenticated />;

  if (isError) {
    return (
      <ErrorPage
        title={errorTitle ?? 'Ha ocurrido un error.'}
        subTitle={errorSubTitle ?? 'Por favor, inténtalo de nuevo.'}
      />
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Header title={title} subtitle={subtitle} />
      {children}
    </div>
  );
};
