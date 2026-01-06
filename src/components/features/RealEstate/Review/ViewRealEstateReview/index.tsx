'use client';

import React from 'react';
import { RealEstateReviewForm } from '../RealEstateReviewForm';
import { useParams } from 'next/navigation';
import { useGetRealEstateById, useGetRealEstateReviewById } from '@/services';
import { useForm } from 'react-hook-form';
import type { RealEstateReviewUpdate } from '@/types';

export const ViewRealEstateReview = () => {
  const { realEstateId, reviewId } = useParams<{ realEstateId: string; reviewId: string }>();
  const { data: realEstate, isLoading: isLoadingRealEstate } = useGetRealEstateById(realEstateId);
  const {
    data: review,
    isLoading: isLoadingReview,
    refetch: refetchRealEstateReview,
  } = useGetRealEstateReviewById({ reviewId });

  const form = useForm<RealEstateReviewUpdate>({
    defaultValues: {
      title: review?.title || '',
      description: review?.description || '',
      rating: review?.rating || 0,
    },
    values: {
      title: review?.title || '',
      description: review?.description || '',
      rating: review?.rating || 0,
    },
  });

  const handleSubmit = async () => {
    // No-op para readonly
  };

  return (
    <RealEstateReviewForm
      form={form}
      handleSubmit={handleSubmit}
      isSubmitting={false}
      title={`Reseña de: ${realEstate?.name || 'inmobiliaria'}`}
      subtitle="Detalles de la reseña sobre la inmobiliaria"
      isLoading={isLoadingRealEstate || isLoadingReview}
      error={!realEstate || !review}
      isReadOnly={true}
      review={review}
      refetchRealEstateReview={refetchRealEstateReview}
    />
  );
};
