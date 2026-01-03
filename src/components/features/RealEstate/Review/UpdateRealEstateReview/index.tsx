'use client';

import React from 'react';
import RealEstateReviewForm from '../RealEstateReviewForm';
import { useUpdateRealEstateReview } from './hooks';
import { useParams } from 'next/navigation';
import { useGetRealEstateById } from '@/services';

export const UpdateRealEstateReview = () => {
  const { form, handleSubmit, isSubmitting, review } = useUpdateRealEstateReview();
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const { data: realEstate, isLoading } = useGetRealEstateById(realEstateId);
  return (
    <RealEstateReviewForm
      form={form}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      title={`Actualiza la reseña para ${realEstate?.name}`}
      subtitle="Comparte tu experiencia con esta inmobiliaria"
      isLoading={isLoading}
      error={!realEstate}
      review={review}
    />
  );
};
