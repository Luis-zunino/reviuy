'use client';

import {
  DeleteRealEstateReviewButton,
  PageWithSidebar,
  RealEstateReviewVoteButtons,
  ReportRealEstateReviewButton,
} from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Save } from 'lucide-react';
import React from 'react';
import { RealEstateReviewFormContent } from './components/RealEstateReviewFormContent';
import type { RealEstateReviewFormProps } from './types';
import { Form } from '@/components/ui/form';

export const RealEstateReviewForm = (props: RealEstateReviewFormProps) => {
  const {
    form,
    handleSubmit,
    isSubmitting,
    title,
    subtitle,
    isLoading,
    error,
    isReadOnly,
    review,
    refetchRealEstateReview,
  } = props;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 ">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <PageWithSidebar
      title={title}
      description={subtitle ?? ''}
      errorTitle="No se pudo encontrar la inmobiliaria"
      isError={!!error}
    >
      <div className="mt-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <RealEstateReviewFormContent form={form} isReadOnly={isReadOnly} />
            <div className="flex gap-4 pt-4 justify-end">
              {review && isReadOnly ? (
                <RealEstateReviewVoteButtons
                  reviewId={review.id}
                  likes={review.likes}
                  dislikes={review.dislikes}
                  refetchRealEstateReview={refetchRealEstateReview}
                />
              ) : null}
              {review && isReadOnly ? (
                <ReportRealEstateReviewButton review={review} showText />
              ) : null}
              {review ? <DeleteRealEstateReviewButton review={review} showText /> : null}
              {!isReadOnly ? (
                <Button type="submit" disabled={isSubmitting} icon={Save} size="sm">
                  {isSubmitting ? 'Guardando...' : 'Publicar reseña'}
                </Button>
              ) : null}
            </div>
          </form>
        </Form>
      </div>
    </PageWithSidebar>
  );
};
