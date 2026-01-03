import { Loader2 } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import type { LoadingProps } from './types';

export const Loading: React.FC<LoadingProps> = ({
  message = 'Cargando...',
  className,
  variant = 'spinner',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const spinnerSize = sizeClasses[size];

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Loader2 className={cn('animate-spin text-primary', spinnerSize)} />
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
          <Loader2 className={cn('animate-spin text-primary', spinnerSize)} />
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={cn('h-full w-full flex flex-col items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-primary mb-4', spinnerSize)} />
      {message && <p className="text-muted-foreground">{message}</p>}
    </div>
  );
};

// Re-export skeleton components
export { Skeleton } from './Skeleton';
export { ReviewCardSkeleton } from './ReviewCardSkeleton';
export { MapSkeleton } from './MapSkeleton';
export { ListSkeleton } from './ListSkeleton';
