'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { useLogin } from './hooks';
import { GoogleIcon } from '../../common/GoogleIcon';

export const Login = () => {
  const { register, handleSubmit, onSubmit, errors, loading, cooldownRemaining, onGoogleSignIn } =
    useLogin();

  const isDisabled = loading || cooldownRemaining > 0;

  return (
    <div className="space-y-6 mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-ink dark:text-reviuy-gray-100">
          Iniciar Sesión
        </h1>
      </div>

      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={onGoogleSignIn}
        disabled={loading}
      >
        <GoogleIcon />
        Continuar con Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-muted-gray dark:text-reviuy-gray-400">O continúa con</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-3 size-4 text-gray-400" />
            <Input
              type="email"
              id="email"
              placeholder="tu@email.com"
              className="pl-10"
              {...register('email')}
            />
          </div>
          {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
          <label
            htmlFor="email"
            className="text-sm text-muted-gray dark:text-reviuy-gray-400 block"
          >
            Te enviaremos un enlace mágico al correo que ingreses para acceder a la plataforma
          </label>
        </div>

        <Button variant="default" type="submit" disabled={isDisabled} className="w-full">
          {loading ? (
            <>
              <div className="animate-spin rounded-full size-4 border-b-2 border-white mr-2"></div>
              Enviando enlace…
            </>
          ) : cooldownRemaining > 0 ? (
            `Esperá ${cooldownRemaining}s para reenviar`
          ) : (
            'Enviar enlace mágico'
          )}
        </Button>
      </form>
    </div>
  );
};
