import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface StepperProps {
  stepLabels: string[] | undefined;
  showProgressBar: boolean;
  totalSteps: number;
  step: number;
}
export const Stepper = (props: StepperProps) => {
  const { stepLabels, showProgressBar, totalSteps, step } = props;
  const progressPercentage = ((step + 1) / totalSteps) * 100;

  return (
    <div className="px-6 pt-6 space-y-3">
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
  );
};
