'use client';

import { RealEstateReviewForm } from '../RealEstateReviewForm';
import { useViewRealEstateReview } from './hooks';

export const ViewRealEstateReview = () => {
  const {
    form,
    handleSubmit,
    realEstateName,
    isLoadingRealEstate,
    isLoadingReview,
    isError,
    review,
    refetchRealEstateReview,
  } = useViewRealEstateReview();
  return (
    <RealEstateReviewForm
      form={form}
      handleSubmit={handleSubmit}
      isSubmitting={false}
      title={`Reseña de: ${realEstateName || 'inmobiliaria'}`}
      subtitle="Detalles de la reseña sobre la inmobiliaria"
      isLoading={isLoadingRealEstate || isLoadingReview}
      error={isError}
      isReadOnly={true}
      review={review}
      refetchRealEstateReview={refetchRealEstateReview}
    />
  );
};
