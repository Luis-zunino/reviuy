'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCreateReview, useUpdateReview, useCheckUserReviewForAddress } from '@/services';
import type { NominatimEntity, RealEstate } from '@/types';
import { PagesUrls } from '@/enums';
import type { UseCreateOrUpdateReviewFormProps } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { FormReviewSchema } from '../constants';
import { formatDataToBackend, getDefaultValues } from '../utils';

export const useCreateOrUpdateReviewForm = (props: UseCreateOrUpdateReviewFormProps) => {
  const { defaultValues } = props;
  const { userId, isAuthenticated, isOwner } = useAuthContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openRealEstateModal, setOpenRealEstateModal] = useState(false);
  const isUpdate = Boolean(defaultValues);

  const form = useForm<FormReviewSchema>({
    defaultValues: getDefaultValues(defaultValues),
  });

  const { control, reset, formState, watch, setValue } = form;
  const { address_text, osm_id: osmId, real_estate_name } = watch();
  const { data: existingReview } = useCheckUserReviewForAddress({
    userId,
    osmId,
  });
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'review_rooms',
  });
  const { mutateAsync: mutationCreate, isPending } = useCreateReview();
  const { mutateAsync: mutationUpdate, isPending: isUpdatePending } = useUpdateReview();

  const handleClearAddress = () => {
    setValue('address_text', '');
    setOpen(false);
  };

  const onSelectAddress = (item: NominatimEntity) => {
    setValue('address_text', item.display_name, {
      shouldValidate: true,
    });
    setValue('osm_id', String(item.osm_id), {
      shouldValidate: true,
    });
    setValue('osm_type', String(item.osm_type), {
      shouldValidate: true,
    });

    setValue('latitude', item.lat, {
      shouldValidate: true,
    });

    setValue('longitude', item.lon, {
      shouldValidate: true,
    });

    if (!isUpdate && isAuthenticated && userId && item.osm_id && existingReview) {
      toast.error('Ya has reseñado esta propiedad', {
        description:
          'Solo puedes escribir una reseña por propiedad. Puedes editar tu reseña existente desde tu perfil.',
      });
    }
    setOpen(false);
  };

  const onSubmit = async (formData: FormReviewSchema) => {
    if (!isOwner(defaultValues?.user_id) && isUpdate) {
      toast.error('No tienes permisos para editar esta reseña');
      router.push(PagesUrls.HOME);
      return;
    }

    if (!userId || !isAuthenticated) {
      toast.error('Debes iniciar sesión para publicar una reseña');
      return;
    }

    const loadingToast = toast.loading(
      isUpdate ? 'Actualizando tu reseña...' : 'Publicando tu reseña...',
      { id: `${isUpdate ? 'update' : 'create'}-review` }
    );
    const data = formatDataToBackend(formData, userId);

    if (defaultValues && defaultValues.id) {
      mutationUpdate(
        {
          reviewId: defaultValues.id,
          updateData: data,
        },
        {
          onSuccess: ({ data, success, message }) => {
            toast.dismiss(loadingToast);

            if (!success) {
              toast.error('Error inesperado', { description: message });
              return;
            }
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
        { data },
        {
          onSuccess: ({ data, success }) => {
            toast.dismiss(loadingToast);
            if (!success) {
              toast.error('Error inesperado', {
                description: 'No se pudo crear la reseña. Inténtalo de nuevo.',
              });
              return;
            }
            toast.success('¡Reseña publicada exitosamente!', {
              description: 'Tu experiencia ha sido compartida con la comunidad',
            });

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

  const handleClearRealEstate = () => {
    setValue('real_estate_id', '');
    setValue('real_estate_name', '');

    setOpenRealEstateModal(false);
  };

  const onSelectRealEstate = (item: RealEstate) => {
    setValue('real_estate_id', item.id, {
      shouldValidate: true,
    });
    setValue('real_estate_name', String(item.name), {
      shouldValidate: true,
    });

    setOpenRealEstateModal(false);
  };

  useEffect(() => {
    if (defaultValues && !isOwner(defaultValues.user_id)) {
      router.push(PagesUrls.HOME);

      const timer = setTimeout(() => {
        toast.error('No tienes permisos para editar esta reseña');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [defaultValues, router, isOwner]);

  useEffect(() => {
    reset(getDefaultValues(defaultValues));
  }, [defaultValues, reset]);

  return {
    ...form,
    onSubmit,
    errors: formState.errors,
    router,
    isSubmitting: isPending || isUpdatePending,
    form,
    fields,
    append,
    remove,
    replace,
    isOwner: isOwner(defaultValues?.user_id),
    watch,
    isSubmitDisabled: Boolean(existingReview && defaultValues && !form.formState.isValid),
    open,
    setOpen,
    queryValue: address_text,
    queryValueRealEstate: real_estate_name,
    handleClearAddress,
    onSelectAddress,
    openRealEstateModal,
    setOpenRealEstateModal,
    handleClearRealEstate,
    onSelectRealEstate,
  };
};
