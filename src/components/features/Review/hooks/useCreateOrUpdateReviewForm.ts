'use client';

import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCreateReview, useUpdateReview } from '@/services';
import type { SelectedAddress, ReviewFormData } from '@/types';
import { PagesUrls } from '@/enums';
import { useQueryClient } from '@tanstack/react-query';
import type { UseCreateOrUpdateReviewFormProps } from './types';

export const useCreateOrUpdateReviewForm = (props: UseCreateOrUpdateReviewFormProps) => {
  const { isUpdate = false, defaultValues } = props;
  const { user, isAuthenticated } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);
  const queryClient = useQueryClient();

  const getDefaultValues = useCallback((): ReviewFormData => {
    if (isUpdate && defaultValues) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { real_estates, ...rest } = defaultValues;
      return {
        ...rest,
        title: defaultValues.title || '',
        description: defaultValues.description || '',
        rating: defaultValues.rating || 0,
        review_rooms:
          defaultValues.review_rooms?.map((room) => ({
            id: room.id,
            room_type: room.room_type || 'bedroom',
            area_m2: room.area_m2 || 0,
          })) || [],
      };
    }

    return {
      ...defaultValues,
      title: '',
      description: '',
      rating: 0,
      review_rooms: [],
    };
  }, [isUpdate, defaultValues]);

  const form = useForm<ReviewFormData>({
    defaultValues: getDefaultValues(),
  });

  const { control, reset, formState, watch } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'review_rooms',
  });

  const { mutate: mutationCreate, isPending } = useCreateReview();

  const { mutate: mutationUpdate, isPending: isUpdatePending } = useUpdateReview();

  const onSubmit = async (data: ReviewFormData) => {
    if (!user || !isAuthenticated) {
      toast.error('Debes iniciar sesión para publicar una reseña');
      return;
    }

    if (isUpdate && defaultValues) {
      const isOwner = defaultValues.user_id === user.id;
      setIsOwner(isOwner);
      if (!isOwner) {
        toast.error('No tienes permisos para editar esta reseña');
        return;
      }
    }

    if (!selectedAddress && !isUpdate) {
      toast.error('Por favor selecciona una dirección');
      return;
    }

    if (!data.title.trim()) {
      toast.error('Por favor ingresa un título para tu reseña');
      return;
    }

    if (!data.description.trim()) {
      toast.error('Por favor describe tu experiencia');
      return;
    }

    if (data.rating === 0) {
      toast.error('Por favor califica tu experiencia general');
      return;
    }

    const loadingToast = toast.loading(
      isUpdate ? 'Actualizando tu reseña...' : 'Publicando tu reseña...',
      { id: `${isUpdate ? 'update' : 'create'}-review` }
    );

    const commonData = {
      ...data,
      user_id: user.id,
      title: data.title.trim(),
      description: data.description.trim(),
      address_text: selectedAddress?.display_name,
      address_osm_id: selectedAddress?.osmId,
      latitude: selectedAddress?.position?.lat || null,
      longitude: selectedAddress?.position?.lon || null,
    };

    if (isUpdate && defaultValues && defaultValues.id) {
      mutationUpdate(
        {
          reviewId: defaultValues.id,
          updateData: commonData,
        },
        {
          onSuccess: ({ data }) => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            queryClient.invalidateQueries({ queryKey: ['latestReviews'] });
            queryClient.invalidateQueries({ queryKey: ['reviewsByAddress'] });
            queryClient.invalidateQueries({ queryKey: ['review', data?.id] });
            toast.dismiss(loadingToast);
            toast.success('Reseña actualizada exitosamente');
            router.push(PagesUrls.REVIEW_DETAILS.replace(':id', data?.id ?? ''));
          },
          onError: () => {
            toast.error('Error inesperado', {
              description: 'No se pudo actualizar la reseña. Inténtalo de nuevo.',
            });
          },
        }
      );
    } else {
      mutationCreate(
        {
          ...commonData,
          likes: 0,
          dislikes: 0,
        },
        {
          onSuccess: ({ data }) => {
            toast.dismiss(loadingToast);

            toast.success('¡Reseña publicada exitosamente!', {
              description: 'Tu experiencia ha sido compartida con la comunidad',
            });

            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            queryClient.invalidateQueries({ queryKey: ['latestReviews'] });
            queryClient.invalidateQueries({ queryKey: ['reviewsByAddress'] });
            router.push(PagesUrls.REVIEW_DETAILS.replace(':id', data?.id ?? ''));
          },
          onError: () => {
            toast.error('Error inesperado', {
              description: 'No se pudo crear la reseña. Inténtalo de nuevo.',
            });
          },
        }
      );
    }
  };

  const handleAddressSelect = (addressData: SelectedAddress) => {
    const addressDataFormatted: SelectedAddress = {
      osmId: addressData?.osmId?.toString(),
      display_name: addressData.display_name,
      position: {
        lat: addressData.position.lat,
        lon: addressData.position.lon,
      },
    };
    setSelectedAddress(addressDataFormatted);

    toast.success('Dirección seleccionada', {
      description: 'La dirección se ha cargado correctamente',
    });
  };

  useEffect(() => {
    if (isUpdate) {
      reset(getDefaultValues());
    }
  }, [defaultValues, getDefaultValues, isUpdate, reset]);

  return {
    ...form,
    onSubmit,
    errors: formState.errors,
    router,
    isSubmitting: isPending || isUpdatePending,
    selectedAddress,
    user,
    isAuthenticated,
    loading: isPending || isUpdatePending,
    form,
    handleAddressSelect,
    fields,
    append,
    remove,
    replace,
    isOwner,
    watch,
  };
};
