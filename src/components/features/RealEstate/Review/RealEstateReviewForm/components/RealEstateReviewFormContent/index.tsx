import { StarRatingInput, StarRatingDisplay } from '@/components/common';
import { FormLabel } from '@/components/common/Form/FormLabel';
import { Input } from '@/components/ui/input';
import type { RealEstateReviewUpdate } from '@/types';
import React from 'react';
import { Controller, Path } from 'react-hook-form';
import { validateText } from '@/utils';
import type { RealEstateReviewFormContentProps } from './types';
import { Textarea } from '@/components/ui/textarea';

export const RealEstateReviewFormContent = <RR extends RealEstateReviewUpdate>(
  props: RealEstateReviewFormContentProps<RR>
) => {
  const { form, isReadOnly } = props;
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  return (
    <>
      <div>
        <FormLabel htmlFor="title" label="Breve descripción" isRequired={!isReadOnly} />
        <Input
          {...register('title' as Path<RR>, {
            required: 'Este campo es necesario',
            validate: (value) => {
              const validation = validateText(String(value) || '');
              return validation.isValid || validation.message;
            },
          })}
          value={watch('title' as Path<RR>) || ''}
          id="title"
          name="title"
          placeholder="Ej: Excelente atención y profesionalismo"
          required
          className="mt-1"
          disabled={isReadOnly}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors?.title?.message as string}</p>
        )}
      </div>

      <div>
        <FormLabel
          htmlFor="description"
          label="Descripcion de la reseña"
          isRequired={!isReadOnly}
        />

        <Textarea
          {...register('description' as Path<RR>, {
            required: 'La descripción es obligatoria',
            validate: (value) => {
              const validation = validateText(String(value) || '');
              return validation.isValid || validation.message;
            },
          })}
          value={watch('description' as Path<RR>) || ''}
          id="description"
          name="description"
          placeholder="Ej: Excelente atención y profesionalismo"
          required
          className="mt-1"
          disabled={isReadOnly}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors?.description?.message as string}</p>
        )}
      </div>
      <div className="space-y-2">
        <FormLabel label="Calificación general" isRequired={!isReadOnly} />

        <Controller
          name={'rating' as Path<RR>}
          control={form.control}
          rules={{
            required: 'La calificación es obligatoria',
            min: { value: 1, message: 'Selecciona al menos 1 estrella' },
          }}
          render={({ field }) =>
            isReadOnly ? (
              <StarRatingDisplay rating={Number(field.value) || 0} />
            ) : (
              <StarRatingInput
                value={Number(field.value) || 0}
                onChange={field.onChange}
                required
              />
            )
          }
        />
        {errors.rating && (
          <p className="text-sm text-red-500 mt-1">{errors.rating.message as string}</p>
        )}
      </div>
    </>
  );
};
