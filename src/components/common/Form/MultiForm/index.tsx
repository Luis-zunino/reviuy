'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FieldValues } from 'react-hook-form';
import type { MultiFormProps } from './types';
import { Stepper } from '../../Stepper';
import { useMultiForm } from './hooks';

export const MultiForm = <T extends FieldValues = FieldValues>(props: MultiFormProps<T>) => {
  const {
    formsChildren,
    onSubmit,
    form,
    stepLabels,
    showProgressBar = true,
    isSubmitDisabled,
  } = props;
  const { step, totalSteps, handleBack, handleNext } = useMultiForm({ formsChildren, form });

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
              {step !== 0 ? (
                <Button
                  type="button"
                  className="font-medium"
                  size="sm"
                  onClick={handleBack}
                  aria-label="Ir al paso anterior"
                >
                  Atrás
                </Button>
              ) : null}
              <div className="flex items-center gap-2 flex-1 justify-end">
                <Button
                  disabled={!form.formState.isValid || isSubmitDisabled}
                  type="submit"
                  size="sm"
                  className="font-medium"
                  aria-label="Guardar formulario"
                >
                  Guardar
                </Button>
                {step !== totalSteps - 1 ? (
                  <Button
                    type="button"
                    className="font-medium"
                    size="sm"
                    onClick={handleNext}
                    aria-label="Ir al siguiente paso"
                  >
                    Siguiente
                  </Button>
                ) : null}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
