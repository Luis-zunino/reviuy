import { FormLabel } from '@/components/common/Form';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { validateText } from '@/utils';
import type { ThirdFormProps } from './types';
import { RealEstate } from '@/types';
import { AsyncSearchSelect } from '@/components/common/AsyncSearchSelect';
import { FormReviewSchema } from '../../constants';
import { CreateRealEstateModal } from '@/components/features/RealEstate/CreateRealEstate/CreateRealEstateModal';
import { useThirdForm } from './hooks';

export const ThirdForm = (props: ThirdFormProps) => {
  const { form, open, setOpen, handleClear, onSelect, queryValue } = props;
  const {
    formState: { errors },
    watch,
    register,
  } = form;
  const { isModalOpen, setIsModalOpen, handleCreateNew, data, isLoading, showModal } = useThirdForm(
    { queryValue }
  );
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="relative w-full">
          <AsyncSearchSelect<FormReviewSchema, RealEstate>
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
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                defaultValue={watch('real_estate_name')}
                handleCreateNew={handleCreateNew}
                isModal={true}
                showModal={showModal}
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
