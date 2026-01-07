import { PageStateWrapper } from '@/components/common';
import { MultiForm } from '@/components/common/Form';
import React from 'react';
import { FirstForm } from '../FirstForm';
import { SecondForm } from '../SecondForm';
import { ThirdForm } from '../ThirdForm';
import type { ReviewFormProps } from './types';

export const ReviewForm = (props: ReviewFormProps) => {
  const {
    isAuthenticated,
    userId,
    loading,
    errors,
    selectedAddress,
    handleAddressSelect,
    fields,
    replace,
    control,
    form,
    handleSubmit,
    onSubmit,
    append,
    remove,
    defaultRealEstateId,
    hasExistingReview,
  } = props;

  return (
    <PageStateWrapper
      isAuthenticated={!isAuthenticated || !userId}
      isLoading={loading}
      isError={false}
      title="Comparte tu experiencia"
      subtitle="Busca una dirección y comparte tu experiencia para ayudar a otros."
    >
      <MultiForm
        onSubmit={handleSubmit(onSubmit)}
        formsChildren={[
          <FirstForm
            key="firstForm"
            control={control}
            errors={errors}
            selectedAddress={selectedAddress}
            handleAddressSelect={handleAddressSelect}
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
            defaultRealEstateId={defaultRealEstateId}
            errors={errors}
          />,
        ]}
        form={form}
        isSubmitDisabled={hasExistingReview}
      />
    </PageStateWrapper>
  );
};
