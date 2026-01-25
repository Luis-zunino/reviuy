'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { PageWithSidebar } from '@/components/common';
import { useCreateRealEstate } from './hook';

export const CreateRealEstate = () => {
  const { handleSubmit, onSubmit, register, errors, isSubmitting } = useCreateRealEstate();
  return (
    <PageWithSidebar
      title="Agregar una nueva Inmobiliaria"
      description="Agregar una nueva inmobiliaria para que pueda ser calificada por los usuarios."
      authIsRequired={true}
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
                {...register('name')}
                aria-invalid={Boolean(errors?.name)}
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
    </PageWithSidebar>
  );
};
