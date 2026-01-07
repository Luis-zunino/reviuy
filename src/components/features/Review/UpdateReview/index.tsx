'use client';

import { ArrowLeft } from 'lucide-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PagesUrls } from '@/enums';
import { Loading } from '@/components/common';
import { useUpdateReviewForm } from './hooks';
import { ReviewForm } from '../components/ReviewForm';

export const UpdateReview = () => {
  const {
    handleSubmit,
    onSubmit,
    control,
    errors,
    isLoading,
    hasError,
    selectedAddress,
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
    defaultRealEstateId,
  } = useUpdateReviewForm();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>No se pudo cargar la reseña para editar</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => router.push(PagesUrls.HOME)}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <ReviewForm
      isAuthenticated={isAuthenticated}
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
      defaultRealEstateId={defaultRealEstateId}
    />
  );
};
