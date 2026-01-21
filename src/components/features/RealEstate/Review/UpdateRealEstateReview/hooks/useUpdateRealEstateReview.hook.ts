'use client';

import { useAuthContext } from '@/components/providers/AuthProvider';
import { PagesUrls } from '@/enums';
import { useUpdateRealEstateReviewHook, useGetRealEstateReviewById } from '@/services';
import { RealEstateReviewUpdate } from '@/types/realEstate';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useUpdateRealEstateReview = () => {
  const { reviewId } = useParams<{ realEstateId: string; reviewId: string }>();
  const router = useRouter();
  const { userId } = useAuthContext();

  const { data } = useGetRealEstateReviewById({ reviewId });
  const form = useForm<RealEstateReviewUpdate>();
  const { mutateAsync, isPending } = useUpdateRealEstateReviewHook();

  const handleSubmit = async (formData: RealEstateReviewUpdate) => {
    if (!formData?.title?.trim()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!userId) {
      toast.error('Debes estar logueado para crear una reseña');
      router.push(PagesUrls.LOGIN);
      return;
    }
    mutateAsync(
      { ...formData, id: reviewId },
      {
        onSuccess: () => {
          toast.success('Reseña actualizada exitosamente');
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
    form.reset(data, { keepDirty: false });
  }, [data]);

  return {
    form,
    handleSubmit,
    isSubmitting: isPending,
    review: data,
  };
};
