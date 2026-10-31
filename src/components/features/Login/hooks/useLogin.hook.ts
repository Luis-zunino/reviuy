'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formLoginSchema, type FormLoginSchema } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailServer, signInWithGoogleServer } from '@/shared/auth/auth-server-actions';

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormLoginSchema>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const onGoogleSignIn = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const { url } = await signInWithGoogleServer();
      globalThis.location.href = url;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Hubo un problema al iniciar sesión con Google. Inténtalo de nuevo.';
      toast.error('Error al iniciar sesión', {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormLoginSchema) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      await signInWithEmailServer(data.email);

      toast.success('¡Revisá tu correo!', {
        description: 'Te enviamos un enlace mágico. Hacé click en el enlace para iniciar sesión.',
        duration: 5000,
      });

      reset();
    } catch (error: unknown) {
      const isRateLimit =
        error instanceof Error &&
        ('status' in error
          ? (error as Record<string, unknown>).status === 429
          : /rate\s*limit/i.test(error.message));

      const errorMessage = isRateLimit
        ? 'Esperá un par de minutos antes de pedir otro enlace. Revisá también tu carpeta de spam.'
        : error instanceof Error
          ? error.message
          : 'Hubo un problema al enviar el enlace de acceso. Intentalo de nuevo.';

      toast.error('Error al enviar el enlace', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    loading,
    onGoogleSignIn,
  };
};
