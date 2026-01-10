import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { ContactFormValues } from './types';

export const useContactForm = () => {
  const { isAuthenticated } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: { name: '', email: '', message: '' },
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          loginEmail: isAuthenticated ? localStorage.getItem('email') : '',
        }),
      });

      if (!res.ok) {
        setError('No se pudo enviar el mensaje');
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setSuccess('El mensaje se envio correctamente');
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
  };
};
