'use client';

import {
  BackButton,
  DeleteRealEstateReviewButton,
  Header,
  RealEstateReviewVoteButtons,
} from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { RealEstateReviewUpdate } from '@/types';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { RealEstateReviewFormContent } from './components/RealEstateReviewFormContent';
import type { RealEstateReviewFormProps } from './types';

export const RealEstateReviewForm = <RR extends RealEstateReviewUpdate>(
  props: RealEstateReviewFormProps<RR>
) => {
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

  const router = useRouter();

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

  if (error) {
    return (
      <div className="container mx-auto p-6 ">
        <BackButton />
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No se pudo encontrar la inmobiliaria</p>
            <Button onClick={() => router.back()} variant="outline">
              Volver atrás
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 ">
      <Header title={title} subtitle={subtitle} />
      <div className="mt-6 space-y-6">
        <Card>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <RealEstateReviewFormContent form={form} isReadOnly={isReadOnly} />
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                  icon={ArrowLeft}
                >
                  {isReadOnly ? 'Volver' : 'Cancelar'}
                </Button>
                {review && isReadOnly ? (
                  <DeleteRealEstateReviewButton review={review} showText variant="destructive" />
                ) : null}

                {review && isReadOnly ? (
                  <RealEstateReviewVoteButtons
                    reviewId={review?.id ?? ''}
                    likes={review?.likes ?? 0}
                    dislikes={review?.dislikes ?? 0}
                    refetchRealEstateReview={refetchRealEstateReview}
                  />
                ) : null}
                {!isReadOnly ? (
                  <Button type="submit" disabled={isSubmitting} className="flex-1" icon={Save}>
                    {isSubmitting ? 'Guardando...' : 'Publicar reseña'}
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealEstateReviewForm;
