import { FormLabel } from '@/components/common/Form';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { Controller } from 'react-hook-form';
import { validateText } from '@/utils';
import type { ThirdFormProps } from './types';
import { RealEstate } from '@/types';
import { AsyncSearchSelect } from '@/components/common/AsyncSearchSelect';
import { FormReviewSchema } from '../../constants';
import { CreateRealEstateModal } from '@/components/features/RealEstate/CreateRealEstate/CreateRealEstateModal';
import { useThirdForm } from './hooks';

export const ThirdForm = (props: ThirdFormProps) => {
  const {
    control,
    errors,
    form,
    open,
    setOpen,
    handleClear,
    onSelect,
    placeholder,
    label,
    description,
    queryValue,
  } = props;

  const { isModalOpen, setIsModalOpen, handleCreateNew, data, isLoading, showModal } = useThirdForm(
    { queryValue }
  );
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <FormLabel
          htmlFor="real_estate_experience"
          label="Experiencia con inmobiliaria/propietario"
        />
        <Controller
          name="real_estate_experience"
          control={control}
          rules={{
            validate: (value) => {
              if (!value) return true;
              const validation = validateText(value);
              return validation.isValid || validation.message;
            },
          }}
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value ?? ''}
              placeholder="Comparte tu experiencia con la inmobiliaria o propietario..."
              rows={3}
              className={errors?.real_estate_experience ? 'border-red-500' : ''}
            />
          )}
        />
        {errors?.real_estate_experience && (
          <p className="text-red-500 text-sm">{errors.real_estate_experience.message}</p>
        )}
      </div>
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
            placeholder={placeholder}
            label={label}
            description={description}
            className={{ container: 'w-full', item: 'min-w-1/2' }}
            emptyComponent={
              <CreateRealEstateModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                defaultValue={form.watch('real_estate_name')}
                handleCreateNew={handleCreateNew}
                isModal={true}
                showModal={showModal}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};
