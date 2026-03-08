'use client';

import { PagesUrls } from '@/enums';
import { useCreateRealEstateReviewHook } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formRealEstateSchema, FormRealEstateSchema } from '@/schemas';

export const useCreateRealEstateReview = () => {
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const router = useRouter();
  const form = useForm<FormRealEstateSchema>({
    resolver: zodResolver(formRealEstateSchema),
  });
  const { mutateAsync, isPending } = useCreateRealEstateReviewHook();

  const handleSubmit = async (formData: FormRealEstateSchema) => {
    if (!formData?.title?.trim()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!realEstateId) {
      toast.error('ID de inmobiliaria inválido');
      return;
    }
    mutateAsync(
      {
        ...formData,
        title: formData.title ?? '',
        description: formData.description ?? '',
        real_estate_id: realEstateId,
      },
      {
        onSuccess: () => {
          toast.success('Reseña creada');
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
