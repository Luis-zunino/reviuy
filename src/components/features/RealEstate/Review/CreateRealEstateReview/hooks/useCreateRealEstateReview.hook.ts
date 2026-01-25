'use client';

import { useAuthContext } from '@/components/providers/AuthProvider';
import { PagesUrls } from '@/enums';
import { useCreateRealEstateReviewHook } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formRealEstateSchema, FormRealEstateSchema } from '../../types';

export const useCreateRealEstateReview = () => {
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const router = useRouter();
  const { userId } = useAuthContext();
  const form = useForm<FormRealEstateSchema>({
    resolver: zodResolver(formRealEstateSchema),
  });
  const { mutateAsync, isPending } = useCreateRealEstateReviewHook();

  const handleSubmit = async (formData: FormRealEstateSchema) => {
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
      { ...formData, real_estate_id: realEstateId, user_id: userId },
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
