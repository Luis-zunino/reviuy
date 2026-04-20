import type { UseCaseHandler } from '@/shared/kernel/contracts';

export interface ExampleUseCaseInput {
  exampleId: string;
}

export interface ExampleUseCaseOutput {
  success: boolean;
}

export type ExampleUseCaseDependencies = Record<string, never>;

export const createExampleUseCase = (
  _dependencies: ExampleUseCaseDependencies
): UseCaseHandler<ExampleUseCaseInput, ExampleUseCaseOutput> => {
  return async (_input) => {
    throw new Error('Implementar caso de uso');
  };
};
