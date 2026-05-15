'use client';

import { useCreateRealEstateReview } from './hooks';
import { RealEstateReviewForm } from '../RealEstateReviewForm';
import { useParams } from 'next/navigation';
import { useGetRealEstateById } from '@/modules/real-estates';

export const CreateRealEstateReview = () => {
  const { form, handleSubmit, isSubmitting } = useCreateRealEstateReview();
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const { data: realEstate, isLoading } = useGetRealEstateById(realEstateId);

  return (
    <RealEstateReviewForm
      form={form}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      title={`Escribir reseña para ${realEstate?.name}`}
      subtitle="Comparte tu experiencia con esta inmobiliaria"
      isLoading={isLoading}
      error={!realEstate}
    />
  );
};
