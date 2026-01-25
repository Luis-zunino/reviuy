import React from 'react';
import { Filter } from 'lucide-react';
import { StarRatingInput } from '@/components/common';
import { Button } from '@/components/ui/button';
import type { RealEstateSidebarProps } from './types';
import { Label } from '@/components/ui/label';
import { Form } from '@/components/ui/form';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';

export const RealEstateSidebar: React.FC<RealEstateSidebarProps> = ({
  form,
  handleClearFilters,
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <div className="flex items-center gap-2 font-bold text-foreground mb-6">
          <Filter className="w-5 h-5 text-gray-700" />
          <h2 className="text-gray-900">Filtros</h2>
        </div>
        <div className="mb-2">
          <Input {...form.register('real_estate_name')} placeholder="Ej: Inmobiliaria ABC" />
        </div>
        <div className="mb-6">
          <Label className="block text-gray-700 mb-3">Calificación mínima</Label>
          <Controller
            name="rating"
            control={form.control}
            render={({ field }) => (
              <StarRatingInput
                value={Number(field.value)}
                onChange={field.onChange}
                size="sm"
                isError={Boolean(form.formState.errors.rating)}
                errorMessage={
                  form.formState.errors.rating ? form.formState.errors.rating.message : undefined
                }
              />
            )}
          />
        </div>

        <Button onClick={handleClearFilters}>Limpiar filtros</Button>
      </form>
    </Form>
  );
};
