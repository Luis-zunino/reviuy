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
  return (
    <>
      <div>
        <FormLabel htmlFor="title" label="Título de la reseña" isRequired={!isReadOnly} />
        <Controller
          name={'title' as Path<RR>}
          control={form.control}
          rules={{
            required: 'El título es obligatorio',
            validate: (value) => {
              const validation = validateText(String(value) || '');
              return validation.isValid || validation.message;
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              id="title"
              name="title"
              placeholder="Ej: Excelente atención y profesionalismo"
              required
              className="mt-1"
              disabled={isReadOnly}
            />
          )}
        />
      </div>

      <div>
        <FormLabel
          htmlFor="description"
          label="Descripcion de la reseña"
          isRequired={!isReadOnly}
        />
        <Controller
          name={'description' as Path<RR>}
          control={form.control}
          rules={{
            required: 'La descripción es obligatoria',
            validate: (value) => {
              const validation = validateText(String(value) || '');
              return validation.isValid || validation.message;
            },
          }}
          render={({ field }) => (
            <Textarea
              {...field}
              id="description"
              name="description"
              placeholder="Ej: Excelente atención y profesionalismo"
              required
              className="mt-1"
              disabled={isReadOnly}
            />
          )}
        />
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
      </div>
    </>
  );
};
