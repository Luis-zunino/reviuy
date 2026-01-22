import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from './Skeleton';

export const ReviewCardSkeleton: React.FC = () => {
  return (
    <Card className="min-w-80 max-h-96 flex flex-col overflow-hidden">
      {/* HEADER */}
      <CardHeader className="pb-3 w-full">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title skeleton */}
            <Skeleton className="h-6 w-3/4" />
            {/* Address skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          {/* Favorite button skeleton */}
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="flex flex-col gap-3 flex-1">
        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-4" />
            ))}
          </div>
        </div>

        {/* Landlord rating skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-4" />
            ))}
          </div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="pt-3 flex justify-between items-center border-t">
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-3 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
          </div>
        </div>
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
};
