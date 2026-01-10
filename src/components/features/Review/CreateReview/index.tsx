'use client';

import { useCreateReviewForm } from './hooks';
import { ReviewForm } from '../components/ReviewForm';

export const CreateReview = () => {
  const {
    handleSubmit,
    onSubmit,
    control,
    errors,
    selectedAddress,
    userId,
    loading,
    form,
    handleAddressSelect,
    fields,
    replace,
    append,
    remove,
    hasExistingReview,
  } = useCreateReviewForm();

  return (
    <ReviewForm
      userId={userId}
      loading={loading}
      errors={errors}
      selectedAddress={selectedAddress}
      handleAddressSelect={handleAddressSelect}
      fields={fields}
      replace={replace}
      control={control}
      form={form}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      append={append}
      remove={remove}
      hasExistingReview={hasExistingReview}
    />
  );
};
