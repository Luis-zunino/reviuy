import { useForm } from 'react-hook-form';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { FormContactSchema, formContactSchema } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSendContactMessage } from '@/modules/content/presentation';
import { toast } from 'sonner';

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

  const { mutateAsync: sendMessage } = useSendContactMessage();
  const onSubmit = async (data: FormContactSchema) => {
    await sendMessage(data, {
      onSuccess: () => {
        toast.success('El mensaje se envió correctamente');
        reset();
      },
      onError: (error) => {
        toast.error(JSON.stringify(error));
      },
    });
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    isAuthenticated,
    watch,
  };
};
