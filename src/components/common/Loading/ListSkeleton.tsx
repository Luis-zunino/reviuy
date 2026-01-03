import React from 'react';
import { Skeleton } from './Skeleton';
import type { ListSkeletonProps } from './types';

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ items = 5, variant = 'default' }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className={variant === 'compact' ? 'space-y-2' : 'space-y-3 p-4 border rounded-lg'}
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          {variant === 'default' && (
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
