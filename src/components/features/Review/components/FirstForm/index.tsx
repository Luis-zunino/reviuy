import { AddressSearchInput } from '@/components/common/AddressSearchInput';
import { FormLabel } from '@/components/common/Form/FormLabel';
import { StarRatingInput } from '@/components/common/StarRating';
import { PropertyType } from '@/components/features/Review/CreateReview/enums';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { validateText } from '@/utils';
import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LazyMapComponent } from '@/components/common';
import type { FirstFormProps } from './types';

export const FirstForm = (props: FirstFormProps) => {
  const { control, errors, selectedAddress, handleAddressSelect } = props;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <FormLabel htmlFor="address_text" label="Dirección" isRequired />
        <AddressSearchInput
          handleOnClick={handleAddressSelect}
          name="address_text"
          control={control}
          defaultValue={selectedAddress?.display_name}
          rules={{
            required: 'La dirección es obligatoria',
          }}
        />
        {selectedAddress?.position && (
          <div className="mt-4">
            <LazyMapComponent
              lat={selectedAddress.position.lat ?? 0}
              lon={selectedAddress.position.lon ?? 0}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="title" label="Título de tu reseña" isRequired />
        <Controller
          name="title"
          control={control}
          rules={{
            required: 'El título es obligatorio',
            minLength: {
              value: 10,
              message: 'El título debe tener al menos 10 caracteres',
            },
            maxLength: { value: 100, message: 'El título no puede exceder 100 caracteres' },
            validate: (value) => {
              const validation = validateText(value || '');
              return validation.isValid || validation.message;
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Ej: Excelente ubicación, departamento muy cómodo"
              className={errors.title ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div className="flex gap-2 justify-between">
        <div className="space-y-2">
          <FormLabel htmlFor="propertyType" label="Tipo de propiedad" isRequired />
          <Controller
            name="property_type"
            control={control}
            rules={{ required: 'Selecciona el tipo de propiedad' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de propiedad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PropertyType.APARTMENT}>Apartamento</SelectItem>
                  <SelectItem value={PropertyType.HOUSE}>Casa</SelectItem>
                  <SelectItem value={PropertyType.ROOM}>Habitación</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.property_type && (
            <p className="text-red-500 text-sm">{errors.property_type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <FormLabel label="Calificación general" isRequired />

          <Controller
            name="rating"
            control={control}
            rules={{
              required: 'La calificación es obligatoria',
              min: { value: 1, message: 'Selecciona al menos 1 estrella' },
            }}
            render={({ field }) => (
              <StarRatingInput value={field.value || 0} onChange={field.onChange} required />
            )}
          />
          {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
        </div>

        <div className="space-y-2">
          <FormLabel label="Calificación de la zona" />
          <Controller
            name="zone_rating"
            rules={{
              required: 'La calificacion de la zona es requerido',
              min: { value: 1, message: 'Selecciona al menos 1 estrella' },
            }}
            control={control}
            render={({ field }) => (
              <StarRatingInput value={field.value || 0} onChange={field.onChange} required />
            )}
          />
        </div>
      </div>
      <div className="space-y-2">
        <FormLabel htmlFor="description" label="Describe tu experiencia" isRequired />

        <Controller
          name="description"
          control={control}
          rules={{
            required: 'La descripción es obligatoria',
            minLength: {
              value: 20,
              message: 'La descripción debe tener al menos 20 caracteres',
            },
            maxLength: {
              value: 1000,
              message: 'La descripción no puede exceder 1000 caracteres',
            },
            validate: (value) => {
              const validation = validateText(value || '');
              return validation.isValid || validation.message;
            },
          }}
          render={({ field }) => (
            <Textarea
              {...field}
              required
              placeholder="Comparte los detalles de tu experiencia viviendo aquí..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
    </div>
  );
};
