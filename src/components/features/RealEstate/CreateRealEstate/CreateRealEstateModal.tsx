'use client';

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
import { useCreateRealEstateModal } from './hook';
import type { CreateRealEstateModalProps } from './types';
import { Building2, Plus } from 'lucide-react';

export const CreateRealEstateModal = (props: CreateRealEstateModalProps) => {
  const { isOpen, onOpenChange, defaultValue, handleCreateNew, isModal, showModal } = props;
  const { register, handleFormSubmit, isSubmitting, errors, watch } = useCreateRealEstateModal({
    onOpenChange,
  });

  return (
    <>
      {showModal ? (
        <div className="z-10 mt-1 w-full min-w-87.5 rounded-md bg-white">
          <div className="p-4 text-center">
            <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-3">
              No encontramos la inmobiliaria {defaultValue}
            </p>
            <Button
              type="button"
              onClick={() => handleCreateNew(isModal)}
              variant="outline"
              size="sm"
              className="w-full"
              icon={Plus}
            >
              Agregar nueva inmobiliaria
            </Button>
          </div>
        </div>
      ) : null}
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
                <Input
                  {...register('name')}
                  placeholder="Ej: Inmobiliaria ABC"
                  aria-invalid={Boolean(errors?.name)}
                  value={watch('name')}
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
    </>
  );
};
