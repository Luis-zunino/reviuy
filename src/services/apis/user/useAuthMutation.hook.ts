import { useMutation, UseMutationResult } from '@tanstack/react-query';
import type { UseAuthMutationConfig } from './types';
import { useVerifyAuthentication } from './verifyAuthentication.hook';
import { toast } from 'sonner';

export const useAuthMutation = <TData, TError = Error, TVariables = unknown>(
  config: UseAuthMutationConfig<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> => {
  const {
    mutationFn,
    authErrorMessage = 'Debes iniciar sesión para realizar esta acción',
    ...mutationOptions
  } = config;
  const { data, error } = useVerifyAuthentication();
  const authenticatedMutationFn = async (variables: TVariables): Promise<TData> => {
    if (error || !data?.userId) {
      toast.warning(authErrorMessage);
      throw new Error(authErrorMessage);
    }

    return mutationFn({
      ...variables,
      user_id: data?.userId,
    });
  };

  return useMutation({
    mutationFn: authenticatedMutationFn,
    ...mutationOptions,
  });
};
