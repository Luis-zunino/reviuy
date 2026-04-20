'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useViewRealEstateDetails } from './hooks';
import { PageWithSidebar } from '@/components/common';
import { ViewRealEstateDetailsContent, ViewRealEstateDetailsHeader } from './components';

export const ViewRealEstateDetails = (props: { realEstateId: string }) => {
  const { realEstateId } = props;

  const {
    realEstateReview,
    isLoadingRealEstateReview,
    error,
    isValidRealEstateId,
    isLoadingReviews,
    reviews,
    averageRating,
  } = useViewRealEstateDetails({ realEstateId });

  if (isLoadingRealEstateReview) {
    return (
      <PageWithSidebar
        title="Reseñas y calificaciones"
        description="Encuentra los detalles de la inmobiliaria"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="space-y-4 py-2">
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </PageWithSidebar>
    );
  }

  return (
    <PageWithSidebar
      title="Reseñas y calificaciones"
      description="Encuentra los detalles de la inmobiliaria"
      isError={!isValidRealEstateId || !!error || !reviews}
      errorTitle="No se pudo encontrar la inmobiliaria"
      errorSubTitle="Por favor, inténtalo de nuevo más tarde"
    >
      <div className="space-y-6">
        <ViewRealEstateDetailsHeader
          averageRating={averageRating}
          amountReviews={realEstateReview?.length ?? 0}
        />
        <ViewRealEstateDetailsContent
          realEstateReview={realEstateReview}
          reviews={reviews ?? []}
          isLoadingReviews={isLoadingReviews}
          realEstateId={realEstateId}
        />
      </div>
    </PageWithSidebar>
  );
};
