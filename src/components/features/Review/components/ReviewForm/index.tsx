import { PageWithSidebar } from '@/components/common';
import { MultiForm } from '@/components/common/Form';
import React from 'react';
import { FirstForm } from '../FirstForm';
import { SecondForm } from '../SecondForm';
import { ThirdForm } from '../ThirdForm';
import type { ReviewFormProps } from './types';

export const ReviewForm = (props: ReviewFormProps) => {
  const {
    isLoading,
    errors,
    fields,
    replace,
    control,
    form,
    handleSubmit,
    onSubmit,
    append,
    remove,
    isSubmitDisabled,
    onSelectAddress,
    open,
    setOpen,
    queryValue,
    handleClearAddress,
    openRealEstateModal,
    setOpenRealEstateModal,
    handleClearRealEstate,
    onSelectRealEstate,
    queryValueRealEstate,
  } = props;
  return (
    <PageWithSidebar
      authIsRequired={true}
      isLoading={isLoading}
      title="Comparte tu experiencia"
      description="Busca una dirección y comparte tu experiencia para ayudar a otros."
    >
      <MultiForm
        onSubmit={handleSubmit(onSubmit)}
        formsChildren={[
          <FirstForm
            key="firstForm"
            control={control}
            errors={errors}
            form={form}
            open={open}
            setOpen={setOpen}
            queryValue={queryValue}
            handleClear={handleClearAddress}
            onSelectAddress={onSelectAddress}
          />,
          <SecondForm
            key="secondForm"
            control={control}
            fields={fields}
            replace={replace}
            append={append}
            remove={remove}
          />,
          <ThirdForm
            key="thirdForm"
            control={control}
            errors={errors}
            form={form}
            open={openRealEstateModal}
            setOpen={setOpenRealEstateModal}
            handleClear={handleClearRealEstate}
            onSelect={onSelectRealEstate}
            placeholder="Busca el nombre de una Inmobiliaria"
            label="Inmobiliaria"
            queryValue={queryValueRealEstate}
          />,
        ]}
        form={form}
        isSubmitDisabled={isSubmitDisabled}
      />
    </PageWithSidebar>
  );
};
