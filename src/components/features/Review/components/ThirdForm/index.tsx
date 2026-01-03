import { FormLabel } from '@/components/common/Form';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import type { RealEstate } from '@/types';
import { RealEstateSearchInput } from '@/components/common';
import { useGetRealEstateById } from '@/services';
import { validateText } from '@/utils';
import type { ThirdFormProps } from './types';

export const ThirdForm = (props: ThirdFormProps) => {
  const { control, defaultRealEstateId, errors } = props;
  const [selectedRealEstate, setSelectedRealEstate] = useState<RealEstate | null>(null);
  const { data, isLoading } = useGetRealEstateById(defaultRealEstateId ?? '');

  useEffect(() => {
    if (!data) return;
    setSelectedRealEstate(data);
  }, [data]);

  if (isLoading) return <div className="flex flex-col flex-1">Cargando</div>;
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <FormLabel
          htmlFor="real_estate_experience"
          label="Experiencia con inmobiliaria/propietario"
        />
        <Controller
          name="real_estate_experience"
          control={control}
          rules={{
            validate: (value) => {
              if (!value) return true;
              const validation = validateText(value);
              return validation.isValid || validation.message;
            },
          }}
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value ?? ''}
              placeholder="Comparte tu experiencia con la inmobiliaria o propietario..."
              rows={3}
              className={errors?.real_estate_experience ? 'border-red-500' : ''}
            />
          )}
        />
        {errors?.real_estate_experience && (
          <p className="text-red-500 text-sm">{errors.real_estate_experience.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <FormLabel htmlFor="real_estate_id" label="Inmobiliaria" />
        <div className="text-sm text-gray-500 mb-2">
          Selecciona la inmobiliaria asociada a esta reseña (opcional)
        </div>

        <Controller
          name="real_estate_id"
          control={control}
          render={({ field }) => (
            <RealEstateSearchInput
              value={field.value ?? ''}
              selectedRealEstate={selectedRealEstate}
              onRealEstateSelect={(realEstate) => {
                setSelectedRealEstate(realEstate);
                field.onChange(realEstate?.id ?? '');
              }}
              onChange={(value) => {
                if (!value) {
                  setSelectedRealEstate(null);
                  field.onChange('');
                }
              }}
              isModal
              name="real_estate_id"
            />
          )}
        />
      </div>
    </div>
  );
};
