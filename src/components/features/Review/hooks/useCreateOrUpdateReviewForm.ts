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
  useUploadReviewImage,
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

  const form = useForm<FormReviewSchema, undefined, FormReviewSchema>({
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
  const { mutateAsync: uploadReviewImage, isPending: isUploadingImages } = useUploadReviewImage();

  const uploadImages = async (reviewId: string, osmId: string, images: File[] = []) => {
    if (!images.length) {
      return { uploadedCount: 0, failedCount: 0 };
    }

    const results = await Promise.allSettled(
      images.map((file) =>
        uploadReviewImage({
          reviewId,
          osmId,
          file,
        })
      )
    );

    const uploadedCount = results.filter((result) => result.status === 'fulfilled').length;
    const failedCount = results.length - uploadedCount;

    return { uploadedCount, failedCount };
  };

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
    const selectedImages = formData.images ?? [];

    try {
      if (defaultValues?.id) {
        const response = await mutationUpdate({
          reviewId: defaultValues.id,
          updateData: data,
        });

        if (!response.success) {
          toast.dismiss(loadingToast);
          toast.error('Error inesperado', { description: response.message });
          return;
        }

        const reviewId = response.data?.id ?? defaultValues.id;
        const { failedCount } = await uploadImages(reviewId, data.address_osm_id, selectedImages);

        toast.dismiss(loadingToast);
        toast.success('Reseña actualizada', {
          description:
            failedCount > 0
              ? `La reseña se actualizó, pero ${failedCount} imagen${failedCount === 1 ? '' : 'es'} no se pudieron subir.`
              : 'Cambios guardados correctamente.',
        });

        router.push(PagesUrls.REVIEW_DETAILS.replace(':id', reviewId));
        return;
      }

      const response = await mutationCreate(data);

      if (!response.success || !response.data?.id) {
        toast.dismiss(loadingToast);
        toast.error('Error inesperado', {
          description: response.message || 'No se pudo crear la reseña. Inténtalo de nuevo.',
        });
        return;
      }

      const reviewId = response.data.id;
      const { failedCount } = await uploadImages(reviewId, data.address_osm_id, selectedImages);

      toast.dismiss(loadingToast);
      toast.success('¡Reseña publicada!', {
        description:
          failedCount > 0
            ? `Tu reseña fue publicada, pero ${failedCount} imagen${failedCount === 1 ? '' : 'es'} no se pudieron subir.`
            : 'Tu experiencia ha sido compartida con la comunidad',
      });

      router.push(PagesUrls.REVIEW_DETAILS.replace(':id', reviewId));
    } catch {
      toast.dismiss(loadingToast);
      toast.error('Error inesperado', {
        description: isUpdate
          ? 'No se pudo actualizar la reseña. Inténtalo de nuevo.'
          : 'No se pudo crear la reseña. Inténtalo de nuevo.',
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
    isSubmitting: isPending || isUpdatePending || isUploadingImages,
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
