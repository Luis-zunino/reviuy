'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';
import { useViewRealEstateDetails } from './hooks';
import { PageWithSidebar } from '@/components/common';
import { ViewRealEstateDetailsContent, ViewRealEstateDetailsHeader } from './components';

export const ViewRealEstateDetails = () => {
  const {
    realEstateReview,
    isLoadingRealEstateReview,
    error,
    realEstateId,
    isLoadingReviews,
    reviews,
    userId,
    averageRating,
  } = useViewRealEstateDetails();

  if (isLoadingRealEstateReview) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !reviews) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{'No se pudo encontrar la inmobiliaria'}</p>
            <Button onClick={() => window.history.back()} variant="outline">
              Volver atrás
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PageWithSidebar
      title="Reseñas y calificaciones"
      description="Ecnuentra los detalles de la inmobiliaria"
    >
      <div className="space-y-6">
        <ViewRealEstateDetailsHeader
          averageRating={averageRating}
          amountReviews={realEstateReview?.length ?? 0}
        />
        <ViewRealEstateDetailsContent
          realEstateReview={realEstateReview}
          reviews={reviews}
          isLoadingReviews={isLoadingReviews}
          realEstateId={realEstateId}
          userId={userId}
        />
      </div>
    </PageWithSidebar>
  );
};
