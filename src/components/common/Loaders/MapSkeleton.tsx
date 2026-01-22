import React from 'react';
import { Skeleton } from './Skeleton';

export const MapSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-75 rounded-lg overflow-hidden">
      <Skeleton className="absolute inset-0 w-full h-full" />

      {/* Map controls skeleton */}
      <div className="absolute top-4 right-4 space-y-2">
        <Skeleton className="h-10 w-10 rounded" />
        <Skeleton className="h-10 w-10 rounded" />
      </div>

      {/* Zoom controls skeleton */}
      <div className="absolute bottom-8 right-4 space-y-1">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>

      {/* Loading indicator in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-sm text-muted-foreground">Cargando mapa...</p>
        </div>
      </div>
    </div>
  );
};
