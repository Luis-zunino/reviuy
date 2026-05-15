import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formLoginSchema, type FormLoginSchema } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { zodResolver } from '@hookform/resolvers/zod';

const TERMS_VERSION = 'v1';

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormLoginSchema>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: '',
      acceptedTerms: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuthContext();

  const onGoogleSignIn = async () => {
    const hasAcceptedTerms = getValues('acceptedTerms');

    setLoading(true);
    try {
      await signInWithGoogle({
        acceptedTerms: hasAcceptedTerms,
        termsAcceptedAt: new Date().toISOString(),
        termsVersion: TERMS_VERSION,
      });
    } catch (error: unknown) {
      console.error('Error al iniciar sesión con Google:', error);
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
      await signInWithEmail(data.email, {
        acceptedTerms: data.acceptedTerms,
        termsAcceptedAt: new Date().toISOString(),
        termsVersion: TERMS_VERSION,
      });

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
    onGoogleSignIn,
  };
};
