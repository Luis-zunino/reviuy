'use client';

import { PagesUrls } from '@/enums';
import { useUser } from '@/hooks';
import { useCreateRealEstateReviewHook } from '@/services';
import { RealEstateReviewInsert } from '@/types/realEstate';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useCreateRealEstateReview = () => {
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const router = useRouter();
  const { userId } = useUser();
  const form = useForm<RealEstateReviewInsert>();
  const { mutateAsync, isPending } = useCreateRealEstateReviewHook();

  const handleSubmit = async (formData: RealEstateReviewInsert) => {
    if (!formData?.title?.trim()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!userId || !realEstateId) {
      toast.error('Debes estar logueado para crear una reseña');
      router.push(PagesUrls.LOGIN);
      return;
    }
    mutateAsync(
      { ...formData, real_estate_id: realEstateId },
      {
        onSuccess: () => {
          toast.success('Reseña creada exitosamente');
          router.push(`${PagesUrls.REAL_ESTATE}${realEstateId}`);
        },
        onError: (error) => {
          toast.error('Error al crear la reseña');
          throw new Error(error.message);
        },
      }
    );
  };

  return {
    form,
    handleSubmit,
    isSubmitting: isPending,
  };
};
