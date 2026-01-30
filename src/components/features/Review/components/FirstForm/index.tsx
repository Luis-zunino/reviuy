import { AddressSearchInput } from '@/components/common/AddressSearchInput';
import { FormLabel } from '@/components/common/Form/FormLabel';
import { StarRatingInput } from '@/components/common/StarRating';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  const { form, onSelectAddress, ...rest } = props;
  const {
    formState: { errors },
    control,
    watch,
    register,
  } = form;
  const lat = watch('latitude') ?? 0;
  const lon = watch('longitude') ?? 0;
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
        <FormLabel htmlFor="title" label="Breve descripción" isRequired />
        <Input
          {...register('title')}
          value={watch('title') ?? ''}
          placeholder="Ej: Excelente ubicación, departamento muy cómodo"
          aria-invalid={Boolean(errors?.title)}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <FormLabel htmlFor="property_type" label="Tipo de propiedad" isRequired />
            <Controller
              name="property_type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(e) => {
                    const value = e.length > 0 ? e : field.value;
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger className="w-full" aria-invalid={Boolean(errors?.property_type)}>
                    <SelectValue
                      placeholder="Selecciona el tipo de propiedad"
                      defaultValue={field.value}
                    />
                  </SelectTrigger>
                  <SelectContent className="w-full">
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
            <FormLabel htmlFor="apartment_number" label="Número de apartamento" />
            <Input
              {...register('apartment_number')}
              value={watch('apartment_number') ?? ''}
              placeholder="Ej: 3A, Piso 2, Apt 12"
            />
            {errors.apartment_number && (
              <p className="text-red-500 text-sm">{errors.apartment_number.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-between">
          <div className="space-y-2">
            <FormLabel label="Calificación general" isRequired />
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <StarRatingInput
                  value={field.value}
                  onChange={field.onChange}
                  className="flex-row gap-6 items-center"
                  isError={Boolean(errors.rating)}
                  errorMessage={errors.rating ? errors.rating.message : undefined}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <FormLabel label="Calificación de la zona" />
            <Controller
              name="zone_rating"
              control={control}
              render={({ field }) => (
                <StarRatingInput
                  value={field.value || 0}
                  onChange={field.onChange}
                  className="flex-row gap-6 items-center"
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <FormLabel htmlFor="description" label="Cuentanos más" isRequired />
        <Textarea
          {...register('description')}
          placeholder="Comparte los detalles de tu experiencia viviendo aquí..."
          rows={4}
          value={watch('description')}
          aria-invalid={Boolean(errors?.description)}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
    </div>
  );
};
