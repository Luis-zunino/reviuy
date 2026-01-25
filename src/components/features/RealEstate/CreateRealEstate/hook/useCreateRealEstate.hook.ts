'use client';

import { useCreateRealEstateHook } from '@/services';
import type { RealEstateInsert } from '@/types';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormCreateRealEstateSchema, formCreateRealEstateSchema } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { zodResolver } from '@hookform/resolvers/zod';

export const useCreateRealEstate = () => {
  const router = useRouter();
  const { userId } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormCreateRealEstateSchema>({ resolver: zodResolver(formCreateRealEstateSchema) });

  const { mutateAsync, isPending } = useCreateRealEstateHook();

  const onSubmit = async (data: FormCreateRealEstateSchema) => {
    if (!userId) {
      toast.error('Debes estar autenticado para crear una inmobiliaria');
      return;
    }

    try {
      const realEstateData: RealEstateInsert = {
        name: data.name.trim(),
        created_by: userId,
      };

      const newRealEstate = await mutateAsync(realEstateData);
      if (!newRealEstate) toast.success('Inmobiliaria creada exitosamente');
      reset();

      router.back();
    } catch (error) {
      console.error('Error creating real estate:', error);
      toast.error('Error al crear la inmobiliaria. Por favor, inténtalo de nuevo.');
    }
  };

  return {
    handleSubmit,
    onSubmit,
    register,
    errors,
    isSubmitting: isPending,
  };
};
