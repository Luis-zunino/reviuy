'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import React from 'react';
import { useLogin } from './hooks';
import Link from 'next/link';

export const Login = () => {
  const { register, handleSubmit, onSubmit, errors, loading } = useLogin();

  return (
    <div className="space-y-6 mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
        <p className="text-gray-600">Te enviaremos un enlace mágico para acceder</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              placeholder="tu@email.com"
              className="pl-10"
              {...register('email', {
                required: 'Por favor ingresa tu email.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Ingresa un email válido.',
                },
              })}
            />
          </div>
          {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
        </div>

        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="acceptedTerms"
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              {...register('acceptedTerms', {
                required: 'Debes aceptar los términos y condiciones.',
              })}
            />
            <Label htmlFor="acceptedTerms" className="text-sm text-gray-700 leading-relaxed">
              Acepto los{' '}
              <Link href="/terminos" className="text-blue-600 hover:text-blue-800 underline">
                términos y condiciones
              </Link>{' '}
              y la{' '}
              <Link href="/privacidad" className="text-blue-600 hover:text-blue-800 underline">
                política de privacidad
              </Link>
            </Label>
          </div>
          {errors.acceptedTerms && (
            <div className="text-red-500 text-sm">{errors.acceptedTerms.message}</div>
          )}
        </div>

        <Button variant="default" type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enviando enlace...
            </>
          ) : (
            'Enviar enlace mágico'
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>Al continuar, aceptas recibir un enlace de acceso por correo electrónico.</p>
      </div>
    </div>
  );
};
