'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import React from 'react';
import { useLogin } from './hooks';
import Link from 'next/link';
import { GoogleIcon } from './GoogleIcon';

export const Login = () => {
  const { register, handleSubmit, onSubmit, errors, loading, onGoogleSignIn } = useLogin();

  return (
    <div className="space-y-6 mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
      </div>

      <Button variant="outline" className="w-full flex items-center gap-2" onClick={onGoogleSignIn}>
        <GoogleIcon />
        Continuar con Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">O continúa con</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-600 mb-6 font-weight-200">
            Te enviaremos un enlace mágico al correo que ingreses para acceder a la plataforma{' '}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              id="email"
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
        Al continuar, aceptas los{' '}
        <Link href="/terminos" className="text-blue-600 hover:text-blue-800 underline">
          términos y condiciones
        </Link>{' '}
        y la{' '}
        <Link href="/privacidad" className="text-blue-600 hover:text-blue-800 underline">
          política de privacidad
        </Link>
      </div>
    </div>
  );
};
