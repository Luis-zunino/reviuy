'use client';

import { useGetReviewById } from '@/services/apis/reviews';
import { useCreateOrUpdateReviewForm } from '../../hooks';
import { useParams } from 'next/navigation';

export const useUpdateReviewForm = () => {
  const params = useParams();
  const reviewId = typeof params.id === 'string' ? params.id : '';
  const { data: reviewData, isLoading, error: reviewError } = useGetReviewById({ id: reviewId });

  const {
    isSubmitting,
    form,
    onSubmit,
    isOwner,
    selectedAddress,
    userId,
    isAuthenticated,
    loading,
    handleAddressSelect,
    fields,
    replace,
    router,
    append,
    remove,
  } = useCreateOrUpdateReviewForm({
    defaultValues: reviewData,
    isUpdate: true,
  });

  return {
    onSubmit,
    isSubmitting,
    isLoading,
    isOwner,
    hasError: reviewError,
    handleSubmit: form.handleSubmit,
    control: form.control,
    errors: form.formState.errors,
    selectedAddress: selectedAddress ?? {
      display_name: reviewData?.address_text,
      osmId: reviewData?.address_osm_id,
      position: { lat: reviewData?.latitude, lon: reviewData?.longitude },
    },
    userId,
    isAuthenticated,
    loading,
    form,
    handleAddressSelect,
    fields,
    replace,
    router,
    append,
    remove,
    defaultRealEstateId: reviewData?.real_estate_id,
  };
};
