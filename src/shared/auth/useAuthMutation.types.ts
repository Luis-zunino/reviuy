import type {
  MutateOptions,
  QueryKey,
  UseMutationOptions,
} from '@tanstack/react-query';

export type UseAuthMutationConfig<TData, TError, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  authErrorMessage?: string;
  showErrorToast?: boolean;
  errorToastMessage?: string | ((error: TError) => string);
  /** Query keys to invalidate on mutation success. */
  invalidateQueryKeys?: QueryKey[];
  mutationOptions?:
    | MutateOptions<TData, TError, TVariables>
    | UseMutationOptions<TData, TError, TVariables>;
} & Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>;
