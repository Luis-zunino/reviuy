'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { PageStateWrapper } from '@/components/common';
import { useCreateRealEstate } from './hook';

export const CreateRealEstate = () => {
  const { handleSubmit, onSubmit, register, errors, isSubmitting } = useCreateRealEstate();
  return (
    <PageStateWrapper
      title="Agregar una nueva Inmobiliaria"
      subtitle="Agregar una nueva inmobiliaria para que pueda ser calificada por los usuarios."
    >
      <Card>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Nombre *
              </Label>
              <Input
                id="name"
                placeholder="Ej: Inmobiliaria ABC"
                {...register('name', {
                  required: 'El nombre es obligatorio',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres',
                  },
                  maxLength: {
                    value: 100,
                    message: 'El nombre no puede tener más de 100 caracteres',
                  },
                })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={() => handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear Inmobiliaria'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageStateWrapper>
  );
};
