'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { FieldValues } from 'react-hook-form';
import type { MultiFormProps } from './types';
import { Stepper } from '../../Stepper';

export const MultiForm = <T extends FieldValues = FieldValues>(props: MultiFormProps<T>) => {
  const {
    formsChildren,
    onSubmit,
    form,
    stepLabels,
    showProgressBar = true,
    isSubmitDisabled,
  } = props;
  const [step, setStep] = useState(0);
  const totalSteps = formsChildren.length;

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleNext = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setStep(0);
      toast.success('Form successfully submitted');
    }
  };

  return (
    <Card className="shadow-sm sm:space-y-4">
      <Stepper
        stepLabels={stepLabels}
        showProgressBar={showProgressBar}
        totalSteps={totalSteps}
        step={step}
      />
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-y-4">
            {formsChildren?.map((_, index) => {
              return step === index ? formsChildren[index] : null;
            })}
            <div className="flex justify-between">
              <Button
                type="button"
                className="font-medium"
                size="sm"
                onClick={handleBack}
                disabled={step === 0}
                aria-label="Ir al paso anterior"
              >
                Atrás
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  disabled={!form.formState.isValid || isSubmitDisabled}
                  type="submit"
                  size="sm"
                  className="font-medium"
                  aria-label="Guardar formulario"
                >
                  Guardar
                </Button>
                <Button
                  type="button"
                  className="font-medium"
                  size="sm"
                  onClick={handleNext}
                  disabled={step === totalSteps - 1}
                  aria-label="Ir al siguiente paso"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
