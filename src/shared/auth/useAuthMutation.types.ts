import type { MutateOptions, UseMutationOptions } from '@tanstack/react-query';

export type UseAuthMutationConfig<TData, TError, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  authErrorMessage?: string;
  showErrorToast?: boolean;
  errorToastMessage?: string | ((error: TError) => string);
  mutationOptions?:
    | MutateOptions<TData, TError, TVariables>
    | UseMutationOptions<TData, TError, TVariables>;
} & Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>;
