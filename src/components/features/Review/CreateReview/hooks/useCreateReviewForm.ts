'use client';

import { useCreateOrUpdateReviewForm } from '../../hooks';

export const useCreateReviewForm = () => {
  const {
    isSubmitting,
    selectedAddress,
    fields,
    form,
    replace,
    onSubmit,
    handleAddressSelect,
    user,
    isAuthenticated,
    router,
    append,
    remove,
  } = useCreateOrUpdateReviewForm({
    defaultValues: null,
    isUpdate: false,
  });

  return {
    handleSubmit: form.handleSubmit,
    onSubmit,
    control: form.control,
    errors: form.formState.errors,
    router,
    isSubmitting,
    selectedAddress,
    user,
    isAuthenticated,
    loading: false,
    form,
    handleAddressSelect,
    fields,
    replace,
    append,
    remove,
  };
};
