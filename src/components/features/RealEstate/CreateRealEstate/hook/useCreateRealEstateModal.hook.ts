import { useCreateRealEstateHook } from '@/modules/real-estates/presentation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { UseCreateRealEstateModalProps } from './types';
import { formCreateRealEstateSchema, FormCreateRealEstateSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

export const useCreateRealEstateModal = (props: UseCreateRealEstateModalProps) => {
  const { onOpenChange, name, defaultValues } = props;

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
