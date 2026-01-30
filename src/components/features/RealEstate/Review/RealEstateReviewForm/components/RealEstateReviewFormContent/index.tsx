import { StarRatingInput, StarRatingDisplay } from '@/components/common';
import { FormLabel } from '@/components/common/Form/FormLabel';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Controller } from 'react-hook-form';
import type { RealEstateReviewFormContentProps } from './types';
import { Textarea } from '@/components/ui/textarea';

export const RealEstateReviewFormContent = (props: RealEstateReviewFormContentProps) => {
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
          {...register('title')}
          value={watch('title') ?? ''}
          id="title"
          placeholder="Ej: Excelente atención y profesionalismo"
          className="mt-1"
          aria-invalid={Boolean(errors?.title)}
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
          {...register('description')}
          value={watch('description') ?? ''}
          id="description"
          placeholder="Ej: Excelente atención y profesionalismo"
          className="mt-1"
          disabled={isReadOnly}
          aria-invalid={Boolean(errors?.description)}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors?.description?.message as string}</p>
        )}
      </div>
      <div className="space-y-2">
        <FormLabel label="Calificación general" isRequired={!isReadOnly} />

        <Controller
          name="rating"
          control={form.control}
          render={({ field }) =>
            isReadOnly ? (
              <StarRatingDisplay rating={Number(field.value)} />
            ) : (
              <StarRatingInput
                value={Number(field.value)}
                onChange={field.onChange}
                isError={Boolean(errors.rating)}
                errorMessage={errors.rating ? errors.rating.message : undefined}
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
