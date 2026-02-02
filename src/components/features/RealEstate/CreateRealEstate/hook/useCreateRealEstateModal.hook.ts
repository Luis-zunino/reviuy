import { useCreateRealEstateHook } from '@/services';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { UseCreateRealEstateModalProps } from './types';
import { formCreateRealEstateSchema, FormCreateRealEstateSchema } from '@/schemas';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { zodResolver } from '@hookform/resolvers/zod';

export const useCreateRealEstateModal = (props: UseCreateRealEstateModalProps) => {
  const { onOpenChange, name, defaultValues } = props;
  const { userId } = useAuthContext();

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormCreateRealEstateSchema>({
    defaultValues,
    resolver: zodResolver(formCreateRealEstateSchema),
  });

  const { mutateAsync, isPending } = useCreateRealEstateHook();

  const onSubmit = async (data: FormCreateRealEstateSchema) => {
    if (!userId) {
      toast.warning('Debes estar autenticado para crear una inmobiliaria');
      return;
    }

    const realEstateData = {
      real_estate_name: data[name],
    };

    const newRealEstate = await mutateAsync(realEstateData, {
      onSuccess: () => {
        toast.success('Inmobiliaria creada');
        reset();
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.name, {
          description: error.message,
        });
        return;
      },
    });

    if (!newRealEstate) toast.success('Inmobiliaria creada');
    reset();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e);
  };

  return { register, handleFormSubmit, isSubmitting: isPending, errors, watch };
};
