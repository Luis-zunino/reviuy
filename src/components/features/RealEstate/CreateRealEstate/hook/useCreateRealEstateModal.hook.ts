import { useUser } from '@/hooks';
import { useCreateRealEstateHook } from '@/services';
import type { RealEstateInsert } from '@/types';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { validateText } from '@/utils';
import type { UseCreateRealEstateModalProps, CreateRealEstateFormData } from './types';

export const useCreateRealEstateModal = (props: UseCreateRealEstateModalProps) => {
  const { onOpenChange } = props;
  const { userId } = useUser();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRealEstateFormData>();

  const { mutateAsync, isPending } = useCreateRealEstateHook();

  const onSubmit = async (data: CreateRealEstateFormData) => {
    if (!userId) {
      toast.error('Debes estar autenticado para crear una inmobiliaria');
      return;
    }

    const validation = validateText(data.name);
    if (!validation.isValid) {
      toast.error(validation.message || 'El nombre contiene contenido no permitido');
      return;
    }

    try {
      const realEstateData: RealEstateInsert = {
        name: data.name,
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

  return { control, handleFormSubmit, isSubmitting: isPending, errors };
};
