'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { PagesUrls } from '@/enums';
import type { UseCreateOrUpdateReviewFormProps } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { formReviewSchema, FormReviewSchema } from '@/schemas';
import { formatDataToBackend, getDefaultValues } from '../utils';
import { getAddressOsmId } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCheckUserReviewForAddress,
  useCreateReview,
  useUpdateReview,
} from '@/modules/property-reviews';
import { type NominatimEntity } from '@/modules/addresses';
import { type RealEstateWitheVotes } from '@/modules/real-estates';

export const useCreateOrUpdateReviewForm = (props: UseCreateOrUpdateReviewFormProps) => {
  const { defaultValues } = props;
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openRealEstateModal, setOpenRealEstateModal] = useState(false);
  const { id: reviewId } = useParams<{ id: string }>();
  const isUpdate = Boolean(defaultValues);

  const form = useForm<FormReviewSchema>({
    defaultValues: getDefaultValues(defaultValues),
    resolver: zodResolver(formReviewSchema),
  });

  const { control, reset, formState, watch, setValue } = form;
  const { address_text, osm_id: osmId, osm_type, real_estate_name } = watch();
  const { data: existingReview } = useCheckUserReviewForAddress({
    osmId: getAddressOsmId({ osm_id: osmId, osm_type }),
  });
  const { fields, append, remove, replace } = useFieldArray<FormReviewSchema, 'review_rooms'>({
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

    setValue('latitude', String(item.lat), {
      shouldValidate: true,
    });

    setValue('longitude', String(item.lon), {
      shouldValidate: true,
    });

    setOpen(false);
  };

  const onSubmit = async (formData: FormReviewSchema) => {
    if (!defaultValues?.is_mine && isUpdate) {
      toast.error('No tienes permisos para editar esta reseña');
      router.push(PagesUrls.HOME);
      return;
    }

    const loadingToast = toast.loading(
      isUpdate ? 'Actualizando tu reseña...' : 'Publicando tu reseña...',
      { id: `${isUpdate ? 'update' : 'create'}-review` }
    );
    const data = formatDataToBackend(formData);

    if (defaultValues?.id) {
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
            toast.success('Reseña actualizada');
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
      mutationCreate(data, {
        onSuccess: ({ data, success }) => {
          toast.dismiss(loadingToast);
          if (!success) {
            toast.error('Error inesperado', {
              description: 'No se pudo crear la reseña. Inténtalo de nuevo.',
            });
            return;
          }
          toast.success('¡Reseña publicada!', {
            description: 'Tu experiencia ha sido compartida con la comunidad',
          });

          router.push(PagesUrls.REVIEW_DETAILS.replace(':id', data?.id ?? ''));
        },
        onError: () => {
          toast.error('Error inesperado', {
            description: 'No se pudo crear la reseña. Inténtalo de nuevo.',
          });
        },
      });
    }
  };

  const handleClearRealEstate = () => {
    setValue('real_estate_id', '');
    setValue('real_estate_name', '');

    setOpenRealEstateModal(false);
  };

  const onSelectRealEstate = (item: RealEstateWitheVotes) => {
    setValue('real_estate_id', item.id ?? '', {
      shouldValidate: true,
    });
    setValue('real_estate_name', String(item.name), {
      shouldValidate: true,
    });

    setOpenRealEstateModal(false);
  };

  useEffect(() => {
    if (defaultValues && !defaultValues.is_mine) {
      router.push(PagesUrls.HOME);

      const timer = setTimeout(() => {
        toast.error('No tienes permisos para editar esta reseña');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [defaultValues, router]);

  useEffect(() => {
    if (defaultValues) reset(getDefaultValues(defaultValues), { keepDirty: false });
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!isAuthenticated || !existingReview) return;

    if (reviewId && existingReview.id === reviewId) return;

    toast.warning('Ya has reseñado esta propiedad', {
      description: 'Puedes editar tu reseña existente desde tu perfil.',
      action: {
        label: 'Ir a la reseña',
        onClick: () => router.push(PagesUrls.REVIEW_DETAILS.replace(':id', existingReview.id)),
      },
    });
  }, [existingReview, isAuthenticated, reviewId, router]);

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
    isOwner: defaultValues?.is_mine ?? false,
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
