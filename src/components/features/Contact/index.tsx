'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useContactForm } from './hooks';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export const Contact = () => {
  const { register, handleSubmit, errors, isSubmitting, onSubmit, isAuthenticated, watch } =
    useContactForm();

  return (
    <Card className="py-10 px-4 flex flex-1">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4 flex-1">
          <div className="flex flex-col flex-1">
            <Label className="text-sm font-medium" htmlFor="email">
              Email <span className="text-xs text-red-500">*</span>
            </Label>
            <Input
              type="email"
              {...register('email')}
              className="mt-1 w-full"
              aria-invalid={errors.email ? 'true' : 'false'}
              placeholder="tu@email.com"
              value={watch('email')}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col flex-1">
            <Label className="block text-sm font-medium" htmlFor="name">
              Nombre <span className="text-xs text-red-500">*</span>
            </Label>
            <Input
              {...register('name')}
              className="mt-1 w-full block"
              aria-invalid={errors.name ? 'true' : 'false'}
              placeholder="Tu nombre"
              value={watch('name')}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium" htmlFor="message">
            Mensaje <span className="text-xs text-red-500">*</span>
          </Label>
          <Textarea
            {...register('message')}
            className="mt-1 block w-full h-32"
            aria-invalid={errors.message ? 'true' : 'false'}
            placeholder="Escribe tu mensaje aquí..."
          />
          {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>}
        </div>

        <div className="flex  flex-col items-end justify-between">
          {!isAuthenticated && (
            <p className="text-sm text-yellow-600 mb-2">
              Debes iniciar sesión para enviar este formulario.
            </p>
          )}
          <Button
            disabled={isSubmitting || !isAuthenticated}
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
