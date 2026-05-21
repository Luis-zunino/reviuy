import { cn } from '@/lib/utils/cn';
import type { LoadingProps } from './types';

/**
 * Loader component for displaying loading states
 * @param param {@link LoadingProps} - Props for the loading component
 * @param message Optional loading message (default: 'Cargando...')
 * @param className Optional additional CSS classes
 * @param variant Optional variant of the loading component ('spinner', 'inline', 'overlay') (default: 'spinner')
 * @param size Optional size of the loader ('sm', 'md', 'lg') (default: 'md')
 * @returns Loader component
 */
export const Loader: React.FC<LoadingProps> = ({
  message = 'Cargando...',
  className,
  variant = 'spinner',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-10',
    lg: 'size-16',
  };

  const spinnerSize = sizeClasses[size];

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div
          className={cn(
            'animate-spin rounded-full size-32 border-b-2 border-gray-900',
            spinnerSize
          )}
        ></div>
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
          'flex items-center justify-center',
          className
        )}
      >
        <div className="flex flex-col items-center gap-4 rounded-lg bg-card p-6 shadow-lg">
          <div
            className={cn(
              'animate-spin rounded-full size-32 border-b-2 border-gray-900',
              spinnerSize
            )}
          ></div>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={cn('h-full w-full flex flex-col items-center justify-center', className)}>
      <div
        className={cn('animate-spin rounded-full size-32 border-b-2 border-gray-900', spinnerSize)}
      ></div>
      {message && <p className="text-muted-foreground">{message}</p>}
    </div>
  );
};
