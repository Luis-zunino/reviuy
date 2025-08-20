'use client';

import { Loader2 } from 'lucide-react';
import { Controller } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/common/StarRating';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { redirect } from 'next/navigation';
import { AddressSearchInput } from '../../common/AddressSearchInput';
import { PagesUrls } from '@/enums';
import { PropertyType } from './enums';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCreateReviewForm } from './hooks';
import { MapComponent } from '@/components/common';

export const CreateReview = () => {
  const {
    handleSubmit,
    onSubmit,
    setSelectedAddress,
    control,
    errors,
    isSubmitting,
    selectedAddress,
  } = useCreateReviewForm();

  return (
    <div className="container mx-auto py-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Comparte tu experiencia</CardTitle>
            <CardDescription>
              Busca una dirección y comparte tu experiencia para ayudar a otros.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address" aria-required="true">
                Dirección<span className="text-red-500">*</span>
              </Label>
              <AddressSearchInput
                handleOnClick={setSelectedAddress}
                placeholder="Buscar direcciones..."
              />
              {selectedAddress?.position ? (
                <MapComponent
                  lat={selectedAddress?.position.lat}
                  lon={selectedAddress?.position.lon}
                />
              ) : null}
            </div>

            <fieldset className="space-y-6 disabled:opacity-50">
              <div className="flex flex-col gap-3">
                <Label htmlFor="propertyType">
                  Tipo de propiedad<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="propertyType"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PropertyType.APARTMENT}>Apartamento</SelectItem>
                        <SelectItem value={PropertyType.HOUSE}>Casa</SelectItem>
                        <SelectItem value={PropertyType.ROOM}>Habitación</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.propertyType && <span className="text-red-500">Campo requerido</span>}
              </div>

              <h3>¿Qué tan agradable es la habitación en invierno?</h3>
              <Controller
                name="winterComfort"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} className="flex" onValueChange={field.onChange}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="hot" id="w1" />
                      <Label htmlFor="w1">Caluroso</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="comfortable" id="w2" />
                      <Label htmlFor="w2">Comfortable</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cold" id="w3" />
                      <Label htmlFor="w3">Frío</Label>
                    </div>
                  </RadioGroup>
                )}
              />

              <h3>¿Qué tan agradable es la habitación en verano?</h3>
              <Controller
                name="summerComfort"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} className="flex" onValueChange={field.onChange}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="hot" id="s1" />
                      <Label htmlFor="s1">Caluroso</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="comfortable" id="s2" />
                      <Label htmlFor="s2">Comfortable</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cold" id="s3" />
                      <Label htmlFor="s3">Frío</Label>
                    </div>
                  </RadioGroup>
                )}
              />

              <h3>¿Problemas de humedad?</h3>
              <Controller
                name="humidity"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} className="flex" onValueChange={field.onChange}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="yes" id="h1" />
                      <Label htmlFor="h1">Sí</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="no" id="h2" />
                      <Label htmlFor="h2">No</Label>
                    </div>
                  </RadioGroup>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="description">
                  Tu experiencia<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Describe tu experiencia, pros y contras..."
                      required
                      rows={5}
                    />
                  )}
                />
                {errors.description && <span className="text-red-500">Campo requerido</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="agencyExperience">Tu experiencia con la inmobiliaria</Label>
                <Controller
                  name="agencyExperience"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Describe tu experiencia con la inmobiliaria..."
                      rows={5}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    Calificación del lugar<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="rating"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <StarRating rating={field.value} onRatingChange={field.onChange} />
                    )}
                  />
                  {errors.rating && <span className="text-red-500">Campo requerido</span>}
                </div>
                <div className="space-y-2">
                  <Label>
                    Calificación de la zona<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="zoneRating"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <StarRating rating={field.value} onRatingChange={field.onChange} />
                    )}
                  />
                  {errors.zoneRating && <span className="text-red-500">Campo requerido</span>}
                </div>
              </div>
            </fieldset>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-6">
            <Button type="submit" disabled={isSubmitting || !selectedAddress}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => redirect(PagesUrls.HOME)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
