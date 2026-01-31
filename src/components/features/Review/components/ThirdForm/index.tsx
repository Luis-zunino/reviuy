import { FormLabel } from '@/components/common/Form';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import type { ThirdFormProps } from './types';
import { RealEstateWitheVotes } from '@/types';
import { AsyncSearchSelect } from '@/components/common/AsyncSearchSelect';
import { FormReviewSchema } from '@/schemas';
import { CreateRealEstateModal } from '@/components/features/RealEstate/CreateRealEstate/CreateRealEstateModal';
import { useThirdForm } from './hooks';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ThirdForm = (props: ThirdFormProps) => {
  const { form, open, setOpen, handleClear, onSelect, queryValue } = props;
  const {
    formState: { errors },
    watch,
    register,
  } = form;
  const { isModalOpen, setIsModalOpen, data, isLoading, showModal } = useThirdForm({ queryValue });
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="relative w-full">
          <AsyncSearchSelect<FormReviewSchema, RealEstateWitheVotes>
            name="real_estate_name"
            options={data}
            isFetching={isLoading}
            open={open}
            setOpen={setOpen}
            form={form}
            handleClear={handleClear}
            onSelect={onSelect}
            placeholder="Busca el nombre de una Inmobiliaria"
            label="Inmobiliaria"
            className={{ container: 'w-full', item: 'min-w-1/2' }}
            emptyComponent={
              <CreateRealEstateModal
                name="real_estate_name"
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                showModal={showModal}
                triggerComponentModal={() => (
                  <div className="z-10 mt-1 w-full min-w-87.5 rounded-md bg-white">
                    <div className="p-4 text-center">
                      <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        No encontramos la inmobiliaria {watch('real_estate_name')}
                      </p>
                      <Button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                        icon={Plus}
                      >
                        Agregar nueva inmobiliaria
                      </Button>
                    </div>
                  </div>
                )}
                defaultValues={{ real_estate_name: watch('real_estate_name') ?? '' }}
              />
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <FormLabel
          htmlFor="real_estate_experience"
          label="Experiencia con inmobiliaria/propietario"
        />

        <Textarea
          value={watch('real_estate_experience') ?? ''}
          placeholder="Comparte tu experiencia con la inmobiliaria o propietario..."
          rows={3}
          aria-invalid={Boolean(errors?.real_estate_experience)}
          {...register('real_estate_experience')}
        />

        {errors?.real_estate_experience && (
          <p className="text-red-500 text-sm">{errors.real_estate_experience.message}</p>
        )}
      </div>
    </div>
  );
};
