import type { MutateOptions, UseMutationOptions } from '@tanstack/react-query';

export type UseAuthMutationConfig<TData, TError, TVariables> = {
  mutationFn: (variables: TVariables & { user_id: string }) => Promise<TData>;
  authErrorMessage?: string;
  mutationOptions?:
    | MutateOptions<TData, TError, TVariables>
    | UseMutationOptions<TData, TError, TVariables>;
} & Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>;
