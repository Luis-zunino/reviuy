import { type ReactNode } from 'react';

/**
 * Props interface for the PageStateWrapper component
 *
 * @param isLoading - Whether the component is in a loading state
 * @param isError - Whether there was an error loading the data
 * @param LoadingComponent - The component to render during loading state
 * @param errorTitleId - Translation key for error title
 * @param errorSubTitleId - Optional translation key for error subtitle
 * @param children - The content to render when not loading and no error
 */
export interface IPageStateWrapperProps {
  /** Whether the component is in a loading state */
  isLoading?: boolean;
  /** Whether there was an error loading the data */
  isError?: boolean;
  /** The component to render during loading state */
  LoadingComponent?: ReactNode;
  /** Translation key for error title */
  errorTitle?: string;
  /** Optional translation key for error subtitle */
  errorSubTitle?: string;
  /** The content to render when not loading and no error */
  children: ReactNode;
  /** Whether the user is authenticated */
  isAuthenticated?: boolean;
  /** Title to display in the header */
  title?: string;
  /** Subtitle to display in the header */
  subtitle?: ReactNode;
}
