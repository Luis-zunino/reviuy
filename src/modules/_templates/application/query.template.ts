import type { QueryHandler } from '@/shared/kernel/contracts';

export interface ExampleQueryInput {
  exampleId: string;
}

export interface ExampleQueryOutput {
  items: string[];
}

export type ExampleQueryDependencies = Record<string, never>;

export const createExampleQuery = (
  _dependencies: ExampleQueryDependencies
): QueryHandler<ExampleQueryInput, ExampleQueryOutput> => {
  return async (_input) => {
    throw new Error('Implementar query service');
  };
};
