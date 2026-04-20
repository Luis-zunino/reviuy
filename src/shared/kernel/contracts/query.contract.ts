export interface QueryService<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

export type QueryHandler<TInput, TOutput> = (input: TInput) => Promise<TOutput>;
