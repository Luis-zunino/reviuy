import { useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export const useMultiForm = <T extends FieldValues = FieldValues>(props: {
  formsChildren: React.ReactNode[];
  form: UseFormReturn<T, any, T>;
}) => {
  const { formsChildren, form } = props;
  const totalSteps = formsChildren.length;
  const [step, setStep] = useState(0);

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleNext = async () => {
    // const isValid = await form.trigger();

    // if (!isValid) {
    //   toast.error('Por favor completa todos los campos requeridos');
    //   return;
    // }

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setStep(0);
      toast.success('Form successfully submitted');
    }
  };
  return { step, totalSteps, handleBack, handleNext };
};
