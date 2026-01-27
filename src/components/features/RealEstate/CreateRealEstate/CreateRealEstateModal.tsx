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

export const CreateRealEstateModal = (props: CreateRealEstateModalProps) => {
  const {
    name,
    isOpen,
    onOpenChange,
    showModal = false,
    triggerComponentModal: TriggerModalComponent,
    defaultValues,
  } = props;
  const { register, handleFormSubmit, isSubmitting, errors, watch } = useCreateRealEstateModal({
    onOpenChange,
    name,
    defaultValues,
  });

  return (
    <>
      {showModal && TriggerModalComponent ? <TriggerModalComponent /> : null}
      <Dialog open={isOpen} onOpenChange={(open) => onOpenChange(open)}>
        <DialogContent className="w-full md:w-1/2 p-4" aria-describedby="create-real-estate">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Crear una nueva Inmobiliaria
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-6" id="create-real-estate-form">
            <div className="space-y-2">
              <div className="space-y-2">
                <FormLabel htmlFor={name} label="Nombre" isRequired />
                <Input
                  {...register(name)}
                  placeholder="Ej: Inmobiliaria ABC"
                  aria-invalid={Boolean(errors[name])}
                  value={watch(name)}
                />
                {errors[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
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
