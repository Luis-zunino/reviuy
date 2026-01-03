import { useAuthMutation } from './useAuthMutation.hook';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

export const createAuthMutation = <TData, TError = Error, TVariables = unknown>(
  serviceFn: (variables: TVariables & { user_id: string }) => Promise<TData>,
  config?: {
    authErrorMessage?: string;
    requiredRole?: string[];
    mutationOptions?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>;
  }
) => {
  return (
    customOptions?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
  ): UseMutationResult<TData, TError, TVariables> => {
    return useAuthMutation({
      mutationFn: serviceFn,
      ...config,
      ...customOptions,
    });
  };
};
