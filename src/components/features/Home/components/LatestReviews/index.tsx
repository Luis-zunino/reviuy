'use client';

import { useLatestReviews } from './hooks';
import { ReviewCard } from '@/components/common';
import { Building2, HouseIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const LatestReviews = () => {
  const { reviewsData, loading, error } = useLatestReviews();

  if (reviewsData?.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No hay reseñas todavía. ¡Sé el primero!</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Últimas resenas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <HouseIcon className="h-5 w-5 text-blue-600" />
        Últimas resenas
      </h3>
      {error && (
        <div className="p-6 text-center text-red-500">Error al cargar: {error.message}</div>
      )}
      {!loading && !error && (
        <div className="flex gap-5 overflow-y-auto max-w-screen">
          {reviewsData?.map((review) => (
            <ReviewCard review={review} key={review.id} />
          ))}
        </div>
      )}
    </div>
  );
};
