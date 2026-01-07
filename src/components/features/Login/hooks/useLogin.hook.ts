import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { LoginFormValues } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>();

  const [loading, setLoading] = useState(false);
  const { signInWithEmail } = useAuthContext();

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);

    try {
      await signInWithEmail(data.email);

      toast.success('¡Revisa tu correo!', {
        description:
          'Te hemos enviado un enlace mágico para iniciar sesión. Haz click en el enlace del correo para completar tu autenticación.',
        duration: 5000,
      });

      reset();
    } catch (error: unknown) {
      console.error('Error al enviar magic link:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Hubo un problema al enviar el enlace de acceso. Inténtalo de nuevo.';

      toast.error('Error al enviar el enlace', {
        description: errorMessage,
        duration: 4000,
      });
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
  };
};
