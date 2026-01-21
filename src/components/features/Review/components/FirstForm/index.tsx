import { AddressSearchInput } from '@/components/common/AddressSearchInput';
import { FormLabel } from '@/components/common/Form/FormLabel';
import { StarRatingInput } from '@/components/common/StarRating';
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
import { PropertyType } from '@/enums';
import { FormReviewSchema } from '../../constants';

export const FirstForm = (props: FirstFormProps) => {
  const { control, errors, form, onSelectAddress, ...rest } = props;
  const lat = form.watch('latitude') ?? 0;
  const lon = form.watch('longitude') ?? 0;
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <FormLabel htmlFor="address_text" label="Dirección" isRequired />
        <AddressSearchInput<FormReviewSchema>
          name="address_text"
          form={form}
          onSelect={onSelectAddress}
          placeholder="Busca una direccion..."
          className={{ container: 'w-full', item: 'min-w-full' }}
          {...rest}
        />
        {lat.length > 0 || lon.length > 0 ? (
          <div className="mt-4">
            <LazyMapComponent key={lat + lon} lat={Number(lat)} lon={Number(lon)} />
          </div>
        ) : null}
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
      <div className="flex flex-col sm:flex-row gap-6 w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="space-y-2">
            <FormLabel htmlFor="propertyType" label="Tipo de propiedad" isRequired />
            <Controller
              name="property_type"
              control={control}
              rules={{ required: 'Selecciona el tipo de propiedad' }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Selecciona el tipo de propiedad"
                      defaultValue={field.value}
                    />
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
            <FormLabel htmlFor="apartment_number" label="Número de apartamento (opcional)" />
            <Controller
              name="apartment_number"
              control={control}
              rules={{
                maxLength: { value: 10, message: 'El número de apartamento es muy largo' },
              }}
              render={({ field }) => (
                <Input {...field} value={field.value ?? ''} placeholder="Ej: 3A, Piso 2, Apt 12" />
              )}
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 justify-between">
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
