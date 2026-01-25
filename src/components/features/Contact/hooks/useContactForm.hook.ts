import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { FormContactSchema, formContactSchema } from './types';
import { zodResolver } from '@hookform/resolvers/zod';

export const useContactForm = () => {
  const { isAuthenticated } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormContactSchema>({
    defaultValues: { name: '', email: '', message: '' },
    resolver: zodResolver(formContactSchema),
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormContactSchema) => {
    setSuccess(null);
    setError(null);

    if (!isAuthenticated) {
      setError('Debes iniciar sesión para enviar un mensaje');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData.error || 'No se pudo enviar el mensaje');
        return;
      }

      setSuccess('El mensaje se envió correctamente');
      reset();
    } catch (error) {
      console.error('Error enviando mensaje de contacto:', error);
      setError('Error al enviar el mensaje. Por favor, intenta nuevamente.');
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    success,
    error,
    onSubmit,
    isAuthenticated,
    watch,
  };
};
