export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

export type UseCaseHandler<TInput, TOutput> = (input: TInput) => Promise<TOutput>;
