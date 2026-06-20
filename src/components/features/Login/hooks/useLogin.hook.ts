import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formLoginSchema, type FormLoginSchema } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  COOLDOWN_SECONDS,
  RATE_LIMIT_COOLDOWN_SECONDS,
  getPersistedCooldown,
  persistCooldown,
  clearPersistedCooldown,
} from '../utils/login-cooldown.util';

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
  const [cooldownRemaining, setCooldownRemaining] = useState(getPersistedCooldown);
  const cooldownEndRef = useRef<number | null>(null);
  const { signInWithEmail, signInWithGoogle } = useAuthContext();

  // Sincroniza el ref con el cooldown persistido al montar
  useEffect(() => {
    const persisted = getPersistedCooldown();
    if (persisted > 0) {
      cooldownEndRef.current = Date.now() + persisted * 1000;
    }
  }, []);

  // Tick del cooldown — corre SIEMPRE, el ref decide si hay cooldown activo
  useEffect(() => {
    const interval = setInterval(() => {
      if (!cooldownEndRef.current) return;

      const remaining = Math.max(0, Math.ceil((cooldownEndRef.current - Date.now()) / 1000));
      setCooldownRemaining(remaining);

      if (remaining <= 0) {
        cooldownEndRef.current = null;
        clearPersistedCooldown();
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const startCooldown = useCallback((seconds: number = COOLDOWN_SECONDS) => {
    const end = Date.now() + seconds * 1000;
    cooldownEndRef.current = end;
    setCooldownRemaining(seconds);
    persistCooldown(seconds * 1000);
  }, []);

  const onGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
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
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormLoginSchema) => {
    setLoading(true);

    try {
      await signInWithEmail(data.email);

      toast.success('¡Revisá tu correo!', {
        description: 'Te enviamos un enlace mágico. Hacé click en el enlace para iniciar sesión.',
        duration: 5000,
      });

      reset();
      startCooldown(COOLDOWN_SECONDS);
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

      if (isRateLimit) {
        startCooldown(RATE_LIMIT_COOLDOWN_SECONDS);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    loading,
    cooldownRemaining,
    onGoogleSignIn,
  };
};
