'use client';

import {
  useUpdateRealEstateReviewHook,
  useGetRealEstateReviewById,
} from '@/modules/real-estates/presentation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormRealEstateSchema, formRealEstateSchema } from '@/schemas';

export const useUpdateRealEstateReview = () => {
  const { reviewId } = useParams<{ realEstateId: string; reviewId: string }>();
  const router = useRouter();

  const { data } = useGetRealEstateReviewById({ reviewId });
  const form = useForm<FormRealEstateSchema>({ resolver: zodResolver(formRealEstateSchema) });
  const { mutateAsync, isPending } = useUpdateRealEstateReviewHook();

  const handleSubmit = async (formData: FormRealEstateSchema) => {
    if (!formData?.title?.trim()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    mutateAsync(
      {
        ...formData,
        title: formData.title ?? '',
        description: formData.description ?? '',
        id: reviewId,
      },
      {
        onSuccess: () => {
          toast.success('Reseña actualizada');
          router.back();
        },
        onError: (error) => {
          toast.error('Error al actualizar la reseña');
          throw new Error(error.message);
        },
      }
    );
  };

  useEffect(() => {
    if (!data) return;
    form.reset(
      {
        ...data,
        title: data.title ?? '',
        description: data.description ?? '',
        rating: data.rating ?? 0,
      },
      { keepDirty: false }
    );
  }, [data, form]);

  return {
    form,
    handleSubmit,
    isSubmitting: isPending,
    review: data,
  };
};
