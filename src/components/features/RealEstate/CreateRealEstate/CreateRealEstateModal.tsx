import { FormLabel } from '@/components/common/Form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useCreateRealEstateModal } from './hook';
import { validateText } from '@/utils';
import type { CreateRealEstateModalProps } from './types';

export const CreateRealEstateModal = (props: CreateRealEstateModalProps) => {
  const { isOpen, onOpenChange } = props;
  const { control, handleFormSubmit, isSubmitting, errors } = useCreateRealEstateModal({
    onOpenChange,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            Crear una nueva Inmobiliaria
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6" id="create-real-estate-form">
          <div className="space-y-2">
            <div className="space-y-2">
              <FormLabel htmlFor="name" label="Nombre de la inmobiliaria" />

              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'El nombre es obligatorio',
                  validate: (value) => {
                    const validation = validateText(value || '');
                    return validation.isValid || validation.message;
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ej: Inmobiliaria ABC"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
          </div>
        </form>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} form="create-real-estate-form">
            {isSubmitting ? 'Creando...' : 'Crear Inmobiliaria'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
