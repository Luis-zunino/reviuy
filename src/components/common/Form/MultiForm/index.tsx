'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { FieldValues } from 'react-hook-form';
import { Progress } from '@/components/ui/progress';
import type { MultiFormProps } from './types';

export const MultiForm = <T extends FieldValues = FieldValues>(props: MultiFormProps<T>) => {
  const { formsChildren, onSubmit, form, stepLabels, showProgressBar = true } = props;
  const [step, setStep] = useState(0);
  const totalSteps = formsChildren.length;
  const progressPercentage = ((step + 1) / totalSteps) * 100;

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
    <Card className="shadow-sm space-y-4">
      {/* Progress indicator mejorado */}
      <div className="px-6 pt-6 space-y-3">
        {/* Indicador de paso actual */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            {stepLabels && stepLabels[step] ? stepLabels[step] : `Paso ${step + 1}`}
          </span>
          <span className="text-xs text-muted-foreground">
            {step + 1} de {totalSteps}
          </span>
        </div>

        {showProgressBar && <Progress value={progressPercentage} className="h-2" />}

        <div className="flex items-center justify-center">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full transition-all duration-300 ease-in-out',
                  'flex items-center justify-center text-xs font-semibold',
                  index === step && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                  index < step && 'bg-primary text-primary-foreground',
                  index > step && 'bg-muted text-muted-foreground'
                )}
                role="progressbar"
                aria-valuenow={index + 1}
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-label={`Paso ${index + 1} de ${totalSteps}`}
              >
                {index < step ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    'w-12 h-0.5 transition-all duration-300',
                    index < step ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-y-4">
            <Card>
              <CardContent className="space-y-6">
                {formsChildren?.map((_, index) => {
                  return step === index ? formsChildren[index] : null;
                })}
              </CardContent>
            </Card>
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
                  disabled={!form.formState.isValid}
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
