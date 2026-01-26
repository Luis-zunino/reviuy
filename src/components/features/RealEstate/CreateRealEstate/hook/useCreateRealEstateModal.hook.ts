import { useCreateRealEstateHook } from '@/services';
import type { RealEstateInsert } from '@/types';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { validateText } from '@/utils';
import {
  type UseCreateRealEstateModalProps,
  formCreateRealEstateSchema,
  FormCreateRealEstateSchema,
} from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { zodResolver } from '@hookform/resolvers/zod';

export const useCreateRealEstateModal = (props: UseCreateRealEstateModalProps) => {
  const { onOpenChange, name } = props;
  const { userId } = useAuthContext();

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormCreateRealEstateSchema>({
    resolver: zodResolver(formCreateRealEstateSchema),
  });

  const { mutateAsync, isPending } = useCreateRealEstateHook();

  const onSubmit = async (data: FormCreateRealEstateSchema) => {
    if (!userId) {
      toast.error('Debes estar autenticado para crear una inmobiliaria');
      return;
    }

    const validation = validateText(data[name]);
    if (!validation.isValid) {
      toast.error(validation.message || 'El nombre contiene contenido no permitido');
      return;
    }

    try {
      const realEstateData: RealEstateInsert = {
        name: data[name],
        created_by: userId,
      };

      const newRealEstate = await mutateAsync(realEstateData, {
        onSuccess: () => {
          toast.success('Inmobiliaria creada exitosamente');
          reset();
        },
        onError: () => {
          toast.error('Error inesperado', {
            description: 'No se pudo crear la inmobiliaria. Inténtalo de nuevo.',
          });
        },
      });

      if (!newRealEstate) toast.success('Inmobiliaria creada exitosamente');
      reset();
    } catch (error) {
      console.error('Error creating real estate:', error);
      toast.error('Error al crear la inmobiliaria. Por favor, inténtalo de nuevo.');
    } finally {
      onOpenChange(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e);
  };

  return { register, handleFormSubmit, isSubmitting: isPending, errors, watch };
};
